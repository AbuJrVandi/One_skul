<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\District;
use App\Models\School;
use App\Models\User;
use App\Models\Application as LegacyApplication;
use App\Modules\Applications\Models\Application as StudentApplication;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        $now = Carbon::now();

        $districtsCount = District::count();
        $schoolsCount = School::count();
        $pendingSchoolsCount = School::where('is_approved', false)->count();
        $approvedSchoolsCount = $schoolsCount - $pendingSchoolsCount;

        $legacyApplicationsCount = LegacyApplication::count();
        $studentApplicationsCount = StudentApplication::count();
        $totalApplicationsCount = $legacyApplicationsCount + $studentApplicationsCount;

        $legacyStatusCounts = LegacyApplication::select(['status'])->get()->groupBy('status')->map->count();
        $studentStatusCounts = StudentApplication::select(['status'])->get()->groupBy('status')->map->count();

        $draftApplications = (int) ($studentStatusCounts['draft'] ?? 0);
        $pendingApplications = (int) ($legacyStatusCounts['pending'] ?? 0) + (int) ($studentStatusCounts['submitted'] ?? 0);
        $approvedApplications = (int) ($legacyStatusCounts['approved'] ?? 0) + (int) ($studentStatusCounts['approved'] ?? 0);
        $rejectedApplications = (int) ($legacyStatusCounts['rejected'] ?? 0) + (int) ($studentStatusCounts['rejected'] ?? 0);

        $schoolTypes = [
            ['name' => 'Government', 'value' => School::where('school_type', 'government')->count()],
            ['name' => 'Private', 'value' => School::where('school_type', 'private')->count()],
        ];

        $months = collect(range(11, 0))->map(function ($i) use ($now) {
            return $now->copy()->subMonths($i)->startOfMonth();
        });
        $schoolsSince = $months->first()->copy();
        $schoolsForTrend = School::where('created_at', '>=', $schoolsSince)
            ->get(['id', 'created_at', 'is_approved']);
        $schoolsGrouped = $schoolsForTrend->groupBy(function ($school) {
            return $school->created_at->format('Y-m');
        });
        $schoolsTrend = $months->map(function ($month) use ($schoolsGrouped) {
            $key = $month->format('Y-m');
            $group = $schoolsGrouped->get($key, collect());
            $approved = $group->where('is_approved', true)->count();
            $pending = $group->where('is_approved', false)->count();
            return [
                'month' => $month->format('M Y'),
                'total' => $group->count(),
                'approved' => $approved,
                'pending' => $pending,
            ];
        })->values();

        $days = collect(range(13, 0))->map(function ($i) use ($now) {
            return $now->copy()->subDays($i)->startOfDay();
        });
        $appsSince = $days->first()->copy();

        $legacyApps = LegacyApplication::where('created_at', '>=', $appsSince)
            ->get(['id', 'created_at']);
        $studentApps = StudentApplication::where(function ($query) use ($appsSince) {
                $query->where('submitted_at', '>=', $appsSince)
                    ->orWhere('created_at', '>=', $appsSince);
            })
            ->get(['id', 'created_at', 'submitted_at']);

        $legacyByDay = $legacyApps->groupBy(function ($app) {
            return $app->created_at->format('Y-m-d');
        })->map->count();
        $studentByDay = $studentApps->groupBy(function ($app) {
            $date = $app->submitted_at ?? $app->created_at;
            return $date->format('Y-m-d');
        })->map->count();

        $applicationsTrend = $days->map(function ($day) use ($legacyByDay, $studentByDay) {
            $key = $day->format('Y-m-d');
            $total = (int) ($legacyByDay[$key] ?? 0) + (int) ($studentByDay[$key] ?? 0);
            return [
                'date' => $day->format('M d'),
                'total' => $total,
            ];
        })->values();

        $schoolsLast7Days = School::where('created_at', '>=', $now->copy()->subDays(7))->count();
        $applicationsLast7Days = LegacyApplication::where('created_at', '>=', $now->copy()->subDays(7))->count()
            + StudentApplication::where(function ($query) use ($now) {
                $query->where('submitted_at', '>=', $now->copy()->subDays(7))
                    ->orWhere('created_at', '>=', $now->copy()->subDays(7));
            })->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'districts' => $districtsCount,
                'schools' => $schoolsCount,
                'pending' => $pendingSchoolsCount,
            ],
            'analytics' => [
                'kpis' => [
                'districts' => $districtsCount,
                'schools' => $schoolsCount,
                'approved_schools' => $approvedSchoolsCount,
                'pending_schools' => $pendingSchoolsCount,
                'applications' => $totalApplicationsCount,
            ],
            'school_types' => $schoolTypes,
            'applications_status' => [
                ['name' => 'Draft', 'value' => $draftApplications],
                ['name' => 'Pending', 'value' => $pendingApplications],
                ['name' => 'Approved', 'value' => $approvedApplications],
                ['name' => 'Rejected', 'value' => $rejectedApplications],
                ],
                'schools_trend' => $schoolsTrend,
            'applications_trend' => $applicationsTrend,
            'activity' => [
                'schools_7d' => $schoolsLast7Days,
                'applications_7d' => $applicationsLast7Days,
            ],
            'last_updated' => $now->toDateTimeString(),
        ],
        'recentSchools' => School::with('district')->latest()->take(5)->get()
    ]);
    }

    public function createPrincipal(Request $request, School $school)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $existing = User::where('school_id', $school->id)->where('role', 'admin')->first();
        if ($existing) {
            return redirect()->back()->withErrors([
                'email' => 'A principal account already exists for this school.'
            ]);
        }

        User::create([
            'school_id' => $school->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Hash::make($request->password),
            'role' => 'admin',
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Principal account created successfully.');
    }

    public function portal()
    {
        return Inertia::render('Admin/Portal/Index', [
            'schools' => School::with('district')->withCount('students')->get()
        ]);
    }

    public function schoolPortal(School $school)
    {
        $principal = \App\Models\User::where('school_id', $school->id)
            ->where('role', 'admin')
            ->first();

        return Inertia::render('Admin/Portal/Show', [
            'school' => $school->load(['district', 'reportSettings', 'reportAssets']),
            'principal' => $principal,
            'stats' => [
                'students' => $school->students()->count(),
                'subjects' => $school->subjects()->count(),
            ]
        ]);
    }

    public function resetPrincipalPassword(Request $request, School $school)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $principal = \App\Models\User::where('school_id', $school->id)
            ->where('role', 'admin')
            ->firstOrFail();

        $principal->update([
            'password' => \Hash::make($request->password)
        ]);

        \Illuminate\Support\Facades\Log::info("Super Admin reset password for Principal of school: {$school->name}", [
            'admin_id' => auth()->id(),
            'principal_id' => $principal->id
        ]);

        return redirect()->back()->with('success', 'Principal password reset successfully.');
    }

    public function togglePrincipalStatus(School $school)
    {
        $principal = \App\Models\User::where('school_id', $school->id)
            ->where('role', 'admin')
            ->firstOrFail();

        $principal->update([
            'is_active' => !$principal->is_active
        ]);

        \Illuminate\Support\Facades\Log::warning("Super Admin toggled Principal status for school: {$school->name}", [
            'admin_id' => auth()->id(),
            'principal_id' => $principal->id,
            'is_active' => $principal->is_active
        ]);

        return redirect()->back()->with('success', 'Principal account status updated.');
    }

    public function updateReportSettings(Request $request, School $school)
    {
        $validated = $request->validate([
            'custom_school_name' => 'nullable|string|max:255',
            'school_motto' => 'nullable|string|max:255',
            'principal_name' => 'nullable|string|max:255',
            'primary_color' => 'required|string|max:7',
            'secondary_color' => 'required|string|max:7',
            'font_style' => 'required|string',
            'show_photo' => 'boolean',
            'layout_config' => 'nullable|array',
        ]);

        $settings = $school->reportSettings()->updateOrCreate(
            ['school_id' => $school->id],
            $validated
        );

        \Illuminate\Support\Facades\Log::info("Super Admin updated report settings for school: {$school->name}", [
            'admin_id' => auth()->id(),
            'settings' => $validated
        ]);

        return redirect()->back()->with('success', 'Report card settings updated.');
    }

    public function uploadReportAsset(Request $request, School $school)
    {
        $request->validate([
            'asset_type' => 'required|string|in:logo,signature',
            'file' => 'required|image|max:2048',
        ]);

        $path = $request->file('file')->store('schools/assets', 'public');

        $school->reportAssets()->updateOrCreate(
            ['asset_type' => $request->asset_type],
            [
                'file_path' => $path,
                'mime_type' => $request->file('file')->getMimeType(),
            ]
        );

        return redirect()->back()->with('success', strtoupper($request->asset_type) . ' uploaded successfully.');
    }

    public function districts()
    {
        return Inertia::render('Admin/Districts/Index', [
            'districts' => District::withCount('schools')->get()
        ]);
    }

    public function storeDistrict(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:districts',
        ]);

        District::create($validated);

        return redirect()->back()->with('success', 'District added successfully.');
    }

    public function updateDistrict(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('districts')->ignore($district->id)],
        ]);

        $district->update($validated);

        return redirect()->back()->with('success', 'District updated successfully.');
    }

    public function deleteDistrict(District $district)
    {
        // Check if district has schools before deleting (or let cascade handle it if that's the design)
        $district->delete();

        return redirect()->back()->with('success', 'District deleted successfully.');
    }

    public function schools()
    {
        return Inertia::render('Admin/Schools/Index', [
            'schools' => School::with('district')->latest()->get(),
            'districts' => District::all()
        ]);
    }

    public function storeSchool(Request $request)
    {
        $validated = $request->validate([
            'district_id' => 'required|exists:districts,id',
            'name' => 'required|string|max:255',
            'year_founded' => 'required|integer|min:1800|max:' . date('Y'),
            'school_type' => ['required', Rule::in(['government', 'private'])],
            'principal_name' => 'required|string|max:255',
        ]);

        School::create($validated);

        return redirect()->back()->with('success', 'School added successfully.');
    }

    public function updateSchool(Request $request, School $school)
    {
        $validated = $request->validate([
            'district_id' => 'required|exists:districts,id',
            'name' => 'required|string|max:255',
            'year_founded' => 'required|integer|min:1800|max:' . date('Y'),
            'school_type' => ['required', Rule::in(['government', 'private'])],
            'principal_name' => 'required|string|max:255',
            'is_approved' => 'boolean',
        ]);

        $school->update($validated);

        return redirect()->back()->with('success', 'School updated successfully.');
    }

    public function deleteSchool(School $school)
    {
        $school->delete();

        return redirect()->back()->with('success', 'School deleted successfully.');
    }

    public function toggleApproval(School $school)
    {
        $school->update([
            'is_approved' => !$school->is_approved
        ]);

        return redirect()->back()->with('success', 'School approval status updated.');
    }
}
