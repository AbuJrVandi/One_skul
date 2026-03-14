<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfilePhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $school = $user?->school;
        if (!$user || $user->role !== 'admin' || !$school) {
            abort(403);
        }

        $validated = $request->validate([
            'levels' => 'nullable|array',
            'levels.*' => 'in:nursery,primary,secondary,senior',
            'faculties' => 'nullable|array',
            'faculties.*' => 'string|max:255',
        ]);

        $levels = collect($validated['levels'] ?? [])->values()->all();
        $faculties = collect($validated['faculties'] ?? [])
            ->map(function ($value) {
                return trim($value);
            })
            ->filter()
            ->values()
            ->all();

        $school->update([
            'levels' => $levels,
            'faculties' => $faculties,
        ]);

        return redirect()->back()->with('success', 'School profile updated successfully.');
    }

    public function storePhoto(Request $request)
    {
        $user = $request->user();
        $school = $user?->school;
        if (!$user || $user->role !== 'admin' || !$school) {
            abort(403);
        }

        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        if ($school->profilePhotos()->count() >= 4) {
            return redirect()->back()->withErrors([
                'photo' => 'Maximum of 4 photos allowed.'
            ]);
        }

        $path = $request->file('photo')->store('schools/profile', 'public');
        $school->profilePhotos()->create([
            'file_path' => $path,
        ]);

        return redirect()->back()->with('success', 'School photo uploaded successfully.');
    }

    public function destroyPhoto(SchoolProfilePhoto $photo, Request $request)
    {
        $user = $request->user();
        $school = $user?->school;
        if (!$user || $user->role !== 'admin' || !$school) {
            abort(403);
        }

        if ($photo->school_id !== $school->id) {
            abort(403);
        }

        Storage::disk('public')->delete($photo->file_path);
        $photo->delete();

        return redirect()->back()->with('success', 'School photo removed successfully.');
    }
}
