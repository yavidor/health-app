package main

import (
	"context"
	"crypto/sha256"
	"flag"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	addr := flag.String("addr", ":8080", "listen address")
	staticDir := flag.String("static", "../frontend/dist", "frontend build directory")
	spa := flag.String("spa", "../frontend/dist/index.html", "fallback file for client-side routing")
	level := flag.String("log-level", "info", "log level: debug, info, warn, error")
	logFormat := flag.String("log-format", "text", "log format: text or json")
	flag.Parse()

	logger := newLogger(*level, *logFormat)
	slog.SetDefault(logger)

	abs, err := filepath.Abs(*staticDir)
	if err != nil {
		logger.Error("static dir", "error", err)
		os.Exit(1)
	}
	if _, err := os.Stat(abs); err != nil {
		logger.Error("static dir not found, run `npm run build` in frontend/", "dir", abs, "error", err)
		os.Exit(1)
	}
	spaPath, err := filepath.Abs(*spa)
	if err != nil {
		logger.Error("spa file", "error", err)
		os.Exit(1)
	}

	// Chain handlers: request logging -> static files with SPA fallback
	handler := errorLogger(logger, spaHandler(http.FileServer(http.Dir(abs)), abs, spaPath))

	srv := &http.Server{
		Addr:              *addr,
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	logger.Info("server starting", "addr", *addr, "static", abs, "spa", spaPath)

	ln, err := net.Listen("tcp", *addr)
	if err != nil {
		logger.Error("listen", "addr", *addr, "error", err)
		os.Exit(1)
	}
	if err := srv.Serve(ln); err != nil && err != http.ErrServerClosed {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
	logger.Info("server stopped")
}

func newLogger(level, format string) *slog.Logger {
	var lvl slog.Level
	switch strings.ToLower(level) {
	case "debug":
		lvl = slog.LevelDebug
	case "warn":
		lvl = slog.LevelWarn
	case "error":
		lvl = slog.LevelError
	default:
		lvl = slog.LevelInfo
	}
	opts := &slog.HandlerOptions{Level: lvl}

	var h slog.Handler
	if strings.EqualFold(format, "json") {
		h = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		h = slog.NewTextHandler(os.Stdout, opts)
	}
	return slog.New(h)
}

type statusRecorder struct {
	http.ResponseWriter
	status      int
	bytes       int
	wroteHeader bool
}

func (w *statusRecorder) WriteHeader(code int) {
	// net/http ignores every WriteHeader after the first; do the same so the
	// logged status matches what the client actually received.
	if w.wroteHeader {
		return
	}
	w.wroteHeader = true
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *statusRecorder) Write(b []byte) (int, error) {
	if !w.wroteHeader {
		w.WriteHeader(http.StatusOK)
	}
	n, err := w.ResponseWriter.Write(b)
	w.bytes += n
	return n, err
}

// Unwrap lets http.ResponseController reach the underlying writer, which keeps
// flushing, hijacking and HTTP/2 push working through this wrapper.
func (w *statusRecorder) Unwrap() http.ResponseWriter { return w.ResponseWriter }

// spaHandler serves static files and falls back to the SPA entrypoint for
// unknown paths so client-side routes survive a hard refresh. Build assets are
// never rewritten to HTML: a missing asset must 404 so browsers do not reject
// it with a "disallowed MIME type" error.
func spaHandler(next http.Handler, staticDir, spaFile string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clean := filepath.Clean(r.URL.Path)
		path := filepath.Join(staticDir, filepath.FromSlash(clean))

		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			next.ServeHTTP(w, r)
			return
		}

		if strings.HasPrefix(clean, "/assets/") || filepath.Ext(clean) != "" {
			http.NotFound(w, r)
			return
		}

		http.ServeFile(w, r, spaFile)
	})
}

// =============================================================================
// Context and Request Utilities
// =============================================================================

type contextKey string

var (
	requestKey = contextKey("request")
)

// isDebugLevel checks if the logger is set to debug level
func isDebugLevel(logger *slog.Logger) bool {
	return logger.Enabled(context.Background(), slog.LevelDebug)
}

// WithRequest sets the request context in context
func WithRequest(ctx context.Context, req *RequestContext) context.Context {
	return context.WithValue(ctx, requestKey, req)
}

// GetRequest extracts the request context from context
func GetRequest(ctx context.Context) *RequestContext {
	if r, ok := ctx.Value(requestKey).(*RequestContext); ok {
		return r
	}
	return nil
}

// =============================================================================
// Error Logger Middleware
// =============================================================================

// errorLogger wraps a handler and logs any errors that occur during request processing
func errorLogger(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Extract client information
		clientIP := extractClientIP(r)

		// Try to extract session ID from headers or cookies
		sessionID := ""
		if h := r.Header.Get("X-Session-ID"); h != "" {
			sessionID = h
		}
		if sessionID == "" {
			if cookie, err := r.Cookie("session"); err == nil && cookie.Value != "" {
				sessionID = cookie.Value
			}
		}

		// Extract User-Agent and hash
		userAgent := r.Header.Get("User-Agent")
		uaHash := extractUAHash(userAgent)

		// Create request context with tracing headers
		reqCtx := &RequestContext{
			UserAgent: userAgent,
			SessionID: sessionID,
			IP:        clientIP,
			UAHash:    uaHash,
		}

		// Wrap response writer to track status and size
		rec := &statusRecorder{ResponseWriter: w}
		w = rec

		// Create context with request
		ctx := WithRequest(r.Context(), reqCtx)
		r = r.WithContext(ctx)

		// Log incoming request at debug level
		if isDebugLevel(logger) {
			logger.Debug("incoming_request", "request", reqCtx)
		}

		// Duration is only known once the handler returns, at which point headers
		// are already sent. It is therefore logged, not returned as a header.
		next.ServeHTTP(w, r)

		duration := time.Since(start).Milliseconds()

		if rec.status == 0 {
			rec.status = http.StatusOK
		}

		// Log error if status code is >= 500 (server errors) or >= 400 (client errors)
		if rec.status >= 500 {
			logger.Error("request_error", "error", rec.status, "duration_ms", duration, "ip", reqCtx.IP, "ua_hash", reqCtx.UAHash)
		} else if rec.status >= 400 {
			logger.Warn("client_error", "error", rec.status, "duration_ms", duration, "ip", reqCtx.IP, "ua_hash", reqCtx.UAHash)
		} else {
			logger.Info("request_completed", "status", rec.status, "duration_ms", duration, "ip", reqCtx.IP, "ua_hash", reqCtx.UAHash)
		}

	})
}

// RequestContext holds request-scoped context values
type RequestContext struct {
	UserAgent   string // Client User-Agent string
	SessionID   string // Optional session/user identifier
	Headers     map[string]string
	QueryParams map[string][]string
	BodySize    int
	IP          string // Client IP address
	UAHash      string // Hash of user agent for grouping
}

// extractUAHash extracts a hash from user agent for grouping similar clients
func extractUAHash(ua string) string {
	if ua == "" {
		return "unknown"
	}
	h := sha256.New()
	h.Write([]byte(ua))
	return fmt.Sprintf("%x", h.Sum(nil)[:8])
}

// extractClientIP extracts the client IP address from request
func extractClientIP(r *http.Request) string {
	// Check X-Forwarded-For header (for proxied requests)
	if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
		parts := strings.Split(forwarded, ",")
		ip := strings.TrimSpace(parts[0])
		// Validate it's actually an IP
		if net.ParseIP(ip) != nil {
			return ip
		}
	}
	// Fall back to RemoteAddr
	addr := r.RemoteAddr
	// Extract just the IP, not port
	if colonIdx := strings.LastIndex(addr, ":"); colonIdx != -1 {
		addr = addr[:colonIdx]
	}
	return addr
}
