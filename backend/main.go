package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"
)

func greet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World! %s", time.Now())
	fmt.Println("Hello World")
}

type router struct {
	endpoints map[string]http.HandlerFunc
	logger    *slog.Logger
}

func main() {
	logger := CreateLogger()
	router := &router{map[string]http.HandlerFunc{"/": greet}, logger}
	for k, v := range router.endpoints {
		http.Handle(k, v)

	}
	http.ListenAndServe(":8080", nil)
}
