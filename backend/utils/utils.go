package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func FailOnError(errors []error, logger *Logger) {
	for _, v := range errors {
		if v != nil {
			logger.Fatal(v)
		}
	}
}

func OrFatal(err error, logger *Logger) {
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

func WriteJSON(w http.ResponseWriter, status int, body any, logger *Logger) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		return err
	}
	return nil
}

type Validator interface {
	Validate() error
}

func ReadJSON[T Validator](r *http.Request, logger *Logger) (*T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return nil, err
	}

	return &v, v.Validate()
}
