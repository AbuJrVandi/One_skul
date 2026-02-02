<?php

namespace App\Modules\Applications\Controllers;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Modules\Applications\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PublicApplicationController extends Controller
{
    /**
     * Step 1: Category & Class Level Selection
     */
    public function start(School $school)
    {
        if (!$school->is_approved) {
            abort(404, 'This school is not currently accepting applications.');
        }

        return Inertia::render('Applications/Start', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'district' => $school->district?->name,
            ]
        ]);
    }

    /**
     * Step 2: Dynamic Form based on category
     */
    public function form(School $school, Request $request)
    {
        $category = $request->query('category');
        $classLevel = $request->query('class');
        
        if (!in_array($category, ['primary', 'jss', 'sss'])) {
            return to_route('public.applications.start', $school->id);
        }

        // Define available class levels per category
        $classLevels = $this->getClassLevels($category);

        return Inertia::render('Applications/Form', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
            ],
            'category' => $category,
            'classLevel' => $classLevel,
            'classLevels' => $classLevels,
        ]);
    }

    /**
     * Store application form data
     */
    public function storeForm(School $school, Request $request)
    {
        $category = $request->input('class_category');
        $classLevel = $request->input('class_level');
        
        // Dynamic Validation Rules
        $rules = [
            'class_category' => 'required|in:primary,jss,sss',
            'class_level' => 'required|string',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female',
            'address' => 'required|string|max:500',
            'guardian_name' => 'required|string|max:255',
            'guardian_phone' => 'required|string|max:20',
            'guardian_email' => 'nullable|email',
        ];

        // Category-specific validation
        if ($category === 'primary') {
            $rules['email'] = 'nullable|email';
        } else {
            $rules['email'] = 'nullable|email';
            $rules['previous_school'] = 'required|string|max:255';
        }

        if ($category === 'sss') {
            $rules['bece_index_number'] = 'required|string|max:50';
            $rules['subject_interests'] = 'required|string|max:500';
        }

        if ($category === 'jss') {
            $rules['primary_school'] = 'nullable|string|max:255';
        }

        $validated = $request->validate($rules);

        // Validate class_level matches category
        $validLevels = array_column($this->getClassLevels($category), 'id');
        if (!in_array($classLevel, $validLevels)) {
            return back()->withErrors(['class_level' => 'Invalid class level selected.']);
        }

        // Check for duplicate applications (same name + DOB + school)
        $existingApp = Application::where('school_id', $school->id)
            ->where('first_name', $validated['first_name'])
            ->where('last_name', $validated['last_name'])
            ->whereJsonContains('application_data->date_of_birth', $validated['date_of_birth'])
            ->whereIn('status', ['draft', 'submitted', 'approved'])
            ->first();

        if ($existingApp) {
            return back()->withErrors([
                'error' => 'An application already exists for this student. Reference: ' . $existingApp->application_reference
            ]);
        }

        // Store Logic
        DB::beginTransaction();
        try {
            $reference = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
            $pin = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);

            $application = Application::create([
                'school_id' => $school->id,
                'application_reference' => $reference,
                'application_pin' => $pin,
                'class_category' => $category,
                'class_level' => $classLevel,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['guardian_phone'],
                'application_data' => $validated,
                'status' => 'draft',
            ]);

            DB::commit();

            return to_route('public.applications.review', ['school' => $school->id, 'ref' => $reference]);
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);
            return back()->withErrors(['error' => 'Application creation failed. Please try again.']);
        }
    }

    /**
     * Step 3: Review Page
     */
    public function review(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        if (!in_array($application->status, ['draft'])) {
            return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
        }

        return Inertia::render('Applications/Review', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
            ],
            'application' => [
                'id' => $application->id,
                'application_reference' => $application->application_reference,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'email' => $application->email,
                'class_category' => $application->class_category,
                'class_category_label' => $application->class_category_label,
                'class_level' => $application->class_level,
                'application_data' => $application->application_data,
            ]
        ]);
    }

    /**
     * Confirm review and proceed to payment
     */
    public function confirmReview(School $school, $ref, Request $request)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->where('status', 'draft')
            ->firstOrFail();

        // Terms must be accepted
        $request->validate([
            'terms_accepted' => 'required|accepted',
        ]);

        return to_route('public.applications.payment', ['school' => $school->id, 'ref' => $ref]);
    }

    /**
     * Step 4: Payment Method Page
     */
    public function payment(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        if (!in_array($application->status, ['draft'])) {
            return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
        }

        return Inertia::render('Applications/Payment', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
            ],
            'application' => [
                'application_reference' => $application->application_reference,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'class_category' => $application->class_category,
                'class_category_label' => $application->class_category_label,
                'class_level' => $application->class_level,
            ]
        ]);
    }

    /**
     * Submit payment (placeholder - no real payment)
     */
    public function submitPayment(School $school, $ref, Request $request)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->where('status', 'draft')
            ->firstOrFail();

        $validated = $request->validate([
            'payment_method' => 'required|in:bank_transfer,card,cash',
        ]);

        $application->update([
            'status' => 'submitted',
            'submitted_at' => now(),
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'completed', // Placeholder - assume paid
            'payment_at' => now(),
        ]);

        return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
    }

    /**
     * Step 5: Final Confirmation Page
     */
    public function confirmation(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        return Inertia::render('Applications/Confirmation', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
            ],
            'application' => [
                'application_reference' => $application->application_reference,
                'application_pin' => $application->application_pin,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'class_category' => $application->class_category,
                'class_category_label' => $application->class_category_label,
                'class_level' => $application->class_level,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at?->format('F d, Y \a\t h:i A'),
            ]
        ]);
    }

    /**
     * PDF Download / Print View
     */
    public function downloadPdf(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        return Inertia::render('Applications/PdfPrint', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
            ],
            'application' => [
                'application_reference' => $application->application_reference,
                'application_pin' => $application->application_pin,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'email' => $application->email,
                'phone' => $application->phone,
                'class_category' => $application->class_category,
                'class_category_label' => $application->class_category_label,
                'class_level' => $application->class_level,
                'application_data' => $application->application_data,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at?->format('F d, Y \a\t h:i A'),
            ]
        ]);
    }

    /**
     * Get class levels for a category
     */
    private function getClassLevels(string $category): array
    {
        return match($category) {
            'primary' => [
                ['id' => 'class-1', 'name' => 'Class 1'],
                ['id' => 'class-2', 'name' => 'Class 2'],
                ['id' => 'class-3', 'name' => 'Class 3'],
                ['id' => 'class-4', 'name' => 'Class 4'],
                ['id' => 'class-5', 'name' => 'Class 5'],
                ['id' => 'class-6', 'name' => 'Class 6'],
            ],
            'jss' => [
                ['id' => 'jss-1', 'name' => 'JSS 1'],
                ['id' => 'jss-2', 'name' => 'JSS 2'],
                ['id' => 'jss-3', 'name' => 'JSS 3'],
            ],
            'sss' => [
                ['id' => 'sss-1', 'name' => 'SSS 1'],
                ['id' => 'sss-2', 'name' => 'SSS 2'],
                ['id' => 'sss-3', 'name' => 'SSS 3'],
            ],
            default => [],
        };
    }
}
