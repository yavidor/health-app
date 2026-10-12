package main

import (
	"context"
	"health-app/db"
	"health-app/logs"
	"health-app/utils"
	"net/http"
)

const (
	DB_PATH_ENV    = "DB_PATH"
	STATIC_DIR_ENV = "STATIC_DIR"
)

func main() {
	ctx := context.Background()
	logger := logs.CreateLogger()
	dbPath, err := utils.GetEnvOrErr(DB_PATH_ENV)
	utils.OrFatal(err, logger)
	staticDir, err := utils.GetEnvOrErr(STATIC_DIR_ENV)
	utils.OrFatal(err, logger)
	database, err := db.Open(dbPath)
	utils.OrFatal(err, logger)
	defer database.Close()

	applied, err := db.Migrate(ctx, database)
	utils.OrFatal(err, logger)
	logger.Info("migrations applied", "count", applied)

	server := NewServer(logger, staticDir)
	utils.OrFatal(http.ListenAndServe(":8080", server), logger)
}
