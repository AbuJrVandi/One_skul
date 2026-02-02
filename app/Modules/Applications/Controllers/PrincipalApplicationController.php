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
    private function getPrincipal() {
        return auth()->user();
    }

    /**
     * Display list of all submitted applications for the school
     */
    public function index()
    {
        $principal = $this->getPrincipal();
        
        $applications = Application::where('school_id', $principal->school_id)
            ->where('status', '!=', 'draft') // Only submitted applications
            ->orderBy('submitted_at', 'desc')
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'application_reference' => $app->application_reference,
                    'application_pin' => $app->application_pin,
                    'first_name' => $app->first_name,
                    'last_name' => $app->last_name,
                    'email' => $app->email,
                    'phone' => $app->phone,
                    'class_category' => $app->class_category,
                    'class_category_label' => $app->class_category_label,
                    'class_level' => $app->class_level,
                    'status' => $app->status,
                    'status_color' => $app->status_color,
                    'submitted_at' => $app->submitted_at?->format('M d, Y H:i'),
                    'reviewed_at' => $app->reviewed_at?->format('M d, Y H:i'),
                    'created_at' => $app->created_at->format('M d, Y'),
                ];
            });

        // Get stats
        $stats = [
            'total' => Application::where('school_id', $principal->school_id)->submitted()->count(),
            'pending' => Application::where('school_id', $principal->school_id)->pending()->count(),
            'approved' => Application::where('school_id', $principal->school_id)->where('status', 'approved')->count(),
            'rejected' => Application::where('school_id', $principal->school_id)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Principal/Applications/Index', [
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }

    /**
     * Show single application details
     */
    public function show(Application $application)
    {
        $principal = $this->getPrincipal();

        if ($application->school_id !== $principal->school_id) {
            abort(403, 'You do not have access to this application.');
        }

        // Get available classes for assignment
        $classes = SchoolClass::where('school_id', $principal->school_id)
            ->orderBy('name')
            ->get(['id', 'name', 'grade_level']);

        // Get credentials if approved (for display to principal)
        $credentials = null;
        if ($application->status === 'approved' && $application->generated_email) {
            $credentials = [
                'email' => $application->generated_email,
                'password' => $application->generated_password, // Will be shown only once after approval
            ];
        }

        return Inertia::render('Principal/Applications/Show', [
            'application' => [
                'id' => $application->id,
                'application_reference' => $application->application_reference,
                'application_pin' => $application->application_pin,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'email' => $application->email,
                'phone' => $application->phone,
                'class_category' => $application->class_category,
                'class_category_label' => $application->class_category_label,
                'class_level' => $application->class_level,
                'application_data' => $application->application_data,
                'status' => $application->status,
                'status_color' => $application->status_color,
                'submitted_at' => $application->submitted_at?->format('M d, Y H:i'),
                'reviewed_at' => $application->reviewed_at?->format('M d, Y H:i'),
                'rejection_reason' => $application->rejection_reason,
                'student_id' => $application->student_id,
            ],
            'classes' => $classes,
            'credentials' => $credentials,
        ]);
    }

    /**
     * Approve application and auto-create student account
     */
    public function approve(Request $request, Application $application)
    {
        $principal = $this->getPrincipal();

        if ($application->school_id !== $principal->school_id) {
            abort(403, 'You do not have access to this application.');
        }

        if ($application->status !== 'submitted') {
            return redirect()->back()->with('error', 'Only submitted applications can be approved.');
        }

        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        // Verify the class belongs to this school
        $class = SchoolClass::where('id', $validated['school_class_id'])
            ->where('school_id', $principal->school_id)
            ->firstOrFail();

        $generatedEmail = null;
        $generatedPassword = null;

        DB::transaction(function () use ($application, $validated, $principal, $class, &$generatedEmail, &$generatedPassword) {
            // 1. Generate Credentials
            $baseUsername = Str::lower(Str::slug($application->first_name . '.' . $application->last_name, '.'));
            $username = $baseUsername . rand(100, 999);
            $generatedPassword = Str::random(8);

            // 2. Determine email
            $generatedEmail = $username . '@oneskul.edu'; 
            if ($application->email && !User::where('email', $application->email)->exists()) {
                $generatedEmail = $application->email;
            }

            // 3. Create User Account
            $user = User::create([
                'school_id' => $principal->school_id,
                'name' => $application->first_name . ' ' . $application->last_name,
                'email' => $generatedEmail,
                'password' => Hash::make($generatedPassword),
                'role' => 'student',
                'is_active' => true,
            ]);

            // 4. Create Student Record
            $data = $application->application_data;
            
            $student = Student::create([
                'school_id' => $principal->school_id,
                'user_id' => $user->id,
                'school_class_id' => $validated['school_class_id'],
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'index_number' => 'STU-' . date('Y') . '-' . strtoupper(Str::random(4)) . mt_rand(100, 999),
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? 'other',
                'address' => $data['address'] ?? null,
                'emergency_contact' => $data['guardian_phone'] ?? null,
                'grade_level' => $class->grade_level ?? $application->class_category,
            ]);

            // 5. Update Application with credentials and link to student
            $application->update([
                'status' => 'approved',
                'reviewed_by' => $principal->id,
                'reviewed_at' => now(),
                'generated_email' => $generatedEmail,
                'generated_password' => $generatedPassword, // Store temporarily for principal to share
                'student_id' => $student->id,
            ]);
        });

        return redirect()->back()->with([
            'success' => 'Application approved successfully! Student account created.',
            'generated_credentials' => [
                'email' => $generatedEmail,
                'password' => $generatedPassword,
            ],
        ]);
    }

    /**
     * Reject application with reason
     */
    public function reject(Request $request, Application $application)
    {
        $principal = $this->getPrincipal();

        if ($application->school_id !== $principal->school_id) {
            abort(403, 'You do not have access to this application.');
        }

        if ($application->status !== 'submitted') {
            return redirect()->back()->with('error', 'Only submitted applications can be rejected.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_by' => $principal->id,
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Application has been rejected.');
    }
}
