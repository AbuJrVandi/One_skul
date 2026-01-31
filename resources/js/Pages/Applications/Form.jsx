import { useForm, Head } from '@inertiajs/react';
import React from 'react';

export default function Form({ school, category }) {
    const { data, setData, post, processing, errors } = useForm({
        class_category: category,
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        // Conditional fields
        email: '', // Required for SSS/JSS
        previous_school: '', // Required for SSS/JSS
        bece_index_number: '', // SSS only
        subject_interests: '', // SSS only
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('public.applications.store', school.id));
    };

    const isPrimary = category === 'primary';
    const isSSS = category === 'sss';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Application Form" />

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-900 py-6 px-8">
                    <h2 className="text-2xl font-bold text-white">Student Application Form</h2>
                    <p className="text-blue-200 mt-1 uppercase tracking-wide text-sm font-semibold">{category.toUpperCase()} Level</p>
                </div>

                <form onSubmit={submit} className="py-6 px-8 space-y-6">

                    {/* Section 1: Student Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Student Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                {errors.first_name && <div className="text-red-500 text-xs mt-1">{errors.first_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                {errors.last_name && <div className="text-red-500 text-xs mt-1">{errors.last_name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                {errors.date_of_birth && <div className="text-red-500 text-xs mt-1">{errors.date_of_birth}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <select value={data.gender} onChange={e => setData('gender', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        {!isPrimary && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Student Email (Optional)</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>
                        )}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Home Address</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} rows="2"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                        </div>
                    </div>

                    {/* Section 2: Guardian Info */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Guardian / Parent Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                                <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                                <input type="tel" value={data.guardian_phone} onChange={e => setData('guardian_phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Academic History (Conditional) */}
                    {!isPrimary && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Academic Background</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Previous School Attended</label>
                                <input type="text" value={data.previous_school} onChange={e => setData('previous_school', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                {errors.previous_school && <div className="text-red-500 text-xs mt-1">{errors.previous_school}</div>}
                            </div>

                            {isSSS && (
                                <>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">BECE Index Number</label>
                                        <input type="text" value={data.bece_index_number} onChange={e => setData('bece_index_number', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                        {errors.bece_index_number && <div className="text-red-500 text-xs mt-1">{errors.bece_index_number}</div>}
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">Subject Area Interests (e.g. Science, Arts)</label>
                                        <input type="text" value={data.subject_interests} onChange={e => setData('subject_interests', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className="pt-4 flex justify-between">
                        <button type="button" onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900 font-medium">Back</button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Start Application Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
