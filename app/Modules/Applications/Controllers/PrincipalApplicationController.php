<?php

namespace App\Modules\Applications\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Modules\Applications\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PrincipalApplicationController extends Controller
{
    private function getTeacher() {
        return auth()->user();
    }

    public function index()
    {
        $teacher = $this->getTeacher();
        
        $applications = Application::where('school_id', $teacher->school_id)
            ->where('status', '!=', 'draft') // Only submitted applications
            ->orderBy('submitted_at', 'desc')
            ->get();

        return Inertia::render('Principal/Applications/Index', [
            'applications' => $applications
        ]);
    }

    public function show(Application $application)
    {
        $teacher = $this->getTeacher();

        if ($application->school_id !== $teacher->school_id) {
            abort(403);
        }

        // Potential classes to assign
        $classes = SchoolClass::where('school_id', $teacher->school_id)->get();

        return Inertia::render('Principal/Applications/Show', [
            'application' => $application,
            'classes' => $classes
        ]);
    }

    /**
     * Approve and Auto-create Student Account
     */
    public function approve(Request $request, Application $application)
    {
        $teacher = $this->getTeacher();

        if ($application->school_id !== $teacher->school_id) {
            abort(403);
        }

        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        DB::transaction(function () use ($application, $validated, $teacher) {
            // 1. Generate Credentials
            $username = Str::lower($application->first_name . '.' . $application->last_name . rand(100, 999));
            $password = Str::random(8);

            // 2. Create User
            // Check email uniqueness, use generated email if applicant email exists/duplicate
            $email = $username . '@oneskul.edu'; 
            if ($application->email && !User::where('email', $application->email)->exists()) {
                $email = $application->email;
            }

            $user = User::create([
                'school_id' => $teacher->school_id,
                'name' => $application->first_name . ' ' . $application->last_name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'student',
            ]);

            // 3. Create Student
            $data = $application->application_data;
            
            Student::create([
                'school_id' => $teacher->school_id,
                'user_id' => $user->id,
                'school_class_id' => $validated['school_class_id'],
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'index_number' => 'STU-' . date('Y') . '-' . mt_rand(1000, 9999),
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? 'other',
                'address' => $data['address'] ?? null,
                'emergency_contact' => $data['guardian_phone'] ?? null,
                'grade_level' => $application->class_category,
            ]);

            // 4. Update Application
            $application->update([
                'status' => 'approved',
                'reviewed_by' => $teacher->id,
                'reviewed_at' => now(),
            ]);

            // Flash credentials
            session()->flash('generated_credentials', [
                'username' => $email,
                'password' => $password
            ]);
        });

        return redirect()->back()->with('success', 'Application approved and student account created.');
    }

    public function reject(Request $request, Application $application)
    {
        $teacher = $this->getTeacher();

        if ($application->school_id !== $teacher->school_id) {
            abort(403);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by' => $teacher->id,
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Application rejected.');
    }
}
