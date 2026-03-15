import React, { useMemo, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import { getSchoolConfig } from './useSchoolConfig';

const LEVEL_OPTIONS = [
    { value: 'nursery', label: 'Nursery' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'senior', label: 'Senior' },
];

export default function SchoolProfile({ school, stats, profile, canManage, canAccessPortal }) {
    const schoolKey = school.slug || school.id;
    const config = getSchoolConfig(school.slug);
    const displayName = config?.brandName || school.name;
    const portalLabel = config?.portal?.portalLabel || 'Enter School Portal';
    const applyLabel = config?.portal?.applyLabel || 'Apply to This School';
    const levels = profile?.levels ?? [];
    const faculties = profile?.faculties ?? [];
    const landing = profile?.landing ?? {};
    const photos = profile?.photos ?? [];
    const heroTitle = landing.hero_title || `Welcome to ${displayName}`;
    const heroSubtitle = landing.hero_subtitle || 'Committed to academic excellence and character development.';
    const aboutTitle = landing.about_title || 'About Our School';
    const aboutText = landing.about_text || 'We provide a safe, inclusive environment where every learner is challenged and supported.';
    const missionText = landing.mission || 'To deliver quality education that prepares students for lifelong success.';
    const visionText = landing.vision || 'To be a leading school recognized for excellence, discipline, and innovation.';
    const highlights = Array.isArray(landing.highlights) ? landing.highlights : [];
    const heroImageUrl = landing.hero_image_url || null;
    const aboutImageUrl = landing.about_image_url || null;

    const [editingProfile, setEditingProfile] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        levels: levels,
        faculties_text: faculties.join(', '),
    });

    const { data: photoData, setData: setPhotoData, post: postPhoto, processing: uploadingPhoto, errors: photoErrors } = useForm({
        photo: null,
    });

    const selectedLevels = useMemo(() => new Set(data.levels || []), [data.levels]);
    const showFacultyEditor = selectedLevels.has('senior');

    const submitProfile = (e) => {
        e.preventDefault();
        const facultiesList = data.faculties_text
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        patch(route('principal.school-profile.update'), {
            data: {
                levels: data.levels,
                faculties: facultiesList,
            },
            preserveScroll: true,
            onSuccess: () => setEditingProfile(false),
        });
    };

    const submitPhoto = (e) => {
        e.preventDefault();
        if (!photoData.photo) return;

        postPhoto(route('principal.school-profile.photos.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setPhotoData('photo', null),
        });
    };

    const removePhoto = (photoId) => {
        if (confirm('Remove this photo from the school profile?')) {
            router.delete(route('principal.school-profile.photos.destroy', photoId), { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Head title={`${displayName} - One-Skul`} />

            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href={canManage ? route('public.school', schoolKey) : '/'} className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">One-Skul</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
                <nav className="flex mb-2 text-sm text-gray-500" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-gray-700">Districts</Link>
                    <span className="mx-2">&rarr;</span>
                    <Link href={route('public.district', school.district.id)} className="hover:text-gray-700">{school.district.name}</Link>
                    <span className="mx-2">&rarr;</span>
                    <span className="text-gray-900 font-medium">{school.name}</span>
                </nav>

                <div className="bg-white shadow-sm rounded-2xl border border-gray-100">
                    <div className="px-6 py-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-gray-50 border-b border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{displayName}</h1>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{school.district.name} District</p>
                            {config?.tagline && (
                                <p className="mt-2 text-sm text-gray-400">{config.tagline}</p>
                            )}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${school.school_type === 'government' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                            {school.school_type.charAt(0).toUpperCase() + school.school_type.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6">
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Total Students</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{stats?.students ?? 0}</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Total Teachers</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{stats?.teachers ?? 0}</p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Year Founded</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{school.year_founded}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="max-w-3xl">
                                <h2 className="text-2xl font-black text-gray-900">{heroTitle}</h2>
                                <p className="mt-2 text-sm text-gray-500">{heroSubtitle}</p>
                            </div>
                            {heroImageUrl && (
                                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={heroImageUrl} alt={`${displayName} hero`} className="w-full h-56 object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{aboutTitle}</p>
                                <p className="mt-3 text-sm text-gray-700">{aboutText}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Mission</p>
                                <p className="mt-3 text-sm text-gray-700">{missionText}</p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Vision</p>
                                <p className="mt-3 text-sm text-gray-700">{visionText}</p>
                            </div>
                        </div>

                        {aboutImageUrl && (
                            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={aboutImageUrl} alt={`${displayName} about`} className="w-full h-64 object-cover" />
                            </div>
                        )}

                        {highlights.length > 0 && (
                            <div className="mt-6">
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Highlights</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {highlights.map((item, index) => (
                                        <span key={`${item}-${index}`} className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 px-6 py-5">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Principal Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{school.principal_name}</dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">School Levels</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {levels.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {levels.map((level) => (
                                                <span key={level} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-wider">
                                                    {level}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Not specified</span>
                                    )}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Senior Faculty</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {levels.includes('senior') ? (
                                        faculties.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {faculties.map((faculty) => (
                                                    <span key={faculty} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                        {faculty}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No faculties listed</span>
                                        )
                                    ) : (
                                        <span className="text-gray-400 italic">Not applicable</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                        <div className="text-sm text-gray-500">
                            All information published here has been verified by the district education office.
                        </div>
                        {canAccessPortal ? (
                            <Link
                                href={route('school.roles')}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            >
                                {portalLabel} &rarr;
                            </Link>
                        ) : (
                            <Link
                                href={route('applicant.login')}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                            >
                                {applyLabel} &rarr;
                            </Link>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">School Compound Gallery</h3>
                            <p className="text-sm text-gray-500">Four-panel view of the school environment.</p>
                        </div>
                        {canManage && (
                            <div className="text-xs text-gray-500">{photos.length}/4 photos</div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => {
                            const photo = photos[index];
                            return (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                    {photo ? (
                                        <img src={photo.url} alt="School compound" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest font-bold">
                                            Empty Slot
                                        </div>
                                    )}
                                    {photo && canManage && (
                                        <button
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-white/90 text-red-600 rounded-lg shadow"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {canManage && (
                        <form onSubmit={submitPhoto} className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhotoData('photo', e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                                disabled={photos.length >= 4}
                            />
                            <PrimaryButton disabled={uploadingPhoto || photos.length >= 4}>
                                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                            </PrimaryButton>
                            {photoErrors.photo && <InputError message={photoErrors.photo} className="mt-2 sm:mt-0" />}
                        </form>
                    )}
                </div>

                {canManage && (
                    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">School Profile Settings</h3>
                                <p className="text-sm text-gray-500">Edit levels and senior faculty for your school.</p>
                            </div>
                            {!editingProfile && (
                                <SecondaryButton onClick={() => setEditingProfile(true)}>
                                    Edit Profile
                                </SecondaryButton>
                            )}
                        </div>

                        {editingProfile ? (
                            <form onSubmit={submitProfile} className="space-y-6">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">School Levels</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {LEVEL_OPTIONS.map((option) => (
                                            <label key={option.value} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer ${selectedLevels.has(option.value) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={selectedLevels.has(option.value)}
                                                    onChange={(e) => {
                                                        const updated = new Set(selectedLevels);
                                                        if (e.target.checked) updated.add(option.value);
                                                        else updated.delete(option.value);
                                                        setData('levels', Array.from(updated));
                                                    }}
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.levels && <InputError message={errors.levels} className="mt-2" />}
                                </div>

                                {showFacultyEditor && (
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Senior Faculties</p>
                                        <textarea
                                            value={data.faculties_text}
                                            onChange={(e) => setData('faculties_text', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={3}
                                            placeholder="Science, Arts, Commercial, Technical"
                                        ></textarea>
                                        <p className="text-xs text-gray-400 mt-1">Separate faculties with commas.</p>
                                        {errors.faculties && <InputError message={errors.faculties} className="mt-2" />}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <SecondaryButton type="button" onClick={() => setEditingProfile(false)}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Use the edit button to update levels, senior faculties, and profile gallery images.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
