<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\District;
use App\Models\School;
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

        $school->load('district');

        return Inertia::render('SchoolProfile', [
            'school' => $school
        ]);
    }
}
