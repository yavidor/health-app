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
	c.endpoints[path] = handler
	return nil
}

func (c *controller) handleHello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
	c.logger.Info("Hello World")
}
func (c *controller) handleGoodbye(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Goodbye World! %s", time.Now())
	c.logger.Info("Goodbye World")
}

func main() {
	logger := CreateLogger()
	controller := &controller{make(map[string]http.Handler), logger}
	err := controller.registerRoute("/a", http.HandlerFunc(controller.handleHello))
	if err != nil {
		log.Fatalf("%q", err)
	}
	err = controller.registerRoute("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("/home/yavidor/gitProjects/health-app/frontend/dist"))))
	if err != nil {
		log.Fatalf("%q", err)
	}
	http.Handle("/", http.FileServer(http.Dir("/home/yavidor/gitProjects/health-app/frontend/")))
	for k, v := range controller.endpoints {
		logger.Info(k)
		http.Handle(k, v)
	}
	logger.Fatal(http.ListenAndServe(":8080", nil))
}
