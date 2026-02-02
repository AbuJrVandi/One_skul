import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Profile({ auth, student }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        address: student.address || '',
        emergency_contact: student.emergency_contact || '',
    });

    const photoForm = useForm({
        photo: null,
    });

    const [photoPreview, setPhotoPreview] = useState(student.photo_url);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Update preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Submit using transform to ensure the file is included regardless of state update timing
            photoForm.transform((data) => ({
                ...data,
                photo: file,
            })).post(route('student.profile.photo'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by global flash message
                }
            });
        }
    };

    const handleRemovePhoto = () => {
        if (confirm('Are you sure you want to remove your profile photo?')) {
            photoForm.delete(route('student.profile.photo.remove'), {
                onSuccess: () => {
                    setPhotoPreview(null);
                }
            });
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        post(route('student.profile.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-exrabold text-2xl text-gray-800 leading-tight">
                    My Profile
                </h2>
            }
        >
            <Head title="My Profile" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Profile Header / Photo Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-4xl font-black text-indigo-200">
                                            {student.first_name?.[0]}{student.last_name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-3xl cursor-pointer">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
                                    <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                                </label>
                                {student.profile_photo_path && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                        title="Remove Photo"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                {photoForm.errors.photo && (
                                    <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg inline-block">
                                        <p className="text-red-600 text-xs font-bold flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {photoForm.errors.photo}
                                        </p>
                                    </div>
                                )}
                                <h3 className="text-2xl font-black text-gray-900">{student.first_name} {student.last_name}</h3>
                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">
                                    {student.school_class?.name || 'Class Not Assigned'} &bull; {student.index_number}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">Student Account</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">{student.school?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Info Form */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
                            <form onSubmit={submitProfile} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium py-3 px-4"
                                        />
                                        {errors.first_name && <p className="text-red-500 text-xs mt-2 px-1">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium py-3 px-4"
                                        />
                                        {errors.last_name && <p className="text-red-500 text-xs mt-2 px-1">{errors.last_name}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Residential Address</label>
                                        <textarea
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            rows="3"
                                            className="w-full bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium py-3 px-4"
                                            placeholder="Enter your current home address"
                                        ></textarea>
                                        {errors.address && <p className="text-red-500 text-xs mt-2 px-1">{errors.address}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Emergency Contact Info</label>
                                        <input
                                            type="text"
                                            value={data.emergency_contact}
                                            onChange={e => setData('emergency_contact', e.target.value)}
                                            className="w-full bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium py-3 px-4"
                                            placeholder="e.g. Parent Name - 08012345678"
                                        />
                                        {errors.emergency_contact && <p className="text-red-500 text-xs mt-2 px-1">{errors.emergency_contact}</p>}
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving Changes...' : 'Save Profile Information'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Read-only Academic Details */}
                        <div className="bg-gray-900 rounded-[2rem] p-10 shadow-xl text-white">
                            <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                Academic Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 opacity-90">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Index Number</p>
                                    <p className="text-lg font-bold">{student.index_number}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Current Class</p>
                                    <p className="text-lg font-bold">{student.school_class?.name || 'Unassigned'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Date of Birth</p>
                                    <p className="text-lg font-bold">{new Date(student.date_of_birth).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs italic text-indigo-200">
                                Note: Academic details can only be modified by the school administration. Please contact the Principal if there's an error in your records.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
