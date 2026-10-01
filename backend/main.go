package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type controller struct {
	endpoints map[string]http.HandlerFunc
	logger    *Logger
}

func (c *controller) registerRoute(path string, handler http.HandlerFunc) error {
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
	os.Remove("./temp.db")
	logger := CreateLogger()
	db, err := sql.Open("sqlite3", "./temp.db")
	if err != nil {
		fmt.Printf("%q", err)
		os.Exit(1)
	}
	defer db.Close()
	statement := `
	create table foo (id integer not null primary key, name text);
	`
	_, err = db.Exec(statement)
	if err != nil {
		logger.Error("%q", err)
		os.Exit(2)
	}
	tx, err := db.Begin()
	insertStatement, err := tx.Prepare("insert into foo(id,name) values(?, ?)")
	for i := 0; i < 100; i++ {
		_, err = insertStatement.Exec(i, fmt.Sprintf("%d", i))
		if err != nil {
			logger.Error("%q", err)
			os.Exit(3)
		}
	}
	err = tx.Commit()
	if err != nil {
		logger.Error("%q", err)
		os.Exit(4)
	}
	rows, err := db.Query("select id, name from foo")
	if err != nil {
		logger.Error("%q", err)
		os.Exit(5)
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var name string
		err = rows.Scan(&id, &name)
		if err != nil {
			logger.Error("%q", err)
			os.Exit(6)
		}

		logger.Info(fmt.Sprintf("id: %d, name: %s", id, name))
	}
	err = rows.Err()
	if err != nil {
		logger.Error("%q", err)
		os.Exit(7)
	}
	logger.Info("Ok, moving on")
	logger.Info(fmt.Sprintf("%#v", logger))
	logger.Info(fmt.Sprintf("%#v", logger.LogLevel.Level()))
	controller := &controller{make(map[string]http.HandlerFunc), logger}
	err = controller.registerRoute("/", controller.handleHello)
	if err != nil {
		log.Fatalf("%q", err)
	}
	for k, v := range controller.endpoints {
		http.Handle(k, v)
	}
	logger.Fatal(http.ListenAndServe(":8082", nil))
}
