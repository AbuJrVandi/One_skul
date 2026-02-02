<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\District;
use App\Models\School;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        $districtsCount = District::count();
        $schoolsCount = School::count();
        $pendingSchoolsCount = School::where('is_approved', false)->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'districts' => $districtsCount,
                'schools' => $schoolsCount,
                'pending' => $pendingSchoolsCount,
            ],
            'recentSchools' => School::with('district')->latest()->take(5)->get()
        ]);
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
