<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolClass;
use App\Models\User;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use App\Models\Application;
use App\Services\ApplicationService;
use App\Modules\Applications\Models\Application as StudentApplication;
use Carbon\Carbon;
use App\Services\TenantUserSyncService;

class PrincipalController extends Controller
{
    private function getSchool()
    {
        return auth()->user()->school;
    }

    public function dashboard()
    {
        $school = $this->getSchool();
        $now = Carbon::now();

        $studentsCount = Student::where('school_id', $school->id)->count();
        $teachersCount = User::where('school_id', $school->id)->where('role', 'teacher')->count();
        $classesCount = SchoolClass::where('school_id', $school->id)->count();

        $applicationsBase = StudentApplication::where('school_id', $school->id);
        $applicationsTotal = (clone $applicationsBase)->submitted()->count();
        $applicationsPending = (clone $applicationsBase)->pending()->count();
        $applicationsApproved = (clone $applicationsBase)->where('status', 'approved')->count();
        $applicationsRejected = (clone $applicationsBase)->where('status', 'rejected')->count();

        $applicationsStatus = [
            ['name' => 'Pending', 'value' => $applicationsPending],
            ['name' => 'Approved', 'value' => $applicationsApproved],
            ['name' => 'Rejected', 'value' => $applicationsRejected],
        ];

        $months = collect(range(11, 0))->map(function ($i) use ($now) {
            return $now->copy()->subMonths($i)->startOfMonth();
        });
        $studentsSince = $months->first()->copy();
        $studentsForTrend = Student::where('school_id', $school->id)
            ->where('created_at', '>=', $studentsSince)
            ->get(['id', 'created_at']);
        $studentsGrouped = $studentsForTrend->groupBy(function ($student) {
            return $student->created_at->format('Y-m');
        });
        $enrollmentTrend = $months->map(function ($month) use ($studentsGrouped) {
            $key = $month->format('Y-m');
            $group = $studentsGrouped->get($key, collect());
            return [
                'month' => $month->format('M Y'),
                'total' => $group->count(),
            ];
        })->values();

        $days = collect(range(13, 0))->map(function ($i) use ($now) {
            return $now->copy()->subDays($i)->startOfDay();
        });
        $appsSince = $days->first()->copy();
        $appsForTrend = StudentApplication::where('school_id', $school->id)
            ->where('status', '!=', 'draft')
            ->where(function ($query) use ($appsSince) {
                $query->where('submitted_at', '>=', $appsSince)
                    ->orWhere('created_at', '>=', $appsSince);
            })
            ->get(['id', 'submitted_at', 'created_at']);
        $appsGrouped = $appsForTrend->groupBy(function ($app) {
            $date = $app->submitted_at ?? $app->created_at;
            return $date->format('Y-m-d');
        })->map->count();
        $applicationsTrend = $days->map(function ($day) use ($appsGrouped) {
            $key = $day->format('Y-m-d');
            return [
                'date' => $day->format('M d'),
                'total' => (int) ($appsGrouped[$key] ?? 0),
            ];
        })->values();

        $classSizes = SchoolClass::where('school_id', $school->id)
            ->withCount('students')
            ->orderBy('name')
            ->get()
            ->map(function ($class) {
                return [
                    'name' => $class->name,
                    'students' => $class->students_count,
                    'level' => $class->level,
                ];
            })
            ->values();

        $studentsLast30Days = Student::where('school_id', $school->id)
            ->where('created_at', '>=', $now->copy()->subDays(30))
            ->count();
        $applicationsLast30Days = StudentApplication::where('school_id', $school->id)
            ->where('status', '!=', 'draft')
            ->where(function ($query) use ($now) {
                $query->where('submitted_at', '>=', $now->copy()->subDays(30))
                    ->orWhere('created_at', '>=', $now->copy()->subDays(30));
            })
            ->count();

        return Inertia::render('Principal/Dashboard', [
            'school' => $school,
            'stats' => [
                'students' => $studentsCount,
                'teachers' => $teachersCount,
                'classes' => $classesCount,
            ],
            'analytics' => [
                'kpis' => [
                    'students' => $studentsCount,
                    'teachers' => $teachersCount,
                    'classes' => $classesCount,
                    'applications' => $applicationsTotal,
                    'applications_pending' => $applicationsPending,
                    'applications_approved' => $applicationsApproved,
                    'applications_rejected' => $applicationsRejected,
                ],
                'enrollment_trend' => $enrollmentTrend,
                'applications_trend' => $applicationsTrend,
                'applications_status' => $applicationsStatus,
                'class_sizes' => $classSizes,
                'activity' => [
                    'students_30d' => $studentsLast30Days,
                    'applications_30d' => $applicationsLast30Days,
                ],
                'last_updated' => $now->toDateTimeString(),
            ],
            'notices' => \App\Models\Notice::where('school_id', $school->id)->latest()->take(5)->get()
        ]);
    }

    public function storeNotice(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_audience' => 'required|in:all,teachers,students',
        ]);

        \App\Models\Notice::create([
            'school_id' => auth()->user()->school_id,
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'target_audience' => $validated['target_audience'],
        ]);

        return redirect()->back()->with('success', 'Notice posted successfully.');
    }

    // --- Teacher Management ---
    public function teachers()
    {
        $school = $this->getSchool();
        $teachers = User::where('school_id', $school->id)
            ->where('role', 'teacher')
            ->with('classes')
            ->get();
            
        $classes = SchoolClass::where('school_id', $school->id)->get();

        return Inertia::render('Principal/Teachers', [
            'teachers' => $teachers,
            'classes' => $classes
        ]);
    }

    public function storeTeacher(Request $request)
    {
        $school = $this->getSchool();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $teacher = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
            'school_id' => $school->id,
        ]);

        app(TenantUserSyncService::class)->sync($teacher, $school);

        return redirect()->back()->with('success', 'Teacher added successfully.');
    }

    public function updateTeacher(Request $request, User $teacher)
    {
        $school = $this->getSchool();
        if ($teacher->school_id !== $school->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($teacher->id)],
            'password' => 'nullable|string|min:8',
        ]);

        $teacher->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($validated['password']) {
            $teacher->update(['password' => Hash::make($validated['password'])]);
        }

        app(TenantUserSyncService::class)->sync($teacher, $school);

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function deleteTeacher(User $teacher)
    {
        $school = $this->getSchool();
        if ($teacher->school_id !== $school->id) {
            abort(403);
        }

        $teacher->delete();
        app(TenantUserSyncService::class)->delete($teacher, $school);
        return redirect()->back()->with('success', 'Teacher removed successfully.');
    }

    // --- Class Management ---
    public function classes()
    {
        $school = $this->getSchool();
        $classes = SchoolClass::where('school_id', $school->id)
            ->withCount('students')
            ->with('teachers')
            ->get();

        return Inertia::render('Principal/Classes', [
            'classes' => $classes,
            'teachers' => User::where('school_id', $school->id)->where('role', 'teacher')->get()
        ]);
    }

    public function storeClass(Request $request)
    {
        $school = $this->getSchool();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => ['required', Rule::in(['primary', 'jss', 'sss'])],
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:users,id',
        ]);

        $class = SchoolClass::create([
            'school_id' => $school->id,
            'name' => $validated['name'],
            'level' => $validated['level'],
        ]);

        if (!empty($validated['teacher_ids'])) {
            $class->teachers()->sync($validated['teacher_ids']);
        }

        return redirect()->back()->with('success', 'Class created successfully.');
    }

    public function updateClass(Request $request, $schoolClass)
    {
        $school = $this->getSchool();
        $schoolClass = SchoolClass::findOrFail($schoolClass);
        if ($schoolClass->school_id !== $school->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => ['required', Rule::in(['primary', 'jss', 'sss'])],
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:users,id',
        ]);

        $schoolClass->update([
            'name' => $validated['name'],
            'level' => $validated['level'],
        ]);

        if (isset($validated['teacher_ids'])) {
            $schoolClass->teachers()->sync($validated['teacher_ids']);
        }

        return redirect()->back()->with('success', 'Class updated successfully.');
    }

    public function deleteClass($schoolClass)
    {
        $school = $this->getSchool();
        $schoolClass = SchoolClass::findOrFail($schoolClass);
        if ($schoolClass->school_id !== $school->id) {
            abort(403);
        }

        $schoolClass->delete();
        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    public function assignTeacher(Request $request, $schoolClass)
    {
        $school = $this->getSchool();
        $schoolClass = SchoolClass::findOrFail($schoolClass);
        if ($schoolClass->school_id !== $school->id) {
            abort(403);
        }

        $validated = $request->validate([
            'teacher_ids' => 'required|array',
            'teacher_ids.*' => 'exists:users,id'
        ]);

        $schoolClass->teachers()->sync($validated['teacher_ids']);

        return redirect()->back()->with('success', 'Teachers assigned successfully.');
    }

    // --- Student Viewing ---
    public function students()
    {
        $school = $this->getSchool();
        $students = Student::where('school_id', $school->id)
            ->with('schoolClass')
            ->get();
            
        $classes = SchoolClass::where('school_id', $school->id)->get();

        return Inertia::render('Principal/Students', [
            'students' => $students,
            'classes' => $classes
        ]);
    }

    // --- Application Management ---
    public function applications()
    {
        $school = $this->getSchool();
        $applications = Application::where('school_id', $school->id)
            ->latest()
            ->get();
            
        return Inertia::render('Principal/Applications/Index', [
            'applications' => $applications
        ]);
    }

    public function showApplication(Application $application)
    {
        $school = $this->getSchool();
        if ($application->school_id !== $school->id) {
            abort(403);
        }
        
        return Inertia::render('Principal/Applications/Show', [
            'application' => $application
        ]);
    }

    public function approveApplication(Application $application, ApplicationService $service)
    {
        $school = $this->getSchool();
        if ($application->school_id !== $school->id) {
            abort(403);
        }
        
        if ($application->status !== 'pending') {
             return redirect()->back()->with('error', 'Application already processed.');
        }
        
        try {
            $result = $service->approveApplication($application, auth()->user());
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error approving application: ' . $e->getMessage());
        }
        
        return redirect()->back()->with('success', 'Application approved. Student account created with password: ' . $result['raw_password']);
    }

    public function rejectApplication(Request $request, Application $application, ApplicationService $service)
    {
        $school = $this->getSchool();
        if ($application->school_id !== $school->id) {
            abort(403);
        }
        
        if ($application->status !== 'pending') {
             return redirect()->back()->with('error', 'Application already processed.');
        }
        
        $validated = $request->validate([
            'reason' => 'required|string|max:1000'
        ]);
        
        $service->rejectApplication($application, auth()->user(), $validated['reason']);
        
        return redirect()->back()->with('success', 'Application rejected.');
    }
}
