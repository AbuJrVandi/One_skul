<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\District;
use App\Models\School;
use App\Models\User;
use App\Models\Student;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $districts = District::with(['schools' => function ($query) {
            $query->where('is_approved', true);
        }])->get();

        return Inertia::render('Home', [
            'districts' => $districts
        ]);
    }

    public function district(District $district)
    {
        $schools = $district->schools()->where('is_approved', true)->get();

        return Inertia::render('District', [
            'district' => $district,
            'schools' => $schools
        ]);
    }

    public function school(School $school)
    {
        if (!$school->is_approved) {
            abort(404);
        }

        $school->load(['district', 'profilePhotos']);

        $studentCount = Student::where('school_id', $school->id)->count();
        $teacherCount = User::where('school_id', $school->id)->where('role', 'teacher')->count();

        $user = auth()->user();
        $canManage = $user && $user->role === 'admin' && $user->school_id === $school->id;
        $canAccessPortal = $user && $user->school_id === $school->id;

        $landingDefaults = [
            'hero_title' => "Welcome to {$school->name}",
            'hero_subtitle' => 'Committed to academic excellence and character development.',
            'about_title' => 'About Our School',
            'about_text' => 'We provide a safe, inclusive environment where every learner is challenged and supported.',
            'mission' => 'To deliver quality education that prepares students for lifelong success.',
            'vision' => 'To be a leading school recognized for excellence, discipline, and innovation.',
            'highlights' => [
                'Experienced and dedicated teachers',
                'Strong academic culture',
                'Safe and supportive learning environment',
            ],
            'hero_image_path' => null,
            'about_image_path' => null,
        ];

        $landing = array_merge($landingDefaults, $school->landing_content ?? []);
        $heroImagePath = $landing['hero_image_path'] ?? null;
        $aboutImagePath = $landing['about_image_path'] ?? null;
        $landing['hero_image_url'] = $heroImagePath
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($heroImagePath)
            : null;
        $landing['about_image_url'] = $aboutImagePath
            ? \Illuminate\Support\Facades\Storage::disk('public')->url($aboutImagePath)
            : null;

        return Inertia::render('SchoolProfile', [
            'school' => $school,
            'stats' => [
                'students' => $studentCount,
                'teachers' => $teacherCount,
            ],
            'profile' => [
                'levels' => $school->levels ?? [],
                'faculties' => $school->faculties ?? [],
                'landing' => $landing,
                'photos' => $school->profilePhotos
                    ->map(function ($photo) {
                        return [
                            'id' => $photo->id,
                            'url' => $photo->url,
                            'caption' => $photo->caption,
                        ];
                    })
                    ->values(),
            ],
            'canManage' => $canManage,
            'canAccessPortal' => $canAccessPortal,
        ]);
    }
}
