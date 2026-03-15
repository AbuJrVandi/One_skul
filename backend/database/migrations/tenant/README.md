# Tenant Migrations

This folder contains the migration subset applied to each school (tenant) database.

How it works:
- `php artisan school:provision {id|slug}` runs all migrations in this folder
  against the tenant connection.
- Cache and jobs tables are excluded to keep tenant DBs focused on school data.

If you add new application tables, copy the migration into this folder to keep
new tenant databases consistent.
