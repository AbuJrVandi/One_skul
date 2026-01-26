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
        return Inertia::render('Admin/Portal/Show', [
            'school' => $school->load('district'),
            'stats' => [
                'students' => $school->students()->count(),
                'subjects' => $school->subjects()->count(),
            ]
        ]);
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
