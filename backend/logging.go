package main

import (
	"log/slog"
	"os"
	"runtime/debug"
)

type Logger struct {
	*slog.Logger
	LogLevel slog.Level
}

const (
	LOG_LEVEL_ENV = "LOG_LEVEL"
)

func CreateLogger() *Logger {
	var level slog.Level = slog.LevelInfo
	if levelStr := os.Getenv(LOG_LEVEL_ENV); levelStr != "" {
		switch levelStr {
		case "DEBUG":
			level = slog.LevelDebug
		case "INFO":
			level = slog.LevelInfo
		case "WARN":
			level = slog.LevelWarn
		case "ERROR":
			level = slog.LevelError
		}
	}
	return &Logger{slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{AddSource: true})), level}
	// return &Logger{slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true})), level}
}

func (logger *Logger) Fatal(v any) {
	logger.Error("BIG OOPSY", "trace", string(debug.Stack()))
	os.Exit(1)
}
