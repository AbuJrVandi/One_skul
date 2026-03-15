<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\School;
use Inertia\Inertia;

class ApplicantSchoolController extends Controller
{
    public function index()
    {
        $schools = School::with('district')
            ->where('is_approved', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'district_id', 'school_type']);

        return Inertia::render('Applicant/Schools', [
            'schools' => $schools,
        ]);
    }
}
