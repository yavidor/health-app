package main

import (
	"context"
	"health-app/db"
	"net/http"
)

const (
	DB_PATH_ENV    = "DB_PATH"
	STATIC_DIR_ENV = "STATIC_DIR"
)

func main() {
	ctx := context.Background()
	logger := CreateLogger()
	dbPath, err := getEnvOrErr(DB_PATH_ENV)
	orFatal(err, logger)
	staticDir, err := getEnvOrErr(STATIC_DIR_ENV)
	orFatal(err, logger)
	database, err := db.Open(dbPath)
	orFatal(err, logger)
	defer database.Close()

	applied, err := db.Migrate(ctx, database)
	orFatal(err, logger)
	logger.Info("migrations applied", "count", applied)

	controller := NewController(logger, staticDir, db.New(database))
	orFatal(http.ListenAndServe(":8080", controller), logger)
}
