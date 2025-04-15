# ---------------------
# ENVIRONMENT VARIABLES
# ---------------------
ENV_FILE=.env
DEV_COMPOSE=docker-compose.dev.yml
PROD_COMPOSE=docker-compose.yml

# ---------------------
# COMMANDS
# ---------------------

## Run in development mode
run-dev:
	docker compose -f $(DEV_COMPOSE) --env-file $(ENV_FILE) up --build

## Run in production mode
run-prod:
	docker compose -f $(PROD_COMPOSE) --env-file $(ENV_FILE) up -d --build

## Soft reset (stop & remove containers only)
soft-reset:
	docker compose -f $(DEV_COMPOSE) down

## Hard reset (stop everything, remove containers, images, volumes, networks)
hard-reset:
	docker compose -f $(DEV_COMPOSE) down --rmi all --volumes --remove-orphans

.PHONY: run-dev run-prod soft-reset hard-reset hard-reset-prod
