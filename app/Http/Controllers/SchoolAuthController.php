<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\School;

class SchoolAuthController extends Controller
{
    /**
     * Step 1: Browse to a school profile (already exists in PublicController@school)
     */
    
    /**
     * Step 2: Role selection page for a specific school
     */
    public function selectRole(School $school)
    {
        return Inertia::render('Auth/RoleSelection', [
            'school' => $school,
        ]);
    }

    /**
     * Step 3: Specific login page based on role and school
     */
    public function showLogin(School $school, $role)
    {
        // Valid roles: admin, teacher, parent, student
        $validRoles = ['admin', 'teacher', 'parent', 'student'];
        
        if (!in_array($role, $validRoles)) {
            abort(404);
        }

        return Inertia::render('Auth/SchoolLogin', [
            'school' => $school,
            'role' => $role,
            'roleLabel' => ucfirst($role)
        ]);
    }
}
