<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ApplicantAuthController extends Controller
{
    public function showRegister(): Response
    {
        return Inertia::render('Applicant/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'applicant',
            'school_id' => null,
            'is_active' => true,
            'applicant_id' => User::generateApplicantId(),
        ]);

        return redirect()->route('applicant.login')->with('status', 'Account created. Please log in.');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Applicant/Login', [
            'status' => session('status'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'identity' => 'required|string',
            'password' => 'required|string',
            'remember' => 'sometimes|boolean',
        ]);

        $field = str_contains($validated['identity'], '@') ? 'email' : 'phone';

        $credentials = [
            $field => $validated['identity'],
            'password' => $validated['password'],
            'role' => 'applicant',
            'is_active' => true,
        ];

        if (!Auth::attempt($credentials, (bool) ($validated['remember'] ?? false))) {
            return back()->withErrors([
                'identity' => 'Invalid credentials.',
            ])->onlyInput('identity');
        }

        $request->session()->regenerate();

        return redirect()->route('applicant.dashboard');
    }
}
