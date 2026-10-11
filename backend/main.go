package main

import (
	"context"
	"database/sql"
	"health-app/db"
	"net/http"

	_ "modernc.org/sqlite"
)

func main() {
	ctx := context.Background()
	logger := CreateLogger()
	staticDir := "/home/yavidor/gitProjects/health-app/frontend/dist"
	database, err := sql.Open("sqlite", "health.db?_pragma=foreign_keys(1)")
	orFatal(err, logger)
	applied, err := db.Migrate(ctx, database)
	orFatal(err, logger)
	logger.Info("migrations applied", "count", applied)
	controller := NewController(logger, staticDir, db.New(database))
	orFatal(http.ListenAndServe(":8080", controller), logger)
}
