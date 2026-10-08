.DEFAULT_GOAL := help
.PHONY: help install dev dev-frontend dev-backend build build-pi test lint format deploy clean

help: ## Print available make targets with descriptions
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies for frontend
	npm --prefix frontend install

dev: ## Run frontend Vite dev server and backend Go server concurrently
	@$(MAKE) -j2 dev-frontend dev-backend

dev-frontend: ## Run frontend Vite dev server
	npm --prefix frontend run dev

dev-backend: ## Run backend Go server
	cd backend && go run .

build: ## Build frontend and backend
	npm --prefix frontend run build
	cd backend && go build -o health-app .

build-pi: ## Build frontend and cross-compile backend for Raspberry Pi
	npm --prefix frontend run build
	cd backend && GOOS=linux GOARCH=arm64 go build -o health-app .

test: ## Run frontend and backend tests
	npm --prefix frontend test
	cd backend && go test ./...

lint: ## Run frontend linter and Go vet
	npm --prefix frontend run lint
	cd backend && go vet ./...

format: ## Format frontend and Go code
	npm --prefix frontend run format
	cd backend && go fmt ./...

deploy: ## Execute deployment script
	./deploy/DEPLOY.sh

clean: ## Remove build artifacts
	rm -rf frontend/dist backend/health-app
