<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\DB;

class TenantAuditService
{
    public function buildAuditTables(School $school): array
    {
        $central = DB::connection();
        $tenant = DB::connection('tenant');

        $classIds = $central->table('school_classes')->where('school_id', $school->id)->pluck('id')->all();
        $studentIds = $central->table('students')->where('school_id', $school->id)->pluck('id')->all();
        $reportCardIds = $studentIds
            ? $central->table('report_cards')->whereIn('student_id', $studentIds)->pluck('id')->all()
            : [];

        $tables = [
            'districts' => $central->table('districts')->where('id', $school->district_id)->get(),
            'schools' => $central->table('schools')->where('id', $school->id)->get(),
            'users' => $central->table('users')->where('school_id', $school->id)->get(),
            'academic_years' => $central->table('academic_years')->get(),
            'terms' => $central->table('terms')->get(),
            'subjects' => $central->table('subjects')->get(),
            'school_settings' => $central->table('school_settings')->where('school_id', $school->id)->get(),
            'school_classes' => $central->table('school_classes')->where('school_id', $school->id)->get(),
            'students' => $central->table('students')->where('school_id', $school->id)->get(),
            'school_subject' => $central->table('school_subject')->where('school_id', $school->id)->get(),
            'class_teacher' => $classIds ? $central->table('class_teacher')->whereIn('school_class_id', $classIds)->get() : collect(),
            'class_subject' => $classIds ? $central->table('class_subject')->whereIn('school_class_id', $classIds)->get() : collect(),
            'student_applications' => $central->table('student_applications')->where('school_id', $school->id)->get(),
            'applications' => $central->table('applications')->where('school_id', $school->id)->get(),
            'attendances' => $central->table('attendances')->where('school_id', $school->id)->get(),
            'grades' => $central->table('grades')->where('school_id', $school->id)->get(),
            'report_cards' => $studentIds ? $central->table('report_cards')->whereIn('student_id', $studentIds)->get() : collect(),
            'report_cards_generated' => $studentIds ? $central->table('report_cards_generated')->whereIn('student_id', $studentIds)->get() : collect(),
            'marks' => $reportCardIds ? $central->table('marks')->whereIn('report_card_id', $reportCardIds)->get() : collect(),
            'notices' => $central->table('notices')->where('school_id', $school->id)->get(),
            'school_report_settings' => $central->table('school_report_settings')->where('school_id', $school->id)->get(),
            'school_report_assets' => $central->table('school_report_assets')->where('school_id', $school->id)->get(),
            'school_profile_photos' => $central->table('school_profile_photos')->where('school_id', $school->id)->get(),
        ];

        $summary = [];
        $tableMeta = [];

        foreach ($tables as $table => $rows) {
            $centralCount = $rows->count();
            $tenantCount = $tenant->table($table)->count();
            $diff = $centralCount - $tenantCount;
            $status = $diff === 0 ? 'OK' : ($diff > 0 ? 'MISSING' : 'EXTRA');

            $summary[] = [
                'school_id' => $school->id,
                'school_slug' => $school->slug,
                'school_name' => $school->name,
                'table' => $table,
                'central_count' => $centralCount,
                'tenant_count' => $tenantCount,
                'diff' => $diff,
                'status' => $status,
            ];

            $tableMeta[$table] = [
                'rows' => $rows,
                'central_count' => $centralCount,
                'tenant_count' => $tenantCount,
                'diff' => $diff,
                'status' => $status,
            ];
        }

        return [
            'summary' => $summary,
            'tables' => $tableMeta,
        ];
    }
}
