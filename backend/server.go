package main

import (
	"health-app/logs"
	"net/http"
)

type server struct {
	logger    *logs.Logger
	staticDir string
	mux       *http.ServeMux
}

func (c *server) logMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c.logger.Info("IP", "addr", r.RemoteAddr)
		c.logger.Info("Headers", "headers", r.Header)
		handler.ServeHTTP(w, r)
	})
}

func (s *server) mountHandler(prefix string, handler http.Handler) {
	s.mux.Handle(prefix+"/", http.StripPrefix(prefix, handler))
}

func NewServer(logger *logs.Logger, staticDir string) *server {
	s := &server{logger, staticDir, http.NewServeMux()}
	s.mux.Handle("/", http.FileServer(http.Dir(staticDir)))
	return s
}

// So the Server implement the http.handler interface
func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.logMiddleware(s.mux).ServeHTTP(w, r)
}
