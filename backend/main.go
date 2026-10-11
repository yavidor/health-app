package main

import (
	"fmt"
	"net/http"
	"time"

	_ "modernc.org/sqlite"
)

type controller struct {
	endpoints []string
	logger    *Logger
}

func (c *controller) registerRoute(path string, handler http.Handler) error {
	for _, endpoint := range c.endpoints {
		if endpoint == path {
			return fmt.Errorf("Path %s already exists", path)
		}
	}
	http.Handle(path, c.logMiddleware(handler))
	return nil
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

func main() {
	logger := CreateLogger()
	controller := &controller{make([]string, 1), logger}
	// TODO: open the database, then call db.Migrate(ctx, conn) here so that
	// migrations apply at startup (issue #20).
	orFatal(controller.registerRoute("/a", http.HandlerFunc(controller.handleHello)), logger)
	orFatal(controller.registerRoute("/", http.FileServer(http.Dir("/home/yavidor/gitProjects/health-app/frontend/dist"))), logger)
	orFatal(http.ListenAndServe(":8080", nil), logger)
}
