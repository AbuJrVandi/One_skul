<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Services\TenantManager;
use App\Services\TenantAuditService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AuditTenantData extends Command
{
    protected $signature = 'school:audit-tenant {school : School ID or slug} {--fix-missing : Insert missing rows into tenant (no deletes)} {--dry-run : Do not write any data} {--format=table : table|json|csv} {--output= : Write results to file}';

    protected $description = 'Compare central vs tenant data counts for a school and optionally insert missing rows into tenant.';

    public function handle(): int
    {
        $identifier = $this->argument('school');
        $fixMissing = $this->option('fix-missing');
        $dryRun = $this->option('dry-run');
        $format = strtolower((string) $this->option('format'));
        $output = $this->option('output');

        $school = School::query()
            ->where('id', $identifier)
            ->orWhere('slug', $identifier)
            ->with('district')
            ->first();

        if (!$school) {
            $this->error('School not found. Provide a valid ID or slug.');
            return self::FAILURE;
        }

        if (!$school->tenant_db_path) {
            $this->error('Tenant database not configured. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
            return self::FAILURE;
        }

        app(TenantManager::class)->resolveForSchool($school);

        $audit = app(TenantAuditService::class)->buildAuditTables($school);
        $summary = $audit['summary'];
        $tables = $audit['tables'];
        $tenant = DB::connection('tenant');

        if ($format === 'table') {
            $this->info('Audit for: ' . $school->name . ' (' . ($school->slug ?? $school->id) . ')');
            foreach ($summary as $row) {
                $this->line(sprintf('%-24s central=%-6d tenant=%-6d diff=%+d [%s]', $row['table'], $row['central_count'], $row['tenant_count'], $row['diff'], $row['status']));
            }
        }

        if ($fixMissing) {
            foreach ($tables as $table => $meta) {
                if ($meta['diff'] > 0) {
                    if ($dryRun) {
                        continue;
                    }
                    $this->insertMissing($tenant, $table, $meta['rows']);
                }
            }
        }

        if ($format !== 'table' || $output) {
            $this->writeOutput($summary, $format, $output);
        }

        $this->info('Audit complete.');
        return self::SUCCESS;
    }

    private function insertMissing($tenant, string $table, $rows): void
    {
        foreach ($rows as $row) {
            $data = (array) $row;
            if (isset($data['id'])) {
                $tenant->table($table)->updateOrInsert(['id' => $data['id']], $data);
            } else {
                $tenant->table($table)->insert($data);
            }
        }
    }

    private function writeOutput(array $summary, string $format, ?string $output): void
    {
        $format = $format ?: 'json';

        if ($format === 'csv') {
            $lines = [];
            $lines[] = 'school_id,school_slug,school_name,table,central_count,tenant_count,diff,status';
            foreach ($summary as $row) {
                $lines[] = implode(',', [
                    $this->escapeCsv($row['school_id']),
                    $this->escapeCsv($row['school_slug']),
                    $this->escapeCsv($row['school_name']),
                    $this->escapeCsv($row['table']),
                    $row['central_count'],
                    $row['tenant_count'],
                    $row['diff'],
                    $row['status'],
                ]);
            }
            $content = implode("\n", $lines) . "\n";
        } else {
            $content = json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
        }

        if ($output) {
            File::put($output, $content);
            $this->info('Wrote audit output to ' . $output);
            return;
        }

        $this->line($content);
    }

    private function escapeCsv($value): string
    {
        $string = (string) ($value ?? '');
        if (str_contains($string, ',') || str_contains($string, '"') || str_contains($string, "\n")) {
            $string = '"' . str_replace('"', '""', $string) . '"';
        }
        return $string;
    }
}
