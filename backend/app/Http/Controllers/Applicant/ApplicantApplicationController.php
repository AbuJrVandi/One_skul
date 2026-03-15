<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Modules\Applications\Models\Application as StudentApplication;
use App\Modules\Applications\Models\StudentApplicationDocument;
use App\Modules\Applications\Models\StudentDecisionDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\TenantManager;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ApplicantApplicationController extends Controller
{
    private const DOCUMENT_FIELDS = [
        'birth_certificate',
        'passport_photo',
        'report_card',
        'transfer_letter',
    ];

    public function create(School $school)
    {
        $school->load('district');

        return Inertia::render('Applicant/Apply', [
            'school' => $school,
        ]);
    }

    public function review(Request $request, School $school): RedirectResponse
    {
        $this->ensureTenantReady($school);
        $validated = $request->validate($this->rules(false));

        $user = $request->user();
        $sessionKey = $this->sessionKey($user->id, $school->id);

        $existing = $request->session()->get($sessionKey);
        if ($existing) {
            $this->clearTempFiles($existing);
        }

        $token = (string) Str::uuid();
        $files = [];

        foreach (self::DOCUMENT_FIELDS as $field) {
            if (!$request->hasFile($field)) {
                continue;
            }

            $file = $request->file($field);
            $extension = $file->getClientOriginalExtension() ?: $file->extension();
            $filename = $field . ($extension ? '.' . $extension : '');
            $tempDir = $this->tempDir($user->id, $school->id, $token);
            $tempPath = $file->storeAs($tempDir, $filename, 'local');

            $files[$field] = [
                'path' => $tempPath,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'extension' => $extension,
            ];
        }

        $form = Arr::except($validated, self::DOCUMENT_FIELDS);

        $request->session()->put($sessionKey, [
            'form' => $form,
            'files' => $files,
            'token' => $token,
        ]);

        return redirect()->route('applicant.applications.review', [
            'school' => $school->slug,
        ]);
    }

    public function reviewShow(Request $request, School $school)
    {
        $this->ensureTenantReady($school);
        $sessionKey = $this->sessionKey($request->user()->id, $school->id);
        $payload = $request->session()->get($sessionKey);

        if (!$payload) {
            return redirect()
                ->route('applicant.applications.create', $school->slug)
                ->with('error', 'Please complete the application form before reviewing.');
        }

        return Inertia::render('Applicant/Review', [
            'school' => $school,
            'form' => $payload['form'] ?? [],
            'files' => collect($payload['files'] ?? [])
                ->map(function ($meta, $key) {
                    return [
                        'type' => $key,
                        'name' => $meta['name'] ?? $key,
                        'size' => $meta['size'] ?? null,
                    ];
                })
                ->values(),
        ]);
    }

    public function store(Request $request, School $school): RedirectResponse
    {
        $this->ensureTenantReady($school);
        $request->validate([
            'confirm' => 'accepted',
        ]);

        $user = $request->user();
        $sessionKey = $this->sessionKey($user->id, $school->id);
        $payload = $request->session()->get($sessionKey);

        if (!$payload) {
            return redirect()
                ->route('applicant.applications.create', $school->slug)
                ->with('error', 'Please complete the application form before submitting.');
        }

        $form = $payload['form'] ?? [];
        $files = $payload['files'] ?? [];
        $token = $payload['token'] ?? (string) Str::uuid();

        $fullName = trim($form['student_full_name'] ?? '');
        $nameParts = preg_split('/\s+/', $fullName, 2);
        $firstName = $nameParts[0] ?? $fullName;
        $lastName = $nameParts[1] ?? '';

        $existing = StudentApplication::where('school_id', $school->id)
            ->where('applicant_user_id', $user->id)
            ->where('class_category', $form['class_category'] ?? '')
            ->where('class_level', $form['class_level'] ?? '')
            ->where('first_name', $firstName)
            ->where('last_name', $lastName)
            ->when(!empty($form['date_of_birth'] ?? null), function ($query) use ($form) {
                $query->where('application_data->date_of_birth', $form['date_of_birth']);
            })
            ->whereIn('status', ['submitted', 'approved'])
            ->orderByDesc('created_at')
            ->first();

        if ($existing) {
            $this->clearTempFiles($payload);
            $request->session()->forget($sessionKey);

            return redirect()->route('applicant.applications.show', [
                'school' => $school->slug,
                'application' => $existing->id,
            ]);
        }

        $reference = $this->referenceFromToken($token);
        $pin = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $application = StudentApplication::firstOrCreate([
            'application_reference' => $reference,
        ], [
            'school_id' => $school->id,
            'applicant_user_id' => $user->id,
            'application_reference' => $reference,
            'application_pin' => $pin,
            'class_category' => $form['class_category'] ?? '',
            'class_level' => $form['class_level'] ?? '',
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $user->email,
            'phone' => $user->phone,
            'application_data' => [
                'student_full_name' => $fullName,
                'gender' => $form['gender'] ?? null,
                'date_of_birth' => $form['date_of_birth'] ?? null,
                'place_of_birth' => $form['place_of_birth'] ?? null,
                'nationality' => $form['nationality'] ?? null,
                'address' => $form['address'] ?? null,
                'district' => $form['district'] ?? null,
                'previous_school_name' => $form['previous_school_name'] ?? null,
                'previous_school_last_class' => $form['previous_school_last_class'] ?? null,
                'previous_school_year_completed' => $form['previous_school_year_completed'] ?? null,
                'guardian_name' => $form['guardian_name'] ?? null,
                'guardian_occupation' => $form['guardian_occupation'] ?? null,
                'guardian_phone' => $form['guardian_phone'] ?? null,
                'guardian_email' => $form['guardian_email'] ?? null,
                'guardian_address' => $form['guardian_address'] ?? null,
                'previous_school' => [
                    'name' => $form['previous_school_name'] ?? null,
                    'last_class' => $form['previous_school_last_class'] ?? null,
                    'year_completed' => $form['previous_school_year_completed'] ?? null,
                ],
                'guardian' => [
                    'name' => $form['guardian_name'] ?? null,
                    'occupation' => $form['guardian_occupation'] ?? null,
                    'phone' => $form['guardian_phone'] ?? null,
                    'email' => $form['guardian_email'] ?? null,
                    'address' => $form['guardian_address'] ?? null,
                ],
            ],
            'status' => 'submitted',
            'submitted_at' => now(),
            'payment_status' => 'pending',
        ]);

        if ($application->wasRecentlyCreated) {
            $this->storeTempDocuments($files, $application, $school);
        }

        $request->session()->forget($sessionKey);

        return redirect()->route('applicant.applications.success', [
            'school' => $school->slug,
            'application' => $application->id,
        ]);
    }

    public function success(School $school, StudentApplication $application)
    {
        if ($application->school_id !== $school->id) {
            abort(404);
        }

        return Inertia::render('Applicant/Success', [
            'school' => $school,
            'application' => [
                'reference' => $application->application_reference,
                'status' => $application->status,
            ],
        ]);
    }

    public function show(Request $request, School $school, StudentApplication $application)
    {
        $this->ensureTenantReady($school);

        if ($application->school_id !== $school->id || $application->applicant_user_id !== $request->user()->id) {
            abort(404);
        }

        $documents = $application->documents()
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'type' => $doc->document_type,
                    'url' => $doc->url,
                ];
            })
            ->values();

        $decisionDocuments = [];
        if (Schema::connection('tenant')->hasTable('student_decision_documents')) {
            if (in_array($application->status, ['approved', 'rejected'], true)) {
                $decision = $application->status === 'approved' ? 'accepted' : 'rejected';
                app(\App\Services\DecisionDocumentService::class)->generateForApplication($application, $decision);
            }

            $decisionDocuments = $application->decisionDocuments()
                ->orderByDesc('generated_at')
                ->get()
                ->map(function ($doc) {
                    return [
                        'id' => $doc->id,
                        'decision' => $doc->decision,
                        'document_id' => $doc->document_id,
                        'verification_code' => $doc->verification_code,
                        'generated_at' => $doc->generated_at?->format('M d, Y'),
                    ];
                })
                ->values();
        }

        return Inertia::render('Applicant/ApplicationShow', [
            'school' => [
                'id' => $school->id,
                'slug' => $school->slug,
                'name' => $school->name,
            ],
            'application' => [
                'id' => $application->id,
                'reference' => $application->application_reference,
                'class_level' => $application->class_level,
                'class_category' => $application->class_category,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at?->format('M d, Y'),
                'application_data' => $application->application_data,
            ],
            'documents' => $documents,
            'decisionDocuments' => $decisionDocuments,
        ]);
    }

    public function print(Request $request, School $school, StudentApplication $application)
    {
        $this->ensureTenantReady($school);

        if ($application->school_id !== $school->id || $application->applicant_user_id !== $request->user()->id) {
            abort(404);
        }

        return Inertia::render('Applicant/ApplicationPrint', [
            'school' => [
                'id' => $school->id,
                'slug' => $school->slug,
                'name' => $school->name,
            ],
            'application' => [
                'reference' => $application->application_reference,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'email' => $application->email,
                'phone' => $application->phone,
                'class_category' => $application->class_category,
                'class_level' => $application->class_level,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at?->format('F d, Y \a\t h:i A'),
                'application_data' => $application->application_data,
            ],
        ]);
    }

    public function document(Request $request, School $school, StudentApplication $application, StudentApplicationDocument $document): BinaryFileResponse
    {
        $this->ensureTenantReady($school);

        if ($application->school_id !== $school->id || $application->applicant_user_id !== $request->user()->id) {
            abort(404);
        }

        if ($document->application_id !== $application->id) {
            abort(404);
        }

        $path = Storage::disk('public')->path($document->file_path);
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    public function decisionDocument(Request $request, School $school, StudentApplication $application, StudentDecisionDocument $document): BinaryFileResponse
    {
        $this->ensureTenantReady($school);

        if ($application->school_id !== $school->id || $application->applicant_user_id !== $request->user()->id) {
            abort(404);
        }

        if ($document->application_id !== $application->id) {
            abort(404);
        }

        $path = Storage::disk('public')->path($document->file_path);
        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    private function rules(bool $requireConfirm): array
    {
        $rules = [
            'student_full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'nationality' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'district' => 'required|string|max:100',
            'class_category' => 'required|string|in:primary,jss,sss',
            'class_level' => 'required|string|max:50',
            'previous_school_name' => 'nullable|string|max:255',
            'previous_school_last_class' => 'nullable|string|max:100',
            'previous_school_year_completed' => 'nullable|string|max:20',
            'guardian_name' => 'required|string|max:255',
            'guardian_occupation' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'guardian_email' => 'nullable|email|max:255',
            'guardian_address' => 'required|string|max:500',
            'birth_certificate' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'passport_photo' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'report_card' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'transfer_letter' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ];

        if ($requireConfirm) {
            $rules['confirm'] = 'accepted';
        }

        return $rules;
    }

    private function sessionKey(int $userId, int $schoolId): string
    {
        return 'applicant_application.' . $userId . '.' . $schoolId;
    }

    private function tempDir(int $userId, int $schoolId, string $token): string
    {
        return 'tmp/applications/' . $userId . '/' . $schoolId . '/' . $token;
    }

    private function clearTempFiles(array $payload): void
    {
        $files = $payload['files'] ?? [];
        foreach ($files as $meta) {
            if (!empty($meta['path'])) {
                Storage::disk('local')->delete($meta['path']);
            }
        }
    }

    private function storeTempDocuments(array $files, StudentApplication $application, School $school): void
    {
        foreach ($files as $key => $meta) {
            if (empty($meta['path'])) {
                continue;
            }

            $targetPath = 'applications/' . $school->slug . '/' . $application->application_reference;
            $filename = $key . (!empty($meta['extension']) ? '.' . $meta['extension'] : '');
            $finalPath = $targetPath . '/' . $filename;

            $contents = Storage::disk('local')->get($meta['path']);
            Storage::disk('public')->put($finalPath, $contents);
            Storage::disk('local')->delete($meta['path']);

            StudentApplicationDocument::create([
                'application_id' => $application->id,
                'document_type' => $key,
                'file_path' => $finalPath,
                'file_size' => $meta['size'] ?? null,
                'mime_type' => $meta['mime'] ?? null,
            ]);
        }
    }

    private function ensureTenantReady(School $school): void
    {
        $tenant = app(TenantManager::class);
        if (!$tenant->isResolved() || !$tenant->school() || $tenant->school()->id !== $school->id) {
            abort(500, 'School database not provisioned. Run: php artisan school:provision ' . ($school->slug ?? $school->id));
        }
    }

    private function referenceFromToken(string $token): string
    {
        $clean = Str::upper(Str::replace('-', '', $token));
        $suffix = substr($clean, 0, 6);
        if (strlen($suffix) < 6) {
            $suffix = Str::upper(Str::random(6));
        }

        return 'APP-' . now()->format('Y') . '-' . $suffix;
    }
}
