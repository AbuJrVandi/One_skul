# New School Setup Guide (One-Skul)

This guide shows the complete, reliable steps to add a new school so it works like existing schools (UI + tenant database + frontend config).

## Option A — Add From Admin UI (Recommended)
1. Login as **Super Admin**.
2. Go to **Admin → Schools**.
3. Click **Add School**.
4. Fill in:
   - District
   - School Name
   - Year Founded
   - School Type
   - Principal Name
5. Click **Save**.
6. Click **Approve**.

When you approve, the system automatically provisions the tenant database and runs all tenant migrations.

## Option B — Add From Backend (CLI)
Use this when you want to create a school without the UI.

### 1) Create the school record (central DB)
Run inside `backend/`:

```bash
php artisan tinker --execute='
use App\Models\District;
use App\Models\School;

$district = District::firstOrCreate(["name" => "Kenema"]);
School::create([
    "district_id" => $district->id,
    "name" => "The Door International Academy",
    "slug" => School::generateUniqueSlug("The Door International Academy"),
    "tenant_db_driver" => "sqlite",
    "tenant_db_path" => "tenants/the-door-international-academy.sqlite",
    "year_founded" => 2010,
    "school_type" => "private",
    "principal_name" => "Principal Office",
    "is_approved" => true,
]);
'
```

### 2) Provision the tenant DB
```bash
php artisan school:provision the-door-international-academy
```

## Frontend config (required)
Each school must have a config file:

```
frontend/resources/js/Pages/Schools/<school-slug>/config.json
```

Example:
```json
{
  "slug": "the-door-international-academy",
  "brandName": "The Door International Academy",
  "tagline": "Faith, Excellence, Discipline",
  "portal": {
    "portalLabel": "Enter The Door Portal",
    "applyLabel": "Apply to The Door"
  }
}
```

If the folder/config is missing, run:

```bash
php artisan school:sync-configs
```

## Troubleshooting
### Approval fails with 500
Run provisioning manually:
```bash
php artisan school:provision <school-slug>
```

### School not found
The school record does not exist in the central DB. Create it first (Option A or Option B).

### Missing frontend config
Run:
```bash
php artisan school:sync-configs
```

