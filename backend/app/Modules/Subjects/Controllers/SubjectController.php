<?php

namespace App\Modules\Subjects\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * SubjectController - Super Admin Subject Management
 * 
 * Handles CRUD operations for global subjects.
 * Only accessible by Super Admin.
 */
class SubjectController extends Controller
{
    /**
     * Display all subjects for management
     */
    public function index()
    {
        $subjects = Subject::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects,
            'levels' => [
                ['value' => 'primary', 'label' => 'Primary'],
                ['value' => 'jss', 'label' => 'Junior Secondary (JSS)'],
                ['value' => 'sss', 'label' => 'Senior Secondary (SSS)'],
                ['value' => 'all', 'label' => 'All Levels'],
            ],
        ]);
    }

    /**
     * Store a new global subject
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name',
            'code' => 'nullable|string|max:50|unique:subjects,code',
            'level' => ['required', Rule::in(['primary', 'jss', 'sss', 'all'])],
            'category' => 'nullable|string|max:100',
        ]);

        Subject::create([
            'name' => $validated['name'],
            'code' => $validated['code'] ?? strtoupper(substr($validated['name'], 0, 3)),
            'level' => $validated['level'],
            'category' => $validated['category'] ?? null,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Subject created successfully.');
    }

    /**
     * Update an existing subject
     */
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('subjects')->ignore($subject->id)],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('subjects')->ignore($subject->id)],
            'level' => ['required', Rule::in(['primary', 'jss', 'sss', 'all'])],
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $subject->update($validated);

        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    /**
     * Deactivate a subject (soft delete behavior)
     * Does not hard delete to preserve referential integrity
     */
    public function deactivate(Subject $subject)
    {
        $subject->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Subject deactivated successfully.');
    }

    /**
     * Reactivate a previously deactivated subject
     */
    public function activate(Subject $subject)
    {
        $subject->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Subject activated successfully.');
    }
}
