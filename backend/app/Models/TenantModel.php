<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\TenantManager;

abstract class TenantModel extends Model
{
    public function getConnectionName()
    {
        $tenant = app(TenantManager::class);
        if ($tenant->isResolved()) {
            return 'tenant';
        }

        if (config('tenancy.strict', true)) {
            throw new \RuntimeException('Tenant database not resolved for tenant model usage.');
        }

        return parent::getConnectionName();
    }
}
