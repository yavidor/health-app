package main

import (
	"context"
	"health-app/db"
	"net/http"
)

const dbPathEnv = "HEALTH_DB_PATH"

const staticDirPathEnv = "STATIC_DIR_PATH"

func main() {
	ctx := context.Background()
	logger := CreateLogger()
	dbPath, err := getEnvOrErr(dbPathEnv)
	orFatal(err, logger)
	staticDir, err := getEnvOrErr(staticDirPathEnv)
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
