# Backend Services

## `apps/api`

Primary API gateway and application host for:

- REST API
- auth middleware
- request validation
- orchestration across infrastructure services
- audit logging
- background job triggering

## `services/auth-service`

Responsibilities:

- user authentication
- JWT or session management
- role and permission checks
- API key handling for automation endpoints

## `services/bind9-service`

Responsibilities:

- zone file generation
- record updates for customer domains
- BIND9 reload execution
- DNS validation hooks

## `services/app-packet-service`

Responsibilities:

- app package catalog
- package version management
- install templates
- environment schema validation

## `services/docker-command-service`

Responsibilities:

- generate Docker Stack / compose manifests
- run deploy, recreate, stop, and backup commands
- stream deployment logs
- persist job status

## `services/file-manager-service`

Responsibilities:

- customer file browsing and upload workflow
- mapping file paths per customer or deployment
- secure download permissions

## `services/scan-upload-service`

Responsibilities:

- scan uploaded files before activation
- block suspicious files
- store scan result history

## `services/ssl-service`

Responsibilities:

- issue Let's Encrypt certificates
- renew certificates
- verify challenge configuration
- store certificate metadata

## `services/nginx-config-service`

Responsibilities:

- build vhost files per domain or app
- validate config syntax
- reload nginx safely
- manage upstream mappings
