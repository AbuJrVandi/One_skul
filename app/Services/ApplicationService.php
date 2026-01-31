<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ApplicationService
{
    public function createApplication(array $data)
    {
        $data['application_code'] = 'APP-' . strtoupper(Str::random(8));
        $data['status'] = 'pending';
        
        return Application::create($data);
    }

    public function approveApplication(Application $application, User $principal)
    {
        return DB::transaction(function () use ($application, $principal) {
            // Update Application
            $application->update([
                'status' => 'approved',
                'reviewed_by' => $principal->id,
                'reviewed_at' => now(),
            ]);

            // Generate temporary password
            $password = Str::random(10);

            // Check if user already exists
            if (User::where('email', $application->email)->exists()) {
                throw new \Exception('A user account with this email already exists.');
            }

            // Create User Account
            $user = User::create([
                'name' => $application->first_name . ' ' . $application->last_name,
                'email' => $application->email,
                'password' => Hash::make($password),
                'role' => 'student',
                'school_id' => $application->school_id,
                'phone' => $application->phone,
            ]);

            // Create Student Record
            $student = Student::create([
                'user_id' => $user->id,
                'school_id' => $application->school_id,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'date_of_birth' => $application->date_of_birth,
                'gender' => $application->gender,
                'address' => $application->address,
                'grade_level' => $application->grade_applying_for, // Mapping grade_applying_for to grade_level
                'index_number' => 'STU-' . strtoupper(Str::random(6)), // Generate generic index number
                'emergency_contact' => $application->guardian_phone,
            ]);

            return [
                'user' => $user,
                'student' => $student,
                'raw_password' => $password
            ];
        });
    }

    public function rejectApplication(Application $application, User $principal, string $reason)
    {
        $application->update([
            'status' => 'rejected',
            'reviewed_by' => $principal->id,
            'reviewed_at' => now(),
            'rejection_reason' => $reason
        ]);

        return $application;
    }
}
