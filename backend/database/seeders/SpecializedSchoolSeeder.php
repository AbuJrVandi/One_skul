<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\District;
use App\Models\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SpecializedSchoolSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Kenema District exists
        $district = District::firstOrCreate(['name' => 'Kenema']);

        // 2. Create The Door International Academy
        $school = School::create([
            'district_id' => $district->id,
            'name' => 'The Door International Academy',
            'slug' => School::generateUniqueSlug('The Door International Academy'),
            'tenant_db_driver' => 'sqlite',
            'tenant_db_path' => 'tenants/the-door-international-academy.sqlite',
            'year_founded' => 2010,
            'school_type' => 'private',
            'levels' => ['nursery', 'primary', 'secondary', 'senior'],
            'faculties' => ['Science', 'Arts', 'Commercial'],
            'principal_name' => 'Dr. Alusine Kamara',
            'is_approved' => true,
        ]);

        // 3. Create Role-Based Users for this specific school
        
        // ADMIN (Principal)
        User::create([
            'school_id' => $school->id,
            'name' => 'Principal Office',
            'email' => 'principal@thedoor.edu',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // TEACHER
        User::create([
            'school_id' => $school->id,
            'name' => 'Mohamed Jalloh',
            'email' => 'teacher@thedoor.edu',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);

        // PARENT / STUDENT
        User::create([
            'school_id' => $school->id,
            'name' => 'Sahr Koroma',
            'email' => 'parent@thedoor.edu',
            'password' => Hash::make('password'),
            'role' => 'parent',
        ]);
    }
}
