package utils

import (
	"encoding/json"
	"fmt"
	"health-app/logs"
	"net/http"
	"os"
)

func FailOnError(errors []error, logger *logs.Logger) {
	for _, v := range errors {
		if v != nil {
			logger.Fatal(v)
		}
	}
}

func OrFatal(err error, logger *logs.Logger) {
	if err != nil {
		logger.Fatal(err)
	}
}

func GetEnvOrErr(envName string) (string, error) {
	if envValue := os.Getenv(envName); envValue != "" {
		return envValue, nil
	}
	return "", fmt.Errorf("missing required environment variable %s", envName)
}

func WriteJSON(w http.ResponseWriter, status int, body any, logger *logs.Logger) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		logger.Error("encode response", "err", err)
	}
}
