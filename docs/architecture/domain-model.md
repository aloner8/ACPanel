# ACPanel Domain Model

## Main Entities

### Customer

- `id`
- `code`
- `name`
- `email`
- `phone`
- `company_name`
- `tax_id`
- `address_line_1`
- `address_line_2`
- `district`
- `province`
- `postal_code`
- `country`
- `status`
- `created_at`
- `updated_at`

### Domain

- `id`
- `customer_id`
- `root_domain`
- `subdomain`
- `fqdn`
- `dns_provider`
- `bind_zone_name`
- `nginx_server_name`
- `ssl_status`
- `deployment_status`
- `is_primary`
- `created_at`
- `updated_at`

### DomainConfig

- `id`
- `domain_id`
- `config_key`
- `config_value`
- `config_type`
- `is_secret`
- `created_at`
- `updated_at`

### AppPackage

- `id`
- `name`
- `slug`
- `category`
- `description`
- `version`
- `docker_image`
- `default_port`
- `install_mode`
- `template_path`
- `env_schema`
- `is_active`
- `created_at`
- `updated_at`

### DeploymentScript

- `id`
- `customer_id`
- `domain_id`
- `app_package_id`
- `script_type`
- `script_name`
- `script_path`
- `runtime`
- `version`
- `content_hash`
- `is_template`
- `created_at`
- `updated_at`

### DeploymentJob

- `id`
- `customer_id`
- `domain_id`
- `script_id`
- `job_type`
- `status`
- `requested_by`
- `started_at`
- `finished_at`
- `result_summary`
- `raw_log_path`

### ActivityLog

- `id`
- `actor_id`
- `customer_id`
- `domain_id`
- `action`
- `resource_type`
- `resource_id`
- `ip_address`
- `metadata`
- `created_at`

### BackupRecord

- `id`
- `customer_id`
- `domain_id`
- `backup_type`
- `storage_path`
- `size_bytes`
- `checksum`
- `status`
- `started_at`
- `finished_at`

## Key Relationships

- A customer can own many domains.
- A domain can have many config entries.
- A customer can deploy many app packages across many domains.
- A deployment script can be reused as a template or linked to a concrete deployment job.
- Every operational action should produce an activity log.
- Backup records should be tied to a customer and optionally to a specific domain.
