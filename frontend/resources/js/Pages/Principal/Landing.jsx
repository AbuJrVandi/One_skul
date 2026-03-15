import React, { useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

export default function Landing({ auth, school, landing, photos = [] }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        hero_title: landing?.hero_title || '',
        hero_subtitle: landing?.hero_subtitle || '',
        about_title: landing?.about_title || '',
        about_text: landing?.about_text || '',
        mission: landing?.mission || '',
        vision: landing?.vision || '',
        highlights: landing?.highlights || [''],
    });

    const heroImageForm = useForm({
        photo: null,
    });

    const aboutImageForm = useForm({
        photo: null,
    });

    const galleryForm = useForm({
        photo: null,
    });

    const highlights = useMemo(
        () => (Array.isArray(data.highlights) ? data.highlights : []),
        [data.highlights]
    );

    const submit = (e) => {
        e.preventDefault();
        patch(route('principal.landing.update'), {
            preserveScroll: true,
        });
    };

    const submitHeroImage = (e) => {
        e.preventDefault();
        if (!heroImageForm.data.photo) return;
        heroImageForm.post(route('principal.landing.images.store', { slot: 'hero' }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => heroImageForm.setData('photo', null),
        });
    };

    const submitAboutImage = (e) => {
        e.preventDefault();
        if (!aboutImageForm.data.photo) return;
        aboutImageForm.post(route('principal.landing.images.store', { slot: 'about' }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => aboutImageForm.setData('photo', null),
        });
    };

    const removeImage = (slot) => {
        if (confirm('Remove this landing image?')) {
            router.delete(route('principal.landing.images.destroy', { slot }), {
                preserveScroll: true,
            });
        }
    };

    const submitGalleryPhoto = (e) => {
        e.preventDefault();
        if (!galleryForm.data.photo) return;
        galleryForm.post(route('principal.school-profile.photos.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => galleryForm.setData('photo', null),
        });
    };

    const removeGalleryPhoto = (photoId) => {
        if (confirm('Remove this photo from the school profile?')) {
            router.delete(route('principal.school-profile.photos.destroy', photoId), { preserveScroll: true });
        }
    };

    const updateHighlight = (index, value) => {
        const next = [...highlights];
        next[index] = value;
        setData('highlights', next);
    };

    const addHighlight = () => {
        setData('highlights', [...highlights, '']);
    };

    const removeHighlight = (index) => {
        const next = highlights.filter((_, i) => i !== index);
        setData('highlights', next.length ? next : ['']);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Landing Page Settings</h2>}
        >
            <Head title="Landing Page Settings" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">{school.name}</h3>
                                <p className="text-sm text-gray-500">Control what appears on the public school landing page.</p>
                            </div>
                            <SecondaryButton type="button" onClick={() => reset()}>
                                Reset Changes
                            </SecondaryButton>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Hero Section</h4>
                        </div>
                        <div className="grid gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Hero Title</label>
                                    <input
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="Welcome to our school"
                                    />
                                    <InputError message={errors.hero_title} className="mt-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Hero Subtitle</label>
                                    <input
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="A short sentence about your school"
                                    />
                                    <InputError message={errors.hero_subtitle} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Hero Image</label>
                                {landing?.hero_image_url ? (
                                    <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-gray-100">
                                        <img
                                            src={landing.hero_image_url}
                                            alt="Hero"
                                            className="w-full h-56 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('hero')}
                                            className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-white/90 text-red-600 rounded-lg shadow"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">No hero image uploaded yet.</p>
                                )}
                                <form onSubmit={submitHeroImage} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => heroImageForm.setData('photo', e.target.files?.[0] ?? null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                                    />
                                    <SecondaryButton type="submit" disabled={heroImageForm.processing}>
                                        {heroImageForm.processing ? 'Uploading...' : 'Upload Hero Image'}
                                    </SecondaryButton>
                                    {heroImageForm.errors.photo && (
                                        <InputError message={heroImageForm.errors.photo} className="mt-2 sm:mt-0" />
                                    )}
                                </form>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">About Section</h4>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">About Title</label>
                                    <input
                                        value={data.about_title}
                                        onChange={(e) => setData('about_title', e.target.value)}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="About Our School"
                                    />
                                    <InputError message={errors.about_title} className="mt-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">About Text</label>
                                    <textarea
                                        value={data.about_text}
                                        onChange={(e) => setData('about_text', e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="Describe your school in a short paragraph."
                                    />
                                    <InputError message={errors.about_text} className="mt-2" />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">About Image</label>
                                {landing?.about_image_url ? (
                                    <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-gray-100">
                                        <img
                                            src={landing.about_image_url}
                                            alt="About"
                                            className="w-full h-56 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('about')}
                                            className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-white/90 text-red-600 rounded-lg shadow"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">No about image uploaded yet.</p>
                                )}
                                <form onSubmit={submitAboutImage} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => aboutImageForm.setData('photo', e.target.files?.[0] ?? null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                                    />
                                    <SecondaryButton type="submit" disabled={aboutImageForm.processing}>
                                        {aboutImageForm.processing ? 'Uploading...' : 'Upload About Image'}
                                    </SecondaryButton>
                                    {aboutImageForm.errors.photo && (
                                        <InputError message={aboutImageForm.errors.photo} className="mt-2 sm:mt-0" />
                                    )}
                                </form>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Mission & Vision</h4>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Mission</label>
                                    <textarea
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="Your mission statement."
                                    />
                                    <InputError message={errors.mission} className="mt-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Vision</label>
                                    <textarea
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                        placeholder="Your vision statement."
                                    />
                                    <InputError message={errors.vision} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Highlights</h4>
                                    <p className="text-sm text-gray-500">Short bullet points shown on the landing page.</p>
                                </div>
                                <SecondaryButton type="button" onClick={addHighlight}>
                                    Add Highlight
                                </SecondaryButton>
                            </div>
                            <div className="space-y-3">
                                {highlights.map((value, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                                        <input
                                            value={value}
                                            onChange={(e) => updateHighlight(index, e.target.value)}
                                            className="w-full rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                                            placeholder="e.g. Experienced teachers"
                                        />
                                        <SecondaryButton type="button" onClick={() => removeHighlight(index)}>
                                            Remove
                                        </SecondaryButton>
                                    </div>
                                ))}
                                <InputError message={errors.highlights} className="mt-2" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">School Compound Gallery</h4>
                                    <p className="text-sm text-gray-500">These 4 photos appear on the public landing page.</p>
                                </div>
                                <div className="text-xs text-gray-500">{photos.length}/4 photos</div>
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
                                            {photo && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryPhoto(photo.id)}
                                                    className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-white/90 text-red-600 rounded-lg shadow"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={submitGalleryPhoto} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => galleryForm.setData('photo', e.target.files?.[0] ?? null)}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100"
                                    disabled={photos.length >= 4}
                                />
                                <SecondaryButton type="submit" disabled={galleryForm.processing || photos.length >= 4}>
                                    {galleryForm.processing ? 'Uploading...' : 'Upload Photo'}
                                </SecondaryButton>
                                {galleryForm.errors.photo && (
                                    <InputError message={galleryForm.errors.photo} className="mt-2 sm:mt-0" />
                                )}
                            </form>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => reset()}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
