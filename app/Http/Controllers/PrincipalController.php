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

class PrincipalController extends Controller
{
    private function getSchool()
    {
        return auth()->user()->school;
    }

    public function dashboard()
    {
        $school = $this->getSchool();
        
        return Inertia::render('Principal/Dashboard', [
            'school' => $school,
            'stats' => [
                'students' => Student::where('school_id', $school->id)->count(),
                'teachers' => User::where('school_id', $school->id)->where('role', 'teacher')->count(),
                'classes' => SchoolClass::where('school_id', $school->id)->count(),
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

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
            'school_id' => $school->id,
        ]);

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

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function deleteTeacher(User $teacher)
    {
        $school = $this->getSchool();
        if ($teacher->school_id !== $school->id) {
            abort(403);
        }

        $teacher->delete();
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

    public function updateClass(Request $request, SchoolClass $schoolClass)
    {
        $school = $this->getSchool();
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

    public function deleteClass(SchoolClass $schoolClass)
    {
        $school = $this->getSchool();
        if ($schoolClass->school_id !== $school->id) {
            abort(403);
        }

        $schoolClass->delete();
        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    public function assignTeacher(Request $request, SchoolClass $schoolClass)
    {
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
