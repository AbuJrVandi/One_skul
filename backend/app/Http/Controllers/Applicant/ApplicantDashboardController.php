<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Modules\Applications\Models\Application as StudentApplication;
use App\Modules\Applications\Models\StudentDecisionDocument;
use App\Services\DecisionDocumentService;
use App\Services\TenantManager;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ApplicantDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $schools = School::where('is_approved', true)
            ->get(['id', 'name', 'slug', 'district_id', 'tenant_db_path']);

        $applications = [];
        $counts = [
            'total' => 0,
            'pending' => 0,
            'accepted' => 0,
            'rejected' => 0,
        ];

        foreach ($schools as $school) {
            if (!$school->tenant_db_path) {
                continue;
            }

            $dbPath = str_starts_with($school->tenant_db_path, '/')
                ? $school->tenant_db_path
                : database_path($school->tenant_db_path);

            if (!File::exists($dbPath)) {
                continue;
            }

            app(TenantManager::class)->resolveForSchool($school);

            $schoolApps = StudentApplication::where('applicant_user_id', $user->id)
                ->orderBy('submitted_at', 'desc')
                ->get();

            $decisionDocsByApp = [];
            if ($schoolApps->isNotEmpty() && Schema::connection('tenant')->hasTable('student_decision_documents')) {
                $decisionDocsByApp = StudentDecisionDocument::whereIn('application_id', $schoolApps->pluck('id'))
                    ->orderByDesc('generated_at')
                    ->get()
                    ->groupBy('application_id')
                    ->map(function ($group) {
                        return $group->first();
                    });

                foreach ($schoolApps as $appModel) {
                    if (!in_array($appModel->status, ['approved', 'rejected'], true)) {
                        continue;
                    }
                    if ($decisionDocsByApp->has($appModel->id)) {
                        continue;
                    }

                    $decision = $appModel->status === 'approved' ? 'accepted' : 'rejected';
                    $doc = app(DecisionDocumentService::class)->generateForApplication($appModel, $decision);
                    $decisionDocsByApp[$appModel->id] = $doc;
                }
            }

            $schoolApps = $schoolApps
                ->map(function ($app) use ($school, $decisionDocsByApp) {
                    $doc = $decisionDocsByApp[$app->id] ?? null;
                    return [
                        'id' => $app->id,
                        'reference' => $app->application_reference,
                        'class_level' => $app->class_level,
                        'class_category' => $app->class_category,
                        'status' => $app->status,
                        'submitted_at_sort' => $app->submitted_at?->timestamp ?? 0,
                        'submitted_at' => $app->submitted_at?->format('M d, Y'),
                        'decision_document' => $doc ? [
                            'id' => $doc->id,
                            'decision' => $doc->decision,
                            'generated_at' => $doc->generated_at?->format('M d, Y'),
                        ] : null,
                        'school' => [
                            'name' => $school->name,
                            'slug' => $school->slug,
                        ],
                    ];
                })
                ->values()
                ->all();

            foreach ($schoolApps as $app) {
                $counts['total']++;
                if ($app['status'] === 'submitted') {
                    $counts['pending']++;
                } elseif ($app['status'] === 'approved') {
                    $counts['accepted']++;
                } elseif ($app['status'] === 'rejected') {
                    $counts['rejected']++;
                }
            }

            $applications = array_merge($applications, $schoolApps);
        }

        usort($applications, function ($a, $b) {
            return $b['submitted_at_sort'] <=> $a['submitted_at_sort'];
        });

        return Inertia::render('Applicant/Dashboard', [
            'stats' => $counts,
            'applications' => array_map(function ($app) {
                unset($app['submitted_at_sort']);
                return $app;
            }, $applications),
        ]);
    }
}
