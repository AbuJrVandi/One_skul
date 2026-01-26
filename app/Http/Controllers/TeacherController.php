<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    private function getTeacher()
    {
        return auth()->user();
    }

    public function dashboard()
    {
        $teacher = $this->getTeacher();
        $classes = $teacher->classes()->withCount('students')->get();
        $notices = \App\Models\Notice::where('school_id', $teacher->school_id)
            ->whereIn('target_audience', ['all', 'teachers'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'classes' => $classes,
            'notices' => $notices
        ]);
    }

    public function classView(SchoolClass $schoolClass)
    {
        // Security: Ensure teacher is assigned to this class
        if (!$this->getTeacher()->classes->contains($schoolClass->id)) {
            abort(403);
        }

        return Inertia::render('Teacher/ClassView', [
            'schoolClass' => $schoolClass->load('students'),
            'students' => $schoolClass->students()->latest()->get()
        ]);
    }

    public function storeStudent(Request $request)
    {
        $teacher = $this->getTeacher();
        
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'index_number' => 'required|string|unique:students,index_number',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'grade_level' => 'required|string',
        ]);

        // Security: Ensure teacher belongs to this class
        if (!$teacher->classes->contains($validated['school_class_id'])) {
            abort(403);
        }

        DB::transaction(function () use ($validated, $teacher) {
            // 1. Generate Automatic Credentials
            $username = Str::lower($validated['first_name'] . '.' . $validated['last_name'] . rand(100, 999));
            $password = Str::random(8); // Temporary password

            $user = User::create([
                'school_id' => $teacher->school_id,
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $username . '@oneskul.edu', // Virtual institutional email
                'password' => Hash::make($password),
                'role' => 'student',
            ]);

            // 2. Create Student Record
            Student::create([
                'school_id' => $teacher->school_id,
                'user_id' => $user->id,
                'school_class_id' => $validated['school_class_id'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'index_number' => $validated['index_number'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'address' => $validated['address'],
                'emergency_contact' => $validated['emergency_contact'],
                'grade_level' => $validated['grade_level'],
            ]);

            // In a real app, we would flash the $username and $password to the teacher one-time
            session()->flash('temp_credentials', [
                'username' => $username . '@oneskul.edu',
                'password' => $password
            ]);
        });

        return redirect()->back()->with('success', 'Student enrolled and credentials generated.');
    }
}
