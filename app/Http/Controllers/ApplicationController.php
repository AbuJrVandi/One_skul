<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\District;
use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ApplicationService;

class ApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    // Step 2: School Discovery Page
    public function discovery(Request $request)
    {
        $query = School::query()->with('district');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('district')) {
            $query->where('district_id', $request->district);
        }

        return Inertia::render('Public/Apply/SchoolDiscovery', [
            'schools' => $query->get(),
            'districts' => District::all(),
            'filters' => $request->only(['search', 'district'])
        ]);
    }

    // Step 3.1: Application Form
    public function showForm(School $school)
    {
        $school->load('district');
        return Inertia::render('Public/Apply/ApplicationForm', [
            'school' => $school
        ]);
    }

    // Step 3.3: Submit Application
    public function submit(Request $request, School $school)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'address' => 'required|string',
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'previous_school' => 'nullable|string|max:255',
            'grade_applying_for' => 'required|string|max:50',
            'terms' => 'accepted',
        ]);

        $validated['school_id'] = $school->id;

        $application = $this->applicationService->createApplication($validated);

        return redirect()->route('apply.success', ['application' => $application->id]);
    }

    // Step 4: Final Confirmation
    public function success(Application $application)
    {
        $application->load('school');
        return Inertia::render('Public/Apply/ApplicationSuccess', [
            'application' => $application
        ]);
    }
}
