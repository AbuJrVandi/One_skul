<?php

namespace App\Services;

use App\Models\School;
use App\Models\SchoolReportAsset;
use App\Models\User;
use App\Modules\Applications\Models\Application;
use App\Modules\Applications\Models\StudentDecisionDocument;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DecisionDocumentService
{
    public function generateForApplication(Application $application, string $decision, ?User $principal = null): StudentDecisionDocument
    {
        $decision = $decision === 'accepted' ? 'accepted' : 'rejected';

        $existing = StudentDecisionDocument::where('application_id', $application->id)
            ->where('decision', $decision)
            ->first();

        if ($existing) {
            return $existing;
        }

        $school = School::findOrFail($application->school_id);
        $student = $application->student;

        $documentId = $this->generateDocumentId();
        $verificationCode = $this->generateVerificationCode($school->slug ?? 'school');
        $admissionReference = $decision === 'accepted' ? $this->generateAdmissionReference() : null;

        $logo = null;
        if (class_exists(SchoolReportAsset::class)) {
            $logo = SchoolReportAsset::where('school_id', $school->id)
                ->where('asset_type', 'logo')
                ->first();
        }

        $academicYear = $this->academicYear();

        $data = [
            'school' => [
                'name' => $school->name,
                'address' => $school->address ?? $school->district?->name,
                'email' => $school->email ?? null,
                'phone' => $school->phone ?? null,
                'logo_url' => $logo?->file_path ? asset('storage/' . $logo->file_path) : null,
            ],
            'application' => [
                'reference' => $application->application_reference,
                'class_level' => $application->class_level,
                'class_category' => $application->class_category,
            ],
            'student' => [
                'full_name' => trim($application->first_name . ' ' . $application->last_name),
                'admission_number' => $student?->index_number ?? $admissionReference,
            ],
            'decision' => $decision,
            'document' => [
                'document_id' => $documentId,
                'verification_code' => $verificationCode,
                'admission_reference' => $admissionReference,
                'academic_year' => $academicYear,
                'generated_at' => now()->format('F d, Y'),
            ],
            'credentials' => $decision === 'accepted'
                ? [
                    'email' => $application->generated_email,
                    'password' => $application->generated_password,
                    'portal_url' => config('app.url') . '/school/login/student',
                ]
                : null,
            'principal' => [
                'name' => $principal?->name ?? $school->principal_name,
            ],
        ];

        $view = $decision === 'accepted'
            ? 'decision-documents.acceptance'
            : 'decision-documents.rejection';

        $directory = 'decision-documents/' . ($school->slug ?? 'school') . '/' . $application->application_reference;
        $extension = 'pdf';
        $mimeType = 'application/pdf';
        $contents = null;

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView($view, $data)->setPaper('a4');
            $contents = $pdf->output();
        } elseif (class_exists(\Dompdf\Dompdf::class)) {
            $dompdf = new \Dompdf\Dompdf();
            $dompdf->loadHtml(view($view, $data)->render());
            $dompdf->setPaper('a4');
            $dompdf->render();
            $contents = $dompdf->output();
        } else {
            $extension = 'html';
            $mimeType = 'text/html';
            $contents = view($view, $data)->render();
        }

        $filename = $decision . '-' . $documentId . '.' . $extension;
        $path = $directory . '/' . $filename;

        Storage::disk('public')->put($path, $contents);

        return StudentDecisionDocument::create([
            'application_id' => $application->id,
            'student_id' => $student?->id,
            'decision' => $decision,
            'document_id' => $documentId,
            'verification_code' => $verificationCode,
            'admission_reference' => $admissionReference,
            'file_path' => $path,
            'file_size' => $contents ? strlen($contents) : null,
            'mime_type' => $mimeType,
            'generated_by' => $principal?->id,
            'generated_at' => now(),
        ]);
    }

    private function generateDocumentId(): string
    {
        return 'DOC-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
    }

    private function generateVerificationCode(string $schoolSlug): string
    {
        $prefix = strtoupper(substr(preg_replace('/[^a-z0-9]/i', '', $schoolSlug), 0, 4));
        if ($prefix === '') {
            $prefix = 'SCH';
        }
        return $prefix . '-ADM-' . strtoupper(Str::random(6));
    }

    private function generateAdmissionReference(): string
    {
        return 'ADM-' . now()->format('Y') . '-' . strtoupper(Str::random(4));
    }

    private function academicYear(): string
    {
        $year = now()->year;
        return $year . '/' . ($year + 1);
    }
}
