package main

import (
	"context"
	"health-app/db"
	"health-app/user"
	"health-app/utils"
	"net/http"
)

const (
	DB_PATH_ENV    = "DB_PATH"
	STATIC_DIR_ENV = "STATIC_DIR"
)

func main() {
	ctx := context.Background()
	logger := utils.CreateLogger()
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
	querier := db.New(database)

	server := NewServer(logger, staticDir)
	server.mountHandler("/user", user.NewController(user.NewService(querier), logger))
	utils.OrFatal(http.ListenAndServe(":8080", server), logger)
}
