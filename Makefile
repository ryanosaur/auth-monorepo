.PHONY: install dev build clean help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install
	cd frontend && npm install
	cd bff && npm install
	cd user-service && npm install

dev: ## Start all services in development mode
	npm run dev

dev-frontend: ## Start only the frontend
	npm run dev:frontend

dev-bff: ## Start only the BFF
	npm run dev:bff

dev-user-service: ## Start only the user service
	npm run dev:user-service

build: ## Build the frontend
	npm run build

clean: ## Remove all node_modules
	rm -rf node_modules frontend/node_modules bff/node_modules user-service/node_modules

setup-env: ## Set up environment variables interactively
	chmod +x .env.setup.sh
	./.env.setup.sh

docker-up: ## Start all services with Docker Compose
	docker-compose up

docker-down: ## Stop all Docker services
	docker-compose down

docker-build: ## Build Docker images
	docker-compose build
