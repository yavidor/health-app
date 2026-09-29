package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	addr := flag.String("addr", ":8080", "listen address")
	staticDir := flag.String("static", "../frontend/dist", "frontend build directory")
	spa := flag.String("spa", "../frontend/dist/index.html", "fallback file for client-side routing")
	flag.Parse()

	abs, err := filepath.Abs(*staticDir)
	if err != nil {
		log.Fatalf("static dir: %v", err)
	}
	if _, err := os.Stat(abs); err != nil {
		log.Fatalf("static dir %q not found: %v (run `npm run build` in frontend/)", abs, err)
	}
	spaPath, err := filepath.Abs(*spa)
	if err != nil {
		log.Fatalf("spa file: %v", err)
	}

	fs := http.FileServer(http.Dir(abs))
	log.Printf("serving %s on %s", abs, *addr)
	log.Fatal(http.ListenAndServe(*addr, spaHandler(fs, abs, spaPath)))
}

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
