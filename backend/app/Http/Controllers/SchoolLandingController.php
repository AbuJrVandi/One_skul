<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolLandingController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();
        $school = $user?->school;

        if (!$user || !$school || !in_array($user->role, ['admin', 'principal'], true)) {
            abort(403);
        }

        $defaults = $this->defaultLandingContent($school->name);
        $school->load('profilePhotos');
        $landing = array_merge($defaults, $school->landing_content ?? []);
        $landing['hero_image_url'] = $this->landingImageUrl($landing['hero_image_path'] ?? null);
        $landing['about_image_url'] = $this->landingImageUrl($landing['about_image_path'] ?? null);

        return Inertia::render('Principal/Landing', [
            'school' => $school,
            'landing' => $landing,
            'photos' => $school->profilePhotos
                ->map(function ($photo) {
                    return [
                        'id' => $photo->id,
                        'url' => $photo->url,
                        'caption' => $photo->caption,
                    ];
                })
                ->values(),
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $school = $user?->school;

        if (!$user || !$school || !in_array($user->role, ['admin', 'principal'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'hero_title' => 'nullable|string|max:150',
            'hero_subtitle' => 'nullable|string|max:255',
            'about_title' => 'nullable|string|max:150',
            'about_text' => 'nullable|string|max:1200',
            'mission' => 'nullable|string|max:1200',
            'vision' => 'nullable|string|max:1200',
            'highlights' => 'nullable|array|max:6',
            'highlights.*' => 'nullable|string|max:120',
        ]);

        $highlights = collect($validated['highlights'] ?? [])
            ->map(function ($value) {
                return trim((string) $value);
            })
            ->filter()
            ->values()
            ->all();

        $landing = array_merge($this->defaultLandingContent($school->name), [
            'hero_title' => $validated['hero_title'] ?? null,
            'hero_subtitle' => $validated['hero_subtitle'] ?? null,
            'about_title' => $validated['about_title'] ?? null,
            'about_text' => $validated['about_text'] ?? null,
            'mission' => $validated['mission'] ?? null,
            'vision' => $validated['vision'] ?? null,
            'highlights' => $highlights,
        ]);

        $existing = $school->landing_content ?? [];
        $landing['hero_image_path'] = $existing['hero_image_path'] ?? null;
        $landing['about_image_path'] = $existing['about_image_path'] ?? null;

        $school->update([
            'landing_content' => $landing,
        ]);

        return redirect()->back()->with('success', 'Landing page updated successfully.');
    }

    public function storeImage(Request $request, string $slot)
    {
        $user = $request->user();
        $school = $user?->school;

        if (!$user || !$school || !in_array($user->role, ['admin', 'principal'], true)) {
            abort(403);
        }

        if (!in_array($slot, ['hero', 'about'], true)) {
            abort(404);
        }

        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        $landing = $school->landing_content ?? [];
        $pathKey = $slot . '_image_path';

        if (!empty($landing[$pathKey])) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($landing[$pathKey]);
        }

        $directory = 'schools/landing/' . $school->id;
        $path = $request->file('photo')->store($directory, 'public');

        $landing[$pathKey] = $path;
        $school->update([
            'landing_content' => $landing,
        ]);

        return redirect()->back()->with('success', 'Landing image updated successfully.');
    }

    public function destroyImage(Request $request, string $slot)
    {
        $user = $request->user();
        $school = $user?->school;

        if (!$user || !$school || !in_array($user->role, ['admin', 'principal'], true)) {
            abort(403);
        }

        if (!in_array($slot, ['hero', 'about'], true)) {
            abort(404);
        }

        $landing = $school->landing_content ?? [];
        $pathKey = $slot . '_image_path';

        if (!empty($landing[$pathKey])) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($landing[$pathKey]);
        }

        $landing[$pathKey] = null;
        $school->update([
            'landing_content' => $landing,
        ]);

        return redirect()->back()->with('success', 'Landing image removed successfully.');
    }

    private function defaultLandingContent(string $schoolName): array
    {
        return [
            'hero_title' => "Welcome to {$schoolName}",
            'hero_subtitle' => 'Committed to academic excellence and character development.',
            'about_title' => 'About Our School',
            'about_text' => 'We provide a safe, inclusive environment where every learner is challenged and supported.',
            'mission' => 'To deliver quality education that prepares students for lifelong success.',
            'vision' => 'To be a leading school recognized for excellence, discipline, and innovation.',
            'highlights' => [
                'Experienced and dedicated teachers',
                'Strong academic culture',
                'Safe and supportive learning environment',
            ],
            'hero_image_path' => null,
            'about_image_path' => null,
        ];
    }

    private function landingImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return \Illuminate\Support\Facades\Storage::disk('public')->url($path);
    }
}
