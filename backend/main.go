package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type controller struct {
	endpoints map[string]http.Handler
	logger    *Logger
}

func (c *controller) registerRoute(path string, handler http.Handler) error {
	if _, ok := c.endpoints[path]; ok {
		return fmt.Errorf("Path %s already exists", path)
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

func (c *controller) handleExit(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("YALLA BYE\n"))
	go func() {
		// Wait briefly to ensure the HTTP response is fully flushed to the client
		time.Sleep(500 * time.Millisecond)
		c.logger.Fatal(fmt.Errorf("Oopsy"))
	}()
}

func main() {
	logger := CreateLogger()
	var fileServer http.Handler = http.FileServer(http.Dir("/home/yavidor/gitProjects/health-app/frontend/dist"))
	controller := &controller{make(map[string]http.Handler), logger}
	err := controller.registerRoute("/a", http.HandlerFunc(controller.handleHello))
	if err != nil {
		log.Fatalf("%q", err)
	}
	err = controller.registerRoute("/", fileServer)
	if err != nil {
		log.Fatalf("%q", err)
	}
	err = controller.registerRoute("/exit", http.HandlerFunc(controller.handleExit))
	if err != nil {
		log.Fatalf("%q", err)
	}
	logger.Fatal(http.ListenAndServe(":8080", nil))
}
