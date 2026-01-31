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
     * Step 1: Category Selection
     */
    public function start(School $school)
    {
        return Inertia::render('Applications/Start', [
            'school' => $school
        ]);
    }

    /**
     * Step 2: Dynamic Form
     */
    public function form(School $school, Request $request)
    {
        $category = $request->query('category');
        
        if (!in_array($category, ['primary', 'jss', 'sss'])) {
            return to_route('public.applications.start', $school->id);
        }

        return Inertia::render('Applications/Form', [
            'school' => $school,
            'category' => $category
        ]);
    }

    public function storeForm(School $school, Request $request)
    {
        $category = $request->input('class_category');
        
        // Dynamic Validation Rules
        $rules = [
            'class_category' => 'required|in:primary,jss,sss',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female',
            'address' => 'required|string',
            'guardian_name' => 'required|string',
            'guardian_phone' => 'required|string',
        ];

        if ($category === 'primary') {
            $rules['email'] = 'nullable|email'; // Optional for primary
        } else {
            $rules['email'] = 'required|email';
            $rules['previous_school'] = 'required|string';
        }

        if ($category === 'sss') {
            $rules['bece_index_number'] = 'required|string';
            $rules['subject_interests'] = 'required|string';
        }

        $validated = $request->validate($rules);

        // Store Logic
        DB::beginTransaction();
        try {
            $reference = 'APP-' . date('Y') . '-' . strtoupper(Str::random(6));
            $pin = mt_rand(100000, 999999);

            $application = Application::create([
                'school_id' => $school->id,
                'application_reference' => $reference,
                'application_pin' => $pin,
                'class_category' => $category,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'] ?? null,
                'phone' => $validated['guardian_phone'], // Use guardian phone as primary contact
                'application_data' => $validated, // Store all data structured
                'status' => 'draft',
            ]);

            DB::commit();

            return to_route('public.applications.review', ['school' => $school->id, 'ref' => $reference]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Application creation failed. Please try again.']);
        }
    }

    /**
     * Step 3: Review
     */
    public function review(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        if ($application->status !== 'draft') {
            return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
        }

        return Inertia::render('Applications/Review', [
            'school' => $school,
            'application' => $application
        ]);
    }

    public function confirmReview(School $school, $ref)
    {
        // Simply redirect to payment
        return to_route('public.applications.payment', ['school' => $school->id, 'ref' => $ref]);
    }

    /**
     * Step 4: Payment Method
     */
    public function payment(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        if ($application->status !== 'draft') {
            return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
        }

        return Inertia::render('Applications/Payment', [
            'school' => $school,
            'application' => $application
        ]);
    }

    public function submitPayment(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        $application->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return to_route('public.applications.confirmation', ['school' => $school->id, 'ref' => $ref]);
    }

    /**
     * Step 5: Final Confirmation
     */
    public function confirmation(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        return Inertia::render('Applications/Confirmation', [
            'school' => $school,
            'application' => $application
        ]);
    }

    /**
     * PDF Download
     */
    public function downloadPdf(School $school, $ref)
    {
        $application = Application::where('application_reference', $ref)
            ->where('school_id', $school->id)
            ->firstOrFail();

        // For MVP without DOMPDF, return a print view
        return Inertia::render('Applications/PdfPrint', [
            'school' => $school,
            'application' => $application
        ]);
    }
}
