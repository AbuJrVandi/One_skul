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

        return Inertia::render('SchoolProfile', [
            'school' => $school,
            'stats' => [
                'students' => $studentCount,
                'teachers' => $teacherCount,
            ],
            'profile' => [
                'levels' => $school->levels ?? [],
                'faculties' => $school->faculties ?? [],
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
        ]);
    }
}
