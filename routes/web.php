<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PublicController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PrincipalController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/districts/{district}', [PublicController::class, 'district'])->name('public.district');
Route::get('/schools/{school}', [PublicController::class, 'school'])->name('public.school');

// School-Based Auth Flow
Route::get('/schools/{school}/access', [\App\Http\Controllers\SchoolAuthController::class, 'selectRole'])->name('school.roles');
Route::get('/schools/{school}/login/{role}', [\App\Http\Controllers\SchoolAuthController::class, 'showLogin'])->name('school.login');

// Auth Routes (Breeze)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isAdmin()) { // Principal
            return redirect()->route('principal.dashboard');
        }
        if ($user->role === 'teacher') {
            return redirect()->route('teacher.dashboard');
        }
        if ($user->role === 'student' || $user->role === 'parent') {
            return redirect()->route('student.dashboard');
        }
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes (Super Admin Only)
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsSuperAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    Route::get('/portal', [AdminController::class, 'portal'])->name('portal.index');
    Route::get('/portal/schools/{school}', [AdminController::class, 'schoolPortal'])->name('portal.show');
    
    Route::get('/districts', [AdminController::class, 'districts'])->name('districts.index');
    Route::post('/districts', [AdminController::class, 'storeDistrict'])->name('districts.store');
    Route::patch('/districts/{district}', [AdminController::class, 'updateDistrict'])->name('districts.update');
    Route::delete('/districts/{district}', [AdminController::class, 'deleteDistrict'])->name('districts.destroy');
    
    Route::get('/schools', [AdminController::class, 'schools'])->name('schools.index');
    Route::post('/schools', [AdminController::class, 'storeSchool'])->name('schools.store');
    Route::patch('/schools/{school}', [AdminController::class, 'updateSchool'])->name('schools.update');
    Route::delete('/schools/{school}', [AdminController::class, 'deleteSchool'])->name('schools.destroy');
    Route::post('/schools/{school}/toggle-approval', [AdminController::class, 'toggleApproval'])->name('schools.toggle-approval');
});

// Principal (School Admin) Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsPrincipal::class])->prefix('school-admin')->name('principal.')->group(function () {
    Route::get('/dashboard', [PrincipalController::class, 'dashboard'])->name('dashboard');
    
    Route::get('/teachers', [PrincipalController::class, 'teachers'])->name('teachers.index');
    Route::post('/teachers', [PrincipalController::class, 'storeTeacher'])->name('teachers.store');
    Route::patch('/teachers/{teacher}', [PrincipalController::class, 'updateTeacher'])->name('teachers.update');
    Route::delete('/teachers/{teacher}', [PrincipalController::class, 'deleteTeacher'])->name('teachers.destroy');
    
    Route::get('/classes', [PrincipalController::class, 'classes'])->name('classes.index');
    Route::post('/classes', [PrincipalController::class, 'storeClass'])->name('classes.store');
    Route::patch('/classes/{schoolClass}', [PrincipalController::class, 'updateClass'])->name('classes.update');
    Route::delete('/classes/{schoolClass}', [PrincipalController::class, 'deleteClass'])->name('classes.destroy');
    Route::post('/classes/{schoolClass}/assign-teachers', [PrincipalController::class, 'assignTeacher'])->name('classes.assign');
    
    Route::post('/notices', [PrincipalController::class, 'storeNotice'])->name('notices.store');
    
    Route::get('/students', [PrincipalController::class, 'students'])->name('students.index');
});

// Teacher Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsTeacher::class])->prefix('classroom')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::get('/class/{schoolClass}', [TeacherController::class, 'classView'])->name('class.view');
    Route::post('/students', [TeacherController::class, 'storeStudent'])->name('students.store');
});

// Student Routes
Route::middleware(['auth'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/auth.php';
