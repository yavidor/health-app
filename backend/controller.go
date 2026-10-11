package main

import (
	"fmt"
	"health-app/db"
	"net/http"
	"time"
)

type controller struct {
	logger  *Logger
	mux     *http.ServeMux
	queries *db.Queries
}

func (c *controller) handleHello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
	c.logger.Info("Hello World")
}

func (c *controller) logMiddleware(handler http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c.logger.Warn("YABA DABA DOO")
		c.logger.Info("IP", "addr", r.RemoteAddr)
		c.logger.Info("Headers", "headers", r.Header)
		handler.ServeHTTP(w, r)
	}
}

func NewController(logger *Logger, staticDir string, queries *db.Queries) http.HandlerFunc {
	c := &controller{logger, http.NewServeMux(), queries}
	c.mux.HandleFunc("/a", c.handleHello)
	c.mux.Handle("/", http.FileServer(http.Dir(staticDir)))
	return c.logMiddleware(c.mux)
}
