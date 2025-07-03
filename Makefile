# Variables
BUN := bun
CARGO := cargo
TSC := bunx tsc

.PHONY: help install build build-dev test lint run dev frontend check clean
.DEFAULT_GOAL := help

help: ## 💬 Display this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## 📦 Install dependencies
	@echo "Installing dependencies..."
	@$(BUN) install

build: install ## 🏗️ Build production release
	@echo "Building production release..."
	@$(BUN) run tauri build

build-dev: install ## 🔧 Build debug version
	@echo "Building debug version..."
	@$(BUN) run tauri build --debug

test: install ## 🧪 Run all tests
	@echo "Running TypeScript type checking..."
	@$(TSC) --noEmit
	@echo "Running Rust tests..."
	@cd src-tauri && $(CARGO) test

lint: install ## 📜 Format and lint code
	@echo "Formatting Rust code..."
	@cd src-tauri && $(CARGO) fmt
	@echo "Running Rust linting..."
	@cd src-tauri && $(CARGO) clippy -- -D warnings

run: install ## 🚀 Start development server
	@echo "Starting development server..."
	@$(BUN) run tauri dev

dev: run ## 🚀 Alias for run

frontend: install ## 🌐 Run frontend only
	@echo "Running frontend only..."
	@$(BUN) run dev

check: install ## 🔍 Type checking without build
	@echo "Type checking..."
	@$(TSC) --noEmit

clean: ## 🧹 Clean build artifacts
	@echo "Cleaning build artifacts..."
	@cd src-tauri && $(CARGO) clean
	@rm -rf dist/
	@rm -rf node_modules/.vite/
