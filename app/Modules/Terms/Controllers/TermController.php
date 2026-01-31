<?php

namespace App\Modules\Terms\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Term;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * TermController - Super Admin Term Management
 * 
 * Handles CRUD operations for global terms.
 * Only accessible by Super Admin.
 */
class TermController extends Controller
{
    /**
     * Display all terms grouped by academic year
     */
    public function index()
    {
        $academicYears = AcademicYear::with(['terms' => function ($query) {
                $query->orderBy('term_number');
            }])
            ->orderBy('start_date', 'desc')
            ->get();

        return Inertia::render('Admin/Terms/Index', [
            'academicYears' => $academicYears,
            'termNumbers' => [
                ['value' => '1', 'label' => 'Term 1'],
                ['value' => '2', 'label' => 'Term 2'],
                ['value' => '3', 'label' => 'Term 3'],
            ],
        ]);
    }

    /**
     * Store a new academic year
     */
    public function storeAcademicYear(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        // If setting as current, unset other current years
        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        $academicYear = AcademicYear::create($validated);

        // Auto-create 3 terms for the new academic year
        for ($i = 1; $i <= 3; $i++) {
            Term::create([
                'academic_year_id' => $academicYear->id,
                'name' => "Term {$i}",
                'term_number' => $i,
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Academic year created with 3 terms.');
    }

    /**
     * Update an academic year
     */
    public function updateAcademicYear(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', Rule::unique('academic_years')->ignore($academicYear->id)],
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        // If setting as current, unset other current years
        if ($validated['is_current'] ?? false) {
            AcademicYear::where('is_current', true)
                ->where('id', '!=', $academicYear->id)
                ->update(['is_current' => false]);
        }

        $academicYear->update($validated);

        return redirect()->back()->with('success', 'Academic year updated successfully.');
    }

    /**
     * Store a new term
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:50',
            'term_number' => ['required', Rule::in(['1', '2', '3', 1, 2, 3])],
        ]);

        // Check if term already exists for this academic year
        $exists = Term::where('academic_year_id', $validated['academic_year_id'])
            ->where('term_number', $validated['term_number'])
            ->exists();

        if ($exists) {
            return redirect()->back()->withErrors(['term_number' => 'This term already exists for the selected academic year.']);
        }

        Term::create([
            'academic_year_id' => $validated['academic_year_id'],
            'name' => $validated['name'],
            'term_number' => $validated['term_number'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Term created successfully.');
    }

    /**
     * Update an existing term
     */
    public function update(Request $request, Term $term)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $term->update($validated);

        return redirect()->back()->with('success', 'Term updated successfully.');
    }

    /**
     * Deactivate a term (soft delete behavior)
     */
    public function deactivate(Term $term)
    {
        $term->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Term deactivated successfully.');
    }

    /**
     * Reactivate a previously deactivated term
     */
    public function activate(Term $term)
    {
        $term->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Term activated successfully.');
    }

    /**
     * Set an academic year as current
     */
    public function setCurrent(AcademicYear $academicYear)
    {
        AcademicYear::where('is_current', true)->update(['is_current' => false]);
        $academicYear->update(['is_current' => true]);

        return redirect()->back()->with('success', 'Academic year set as current.');
    }
}
