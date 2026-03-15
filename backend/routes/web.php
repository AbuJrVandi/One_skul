<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PublicController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PrincipalController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SchoolProfileController;
use App\Http\Controllers\SchoolLandingController;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/districts/{district}', [PublicController::class, 'district'])->name('public.district');
Route::get('/schools/{school:slug}', [PublicController::class, 'school'])->name('public.school');

// Super Admin Login (separate entry point)
Route::get('/admin', [AuthenticatedSessionController::class, 'createAdmin'])
    ->middleware('guest')
    ->name('admin.login');

// Application Flow
use App\Modules\Attendance\Controllers\AttendanceController;
use App\Modules\Grades\Controllers\GradeController;
use App\Modules\Attendance\Controllers\StudentAttendanceController;
use App\Modules\Grades\Controllers\StudentGradesController;

// School-Based Auth Flow (Global Login)
Route::get('/school/login', [\App\Http\Controllers\SchoolAuthController::class, 'selectRoleGlobal'])->name('school.roles');
Route::get('/school/login/{role}', [\App\Http\Controllers\SchoolAuthController::class, 'showLoginGlobal'])->name('school.login');
Route::get('/schools/{school}/admin', function ($school) {
    $schoolModel = \App\Models\School::query()
        ->where('slug', $school)
        ->orWhere('id', $school)
        ->firstOrFail();

    if ((string) $school !== (string) $schoolModel->slug) {
        return redirect()->route('school.admin.login', [
            'school' => $schoolModel->slug,
        ]);
    }

    return redirect()->route('school.login', [
        'role' => 'admin',
    ]);
})->name('school.admin.login');

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
        if ($user->role === 'applicant') {
            return redirect()->route('applicant.dashboard');
        }
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Applicant Auth
Route::middleware('guest')->group(function () {
    Route::get('/applicant/register', [\App\Http\Controllers\Applicant\ApplicantAuthController::class, 'showRegister'])->name('applicant.register');
    Route::post('/applicant/register', [\App\Http\Controllers\Applicant\ApplicantAuthController::class, 'register'])->name('applicant.register.store');
    Route::get('/applicant/login', [\App\Http\Controllers\Applicant\ApplicantAuthController::class, 'showLogin'])->name('applicant.login');
    Route::post('/applicant/login', [\App\Http\Controllers\Applicant\ApplicantAuthController::class, 'login'])->name('applicant.login.store');
});

// Applicant Dashboard & Applications
Route::middleware(['auth', 'applicant'])->prefix('applicant')->name('applicant.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Applicant\ApplicantDashboardController::class, 'index'])->name('dashboard');
    Route::get('/schools', [\App\Http\Controllers\Applicant\ApplicantSchoolController::class, 'index'])->name('schools.index');
    Route::get('/schools/{school:slug}/apply', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'create'])->name('applications.create');
    Route::post('/schools/{school:slug}/apply/review', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'review'])->name('applications.review.store');
    Route::get('/schools/{school:slug}/apply/review', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'reviewShow'])->name('applications.review');
    Route::post('/schools/{school:slug}/apply/submit', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'store'])->name('applications.store');
    Route::get('/schools/{school:slug}/applications/{application}', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'success'])->name('applications.success');
    Route::get('/schools/{school:slug}/applications/{application}/view', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'show'])->name('applications.show');
    Route::get('/schools/{school:slug}/applications/{application}/print', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'print'])->name('applications.print');
    Route::get('/schools/{school:slug}/applications/{application}/documents/{document}', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'document'])->name('applications.documents.show');
    Route::get('/schools/{school:slug}/applications/{application}/decision-documents/{document}', [\App\Http\Controllers\Applicant\ApplicantApplicationController::class, 'decisionDocument'])->name('applications.decision-documents.show');
    Route::get('/profile', [\App\Http\Controllers\Applicant\ApplicantProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\Applicant\ApplicantProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/password', [\App\Http\Controllers\Applicant\ApplicantProfileController::class, 'updatePassword'])->name('profile.password');
});

// Admin Routes (Super Admin Only)
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsSuperAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    
    Route::get('/portal', [AdminController::class, 'portal'])->name('portal.index');
    Route::get('/portal/schools/{school}', [AdminController::class, 'schoolPortal'])->name('portal.show');
    
    // Principal Management
    Route::post('/portal/schools/{school}/principal/create', [AdminController::class, 'createPrincipal'])->name('portal.principal.create');
    Route::post('/portal/schools/{school}/principal/reset-password', [AdminController::class, 'resetPrincipalPassword'])->name('portal.principal.reset-password');
    Route::post('/portal/schools/{school}/principal/toggle-status', [AdminController::class, 'togglePrincipalStatus'])->name('portal.principal.toggle-status');
    
    // Report Card Settings
    Route::post('/portal/schools/{school}/report-settings', [AdminController::class, 'updateReportSettings'])->name('portal.report-settings.update');
    Route::post('/portal/schools/{school}/report-assets', [AdminController::class, 'uploadReportAsset'])->name('portal.report-assets.upload');
    Route::get('/reports/preview/{school}', [\App\Http\Controllers\ReportCardController::class, 'preview'])->name('reports.preview');
    
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
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsPrincipal::class, 'tenant.user'])->prefix('school-admin')->name('principal.')->group(function () {
    Route::get('/dashboard', [PrincipalController::class, 'dashboard'])->name('dashboard');
    
    // Application Management (Student Applications Module)
    Route::get('/applications', function () {
        return redirect()->route('principal.applications.index');
    })->name('applications.redirect');
    
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

    // School Profile Management (Principal Only)
    Route::patch('/school-profile', [SchoolProfileController::class, 'update'])->name('school-profile.update');
    Route::post('/school-profile/photos', [SchoolProfileController::class, 'storePhoto'])->name('school-profile.photos.store');
    Route::delete('/school-profile/photos/{photo}', [SchoolProfileController::class, 'destroyPhoto'])->name('school-profile.photos.destroy');
    Route::get('/landing-page', [SchoolLandingController::class, 'edit'])->name('landing.edit');
    Route::patch('/landing-page', [SchoolLandingController::class, 'update'])->name('landing.update');
    Route::post('/landing-page/images/{slot}', [SchoolLandingController::class, 'storeImage'])->name('landing.images.store');
    Route::delete('/landing-page/images/{slot}', [SchoolLandingController::class, 'destroyImage'])->name('landing.images.destroy');

    // Subject Management (Principal - enable/disable & assign to classes)
    Route::get('/subjects', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'index'])->name('subjects.index');
    Route::post('/subjects/{subject}/toggle', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'toggle'])->name('subjects.toggle');
    Route::get('/subjects/class-assignment', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'classAssignment'])->name('subjects.class-assignment');
    Route::post('/classes/{schoolClass}/assign-subjects', [\App\Modules\Subjects\Controllers\SchoolSubjectController::class, 'assignSubjects'])->name('classes.assign-subjects');

    // Student Application Management (New Module)
    Route::get('/student-applications', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'index'])->name('applications.index');
    Route::get('/student-applications/{application}', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'show'])->name('applications.show');
    Route::get('/student-applications/{application}/print', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'print'])->name('applications.print');
    Route::get('/student-applications/{application}/documents/{document}', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'document'])->name('applications.documents.show');
    Route::post('/student-applications/{application}/approve', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'approve'])->name('applications.approve');
    Route::post('/student-applications/{application}/reject', [\App\Modules\Applications\Controllers\PrincipalApplicationController::class, 'reject'])->name('applications.reject');
});

// Teacher Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsTeacher::class, 'tenant.user'])->prefix('classroom')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherController::class, 'dashboard'])->name('dashboard');
    Route::get('/classes', [TeacherController::class, 'classesIndex'])->name('classes.index');
    Route::get('/class/{schoolClass}', [TeacherController::class, 'classView'])->name('class.view');
    Route::get('/students/{student}', [TeacherController::class, 'studentProfile'])->name('students.show');
    
    // Attendance Module
    Route::get('/class/{schoolClass}/attendance', [AttendanceController::class, 'index'])->name('class.attendance.index');
    Route::post('/class/{schoolClass}/attendance', [AttendanceController::class, 'store'])->name('class.attendance.store');

    // Grades Module
    Route::get('/class/{schoolClass}/grades', [GradeController::class, 'index'])->name('class.grades.index');
    Route::post('/class/{schoolClass}/grades', [GradeController::class, 'store'])->name('class.grades.store');
});

// Student Routes
Route::middleware(['auth', 'tenant.user'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/attendance', [StudentAttendanceController::class, 'index'])->name('attendance');
    Route::get('/grades', [StudentGradesController::class, 'index'])->name('grades');
    Route::get('/profile', [StudentController::class, 'profile'])->name('profile');
    Route::post('/profile', [StudentController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/photo', [StudentController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [StudentController::class, 'removePhoto'])->name('profile.photo.remove');
    Route::get('/report-card/{student}/{term}', [\App\Http\Controllers\ReportCardController::class, 'download'])->name('report-card.download');
    Route::get('/decision-documents/{document}', [StudentController::class, 'decisionDocument'])->name('decision-documents.show');
});


require __DIR__.'/auth.php';
