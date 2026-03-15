# Tenant Databases

This folder stores per-school tenant databases (manual provisioning).

## Provision a School Database

From `backend/`:

```
php artisan school:provision {school_id_or_slug}
```

## Provision All Schools

```
php artisan school:provision-all
```

## Sync Frontend School Configs

```
php artisan school:sync-configs
```

## Migrate Existing Data Into Tenants

```
php artisan school:migrate-data {school_id_or_slug}
php artisan school:migrate-data-all
```

Optional flags:
- `--truncate` clears tenant tables before copying
- `--dry-run` shows counts without writing

## Audit Tenants vs Central Data

```
php artisan school:audit-tenant {school_id_or_slug}
php artisan school:audit-tenant-all
```

Optional flags:
- `--fix-missing` inserts missing rows into tenant (no deletes)
- `--dry-run` shows counts without writing
- `--format=table|json|csv`
- `--output=path`

The database path is stored on the `schools` table (`tenant_db_path`).
