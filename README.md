# ACPanel

ACPanel is a control panel for managing customer web hosting on your VPS infrastructure.
It is designed to manage customer records, domains and subdomains, app packages, activity logs,
deployment scripts, and operational API actions such as recreate and backup.

## Vision

Build a modular hosting platform for `alonersoft.com` and related customer domains that can:

- Manage customer profiles and contact data
- Manage domain names, subdomains, DNS, SSL, and web server config
- Provide installable app packages for customers
- Store Docker Stack templates and deployment scripts
- Track activity logs and operational events
- Expose secure APIs for recreate, backup, and runtime administration

## Target Stack

- PostgreSQL (latest stable)
- Node.js API (latest stable)
- Angular frontend
- BIND9 for DNS management
- Nginx for reverse proxy and UI delivery
- Docker / Docker Stack orchestration
- Let's Encrypt SSL automation

## Proposed Workspace Layout

```text
ACPanel/
|- apps/
|  |- api/                # Main Node.js API application
|  `- web/                # Angular frontend application
|- services/
|  |- auth-service/
|  |- bind9-service/
|  |- app-packet-service/
|  |- docker-command-service/
|  |- file-manager-service/
|  |- nginx-config-service/
|  |- scan-upload-service/
|  `- ssl-service/
|- packages/
|  `- shared/             # Shared DTOs, config contracts, helpers
|- infra/
|  |- bind9/
|  |- docker/
|  |- nginx/
|  `- postgres/
|- scripts/
|  |- backup/
|  |- docker/
|  `- recreate/
`- docs/
   |- architecture/
   `- modules/
```

## Initial Module Map

### Core business areas

1. Customer Management
2. Domain and Subdomain Management
3. App Package Catalog
4. Docker Stack and Runtime Automation
5. File Management and Upload Scanning
6. SSL Certificate Automation
7. Nginx / BIND9 Configuration Management
8. Audit Logs and Operational Logs

### Backend services

- `auth-service`: login, RBAC, API token, session policy
- `bind9-service`: DNS zone generation, reload orchestration
- `app-packet-service`: app package catalog, install definition, versioning
- `docker-command-service`: build, deploy, recreate, backup hooks
- `file-manager-service`: customer file operations and storage mapping
- `scan-upload-service`: upload validation and malware scan workflow
- `ssl-service`: Let's Encrypt issue / renew / revoke flows
- `nginx-config-service`: virtual host generation and config reloads

## Suggested Next Steps

1. Scaffold the Node.js API with module boundaries and database ORM.
2. Scaffold the Angular frontend with admin dashboard layout.
3. Design the PostgreSQL schema from the entities in `docs/architecture/domain-model.md`.
4. Create Docker Compose for local development.
5. Add authentication and audit logging first, because every admin action should be traceable.

## Environment Reference

- VPS IP: `194.233.84.216`
- Primary domain: `alonersoft.com`

This repository currently contains the initial project structure and design documentation.

## Backend Scaffold Status

The repository now includes:

- a Node.js + TypeScript API scaffold in `apps/api`
- Prisma schema for the first ACPanel data model
- shared validation schemas in `packages/shared`
- local PostgreSQL container config in `infra/docker/docker-compose.yml`
- an Angular dashboard scaffold in `apps/web`
- Dockerfiles and compose stacks for development and VPS deployment

### Quick start

1. Start PostgreSQL from `infra/docker/docker-compose.yml`
2. Create `.env` from `.env.example`
3. Run `npm install`
4. Run `npm run prisma:generate`
5. Run `npm run prisma:migrate`
6. Run `npm run dev:api`
7. Run `npm run dev:web`

### Docker quick start

- Development:
  - `docker compose -f infra/docker/docker-compose.dev.yml up --build`
- Production:
  - `docker compose --env-file infra/docker/.env.prod -f infra/docker/docker-compose.prod.yml up -d --build`
