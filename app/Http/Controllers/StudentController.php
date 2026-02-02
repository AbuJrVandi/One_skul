<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->with(['school', 'schoolClass'])->first();
        
        $notices = \App\Models\Notice::where('school_id', $student->school_id)
            ->whereIn('target_audience', ['all', 'students'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'school' => $student ? $student->school : null,
            'class' => $student ? $student->schoolClass : null,
            'notices' => $notices
        ]);
    }

    public function profile()
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->with(['school', 'schoolClass'])->firstOrFail();

        return Inertia::render('Student/Profile', [
            'student' => $student,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string|max:255',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        // Delete old photo if exists
        if ($student->profile_photo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($student->profile_photo_path);
        }

        // Generate unique filename with school scoping
        $file = $request->file('photo');
        $filename = 'student_' . $student->id . '_' . time() . '_' . \Illuminate\Support\Str::random(8) . '.' . $file->getClientOriginalExtension();
        
        // Store in school-scoped directory
        $directory = 'students/' . $student->school_id;
        $path = $file->storeAs($directory, $filename, 'public');

        $student->update([
            'profile_photo_path' => $path
        ]);

        \Illuminate\Support\Facades\Log::info("Student photo updated", [
            'student_id' => $student->id,
            'school_id' => $student->school_id,
            'path' => $path
        ]);

        return redirect()->back()->with('success', 'Profile photo updated successfully.');
    }

    public function removePhoto()
    {
        $user = auth()->user();
        $student = Student::where('user_id', $user->id)->firstOrFail();

        if ($student->profile_photo_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($student->profile_photo_path);
            $student->update(['profile_photo_path' => null]);
        }

        return redirect()->back()->with('success', 'Photo removed successfully.');
    }
}
