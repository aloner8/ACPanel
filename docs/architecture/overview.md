# ACPanel Architecture Overview

## Goal

ACPanel is an internal and customer-facing management platform for hosted websites and deployable applications.
It centralizes operational data and automates infrastructure actions on a VPS environment.

## High-Level Architecture

### Frontend

- Angular application for admin and operator workflows
- Dashboard for customer, domain, package, deployment, and log management
- API client module for secure communication with backend services

### Backend

- Main Node.js API entrypoint in `apps/api`
- Domain-driven modules for customers, domains, packages, scripts, jobs, logs, auth
- Internal service adapters for BIND9, Docker, Nginx, SSL, file management, and scanning

### Data Layer

- PostgreSQL as the primary relational database
- Shared schema for business entities and audit records
- Script metadata and deployment history stored for reproducibility

### Infrastructure Layer

- Nginx for reverse proxy and hosted site routing
- BIND9 for DNS zone management
- Docker / Docker Stack for provisioning apps and customer workloads
- Let's Encrypt for SSL certificate lifecycle

## Suggested Deployment Flow

1. Admin creates customer record.
2. Admin registers root domain or subdomain.
3. Admin chooses app package or custom Docker Stack template.
4. API validates configuration and stores deployment request.
5. Infrastructure services generate:
   - DNS records
   - Nginx virtual host config
   - SSL request
   - Docker Stack or compose definition
6. Deployment job runs and emits logs.
7. Audit log records the operator and action result.

## Suggested Security Model

- Role-based access control for admin, operator, support, and customer views
- Signed API access for sensitive automation endpoints
- Audit logging for every create, update, delete, deploy, backup, and recreate action
- Upload scanning before file publication
- Script execution allowlist and template validation
