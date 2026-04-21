# Docker Infrastructure

This folder now contains container definitions for:

- PostgreSQL
- Node.js API
- Angular frontend
- Nginx static hosting for production UI

## Files

- `docker-compose.yml`: minimal PostgreSQL service
- `docker-compose.dev.yml`: development stack for `postgres`, `api`, and `web`
- `docker-compose.prod.yml`: production stack for VPS deployment
- `.env.prod.example`: production environment template

## Development

Run from repo root:

- `docker compose -f infra/docker/docker-compose.dev.yml up --build`

Note:

- first boot in development may take longer because `api` and `web` install npm dependencies inside containers

## Production

1. Copy `.env.prod.example` to `infra/docker/.env.prod`
2. Set secure secrets
3. Run:
   - `docker compose --env-file infra/docker/.env.prod -f infra/docker/docker-compose.prod.yml up -d --build`
