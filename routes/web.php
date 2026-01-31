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

// Application Flow
use App\Http\Controllers\ApplicationController;
use App\Modules\Attendance\Controllers\AttendanceController;
use App\Modules\Grades\Controllers\GradeController;
use App\Modules\Attendance\Controllers\StudentAttendanceController;
use App\Modules\Grades\Controllers\StudentGradesController;

Route::get('/apply/schools', [ApplicationController::class, 'discovery'])->name('apply.discovery');
Route::get('/apply/schools/{school}', [ApplicationController::class, 'showForm'])->name('apply.form');
Route::post('/apply/schools/{school}', [ApplicationController::class, 'submit'])->name('apply.submit');
Route::get('/apply/success/{application}', [ApplicationController::class, 'success'])->name('apply.success');

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

    // Subject Management (Super Admin)
    Route::get('/subjects', [\App\Modules\Subjects\Controllers\SubjectController::class, 'index'])->name('subjects.index');
    Route::post('/subjects', [\App\Modules\Subjects\Controllers\SubjectController::class, 'store'])->name('subjects.store');
    Route::patch('/subjects/{subject}', [\App\Modules\Subjects\Controllers\SubjectController::class, 'update'])->name('subjects.update');
    Route::post('/subjects/{subject}/deactivate', [\App\Modules\Subjects\Controllers\SubjectController::class, 'deactivate'])->name('subjects.deactivate');
    Route::post('/subjects/{subject}/activate', [\App\Modules\Subjects\Controllers\SubjectController::class, 'activate'])->name('subjects.activate');

    // Term Management (Super Admin)
    Route::get('/terms', [\App\Modules\Terms\Controllers\TermController::class, 'index'])->name('terms.index');
    Route::post('/terms', [\App\Modules\Terms\Controllers\TermController::class, 'store'])->name('terms.store');
    Route::patch('/terms/{term}', [\App\Modules\Terms\Controllers\TermController::class, 'update'])->name('terms.update');
    Route::post('/terms/{term}/deactivate', [\App\Modules\Terms\Controllers\TermController::class, 'deactivate'])->name('terms.deactivate');
    Route::post('/terms/{term}/activate', [\App\Modules\Terms\Controllers\TermController::class, 'activate'])->name('terms.activate');
    
    // Academic Year Management (Super Admin)
    Route::post('/academic-years', [\App\Modules\Terms\Controllers\TermController::class, 'storeAcademicYear'])->name('academic-years.store');
    Route::patch('/academic-years/{academicYear}', [\App\Modules\Terms\Controllers\TermController::class, 'updateAcademicYear'])->name('academic-years.update');
    Route::post('/academic-years/{academicYear}/set-current', [\App\Modules\Terms\Controllers\TermController::class, 'setCurrent'])->name('academic-years.set-current');
});

// Principal (School Admin) Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsPrincipal::class])->prefix('school-admin')->name('principal.')->group(function () {
    Route::get('/dashboard', [PrincipalController::class, 'dashboard'])->name('dashboard');
    
    // Application Management
    Route::get('/applications', [PrincipalController::class, 'applications'])->name('applications.index');
    Route::get('/applications/{application}', [PrincipalController::class, 'showApplication'])->name('applications.show');
    Route::post('/applications/{application}/approve', [PrincipalController::class, 'approveApplication'])->name('applications.approve');
    Route::post('/applications/{application}/reject', [PrincipalController::class, 'rejectApplication'])->name('applications.reject');
    
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

    // Subject Management (Principal - enable/disable & assign to classes)
    Route::get('/subjects', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'index'])->name('subjects.index');
    Route::post('/subjects/{subject}/toggle', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'toggle'])->name('subjects.toggle');
    Route::get('/subjects/class-assignment', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'classAssignment'])->name('subjects.class-assignment');
    Route::post('/classes/{schoolClass}/assign-subjects', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'assignSubjects'])->name('classes.assign-subjects');

    // Student Application Management (New Module)
    Route::get('/student-applications', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'index'])->name('principal.applications.index');
    Route::get('/student-applications/{application}', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'show'])->name('principal.applications.show');
    Route::post('/student-applications/{application}/approve', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'approve'])->name('principal.applications.approve');
    Route::post('/student-applications/{application}/reject', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'reject'])->name('principal.applications.reject');
});

// Teacher Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsTeacher::class])->prefix('classroom')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::get('/class/{schoolClass}', [TeacherController::class, 'classView'])->name('class.view');
    Route::post('/students', [TeacherController::class, 'storeStudent'])->name('students.store');
    
    // Attendance Module
    Route::get('/class/{schoolClass}/attendance', [AttendanceController::class, 'index'])->name('class.attendance.index');
    Route::post('/class/{schoolClass}/attendance', [AttendanceController::class, 'store'])->name('class.attendance.store');

    // Grades Module
    Route::get('/class/{schoolClass}/grades', [GradeController::class, 'index'])->name('class.grades.index');
    Route::post('/class/{schoolClass}/grades', [GradeController::class, 'store'])->name('class.grades.store');
});

// Student Routes
Route::middleware(['auth'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/attendance', [StudentAttendanceController::class, 'index'])->name('attendance');
    Route::get('/grades', [StudentGradesController::class, 'index'])->name('grades');
});


// -----------------------------------------------------------------------------
// Public Student Application Routes
// -----------------------------------------------------------------------------
Route::group(['prefix' => 'schools/{school}/apply'], function () {
    Route::get('/', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'start'])->name('public.applications.start');
    Route::get('/form', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'form'])->name('public.applications.form');
    Route::post('/form', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'storeForm'])->name('public.applications.store');
    
    Route::get('/{ref}/review', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'review'])->name('public.applications.review');
    Route::post('/{ref}/confirm', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'confirmReview'])->name('public.applications.confirm');
    
    Route::get('/{ref}/payment', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'payment'])->name('public.applications.payment');
    Route::post('/{ref}/pay', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'submitPayment'])->name('public.applications.pay');
    
    Route::get('/{ref}/confirmation', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'confirmation'])->name('public.applications.confirmation');
    Route::get('/{ref}/download', [\App\Modules\Applications\Controllers\PublicApplicationController::class, 'downloadPdf'])->name('public.applications.download');
});

require __DIR__.'/auth.php';
