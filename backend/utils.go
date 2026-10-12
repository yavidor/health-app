package main

import (
	"fmt"
	"os"
)

func failOnError(errors []error, logger *Logger) {
	for _, v := range errors {
		if v != nil {
			logger.Fatal(v)
		}
	}
}

func orFatal(err error, logger *Logger) {
	if err != nil {
		logger.Fatal(err)
	}
}

func getEnvOrErr(envName string) (string, error) {
	if envValue := os.Getenv(envName); envValue != "" {
		return envValue, nil
	}
	return "", fmt.Errorf("Env %s wasn't found")
}
