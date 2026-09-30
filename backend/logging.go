package main

import "log/slog"

func CreateLogger() *slog.Logger {
	return slog.Default()
}
