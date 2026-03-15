<?php

namespace App\Console\Commands;

use App\Models\School;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Services\TenantAuditService;
use App\Services\TenantManager;

class AuditAllTenantData extends Command
{
    protected $signature = 'school:audit-tenant-all {--fix-missing : Insert missing rows into tenant (no deletes)} {--dry-run : Do not write any data} {--format=table : table|json|csv} {--output= : Write results to file}';

    protected $description = 'Audit all tenant databases against central data.';

    public function handle(): int
    {
        $schools = School::orderBy('id')->get();
        $fixMissing = $this->option('fix-missing');
        $dryRun = $this->option('dry-run');
        $format = strtolower((string) $this->option('format'));
        $output = $this->option('output');

        if ($schools->isEmpty()) {
            $this->info('No schools found.');
            return self::SUCCESS;
        }

        $allSummary = [];

        foreach ($schools as $school) {
            $this->line('-> ' . $school->name . ' (' . ($school->slug ?? $school->id) . ')');

            if (!$school->tenant_db_path) {
                $this->error('Tenant database not configured for ' . $school->name);
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);
            $audit = app(TenantAuditService::class)->buildAuditTables($school);
            $summary = $audit['summary'];
            $tables = $audit['tables'];

            if ($format === 'table') {
                foreach ($summary as $row) {
                    $this->line(sprintf('%-24s central=%-6d tenant=%-6d diff=%+d [%s]', $row['table'], $row['central_count'], $row['tenant_count'], $row['diff'], $row['status']));
                }
            }

            if ($fixMissing) {
                $tenant = DB::connection('tenant');
                foreach ($tables as $table => $meta) {
                    if ($meta['diff'] > 0) {
                        if ($dryRun) {
                            continue;
                        }
                        foreach ($meta['rows'] as $row) {
                            $data = (array) $row;
                            if (isset($data['id'])) {
                                $tenant->table($table)->updateOrInsert(['id' => $data['id']], $data);
                            } else {
                                $tenant->table($table)->insert($data);
                            }
                        }
                    }
                }
            }

            $allSummary = array_merge($allSummary, $summary);
        }

        if ($format !== 'table' || $output) {
            $this->writeOutput($allSummary, $format, $output);
        }

        $this->info('Audit complete for all schools.');
        return self::SUCCESS;
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
