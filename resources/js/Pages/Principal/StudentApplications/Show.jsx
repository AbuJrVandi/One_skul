import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Show({ auth, application, classes }) {
    const { data, setData, post, processing, errors } = useForm({
        school_class_id: '',
        rejection_reason: '',
    });

    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);

    const handleApprove = (e) => {
        e.preventDefault();
        post(route('principal.applications.approve', application.id), {
            onSuccess: () => setShowApprove(false)
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(route('principal.applications.reject', application.id), {
            onSuccess: () => setShowReject(false)
        });
    };

    const appData = application.application_data;

    // Filter classes based on category to help Principal
    // (Assuming school classes have a 'level' or similar, simplified here)
    const filteredClasses = classes;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Review Application: {application.application_reference}</h2>}
        >
            <Head title="Application Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Flash Message for Generated Credentials */}
                    {/* (Handled globally usually, but local check here) */}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold">{application.first_name} {application.last_name}</h3>
                                    <p className="text-gray-500">Applied for: <span className="uppercase font-bold">{application.class_category}</span></p>
                                </div>
                                <div>
                                    <span className={`px-4 py-2 text-sm font-bold rounded-full 
                            ${application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {application.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-bold border-b pb-2 mb-4">Applicant Data</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500 w-32 inline-block">DOB:</span> {appData.date_of_birth}</p>
                                        <p><span className="text-gray-500 w-32 inline-block">Gender:</span> {appData.gender}</p>
                                        <p><span className="text-gray-500 w-32 inline-block">Address:</span> {appData.address}</p>
                                        <p><span className="text-gray-500 w-32 inline-block">Email:</span> {application.email || '-'}</p>
                                        <p><span className="text-gray-500 w-32 inline-block">Phone:</span> {appData.phone}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-bold border-b pb-2 mb-4">Guardian Info</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500 w-32 inline-block">Name:</span> {appData.guardian_name}</p>
                                        <p><span className="text-gray-500 w-32 inline-block">Phone:</span> {appData.guardian_phone}</p>
                                    </div>

                                    {application.class_category !== 'primary' && (
                                        <div className="mt-8">
                                            <h4 className="font-bold border-b pb-2 mb-4">Academics</h4>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="text-gray-500 w-32 inline-block">Previous School:</span> {appData.previous_school}</p>
                                                <p><span className="text-gray-500 w-32 inline-block">BECE:</span> {appData.bece_index_number || '-'}</p>
                                                <p><span className="text-gray-500 w-32 inline-block">Interests:</span> {appData.subject_interests || '-'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {application.status === 'submitted' && (
                                <div className="mt-8 flex gap-4 border-t pt-6">
                                    <button
                                        onClick={() => setShowApprove(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow font-bold"
                                    >
                                        Approve & Admit
                                    </button>
                                    <button
                                        onClick={() => setShowReject(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow font-bold"
                                    >
                                        Reject Application
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            {showApprove && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Admit Student</h3>
                        <p className="text-sm text-gray-500 mb-6">Assign the student to a class to create their account and generate login credentials.</p>

                        <form onSubmit={handleApprove}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Assign Class</label>
                                <select
                                    value={data.school_class_id}
                                    onChange={e => setData('school_class_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a class...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowApprove(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Confirm Admission</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showReject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-red-600">Reject Application</h3>

                        <form onSubmit={handleReject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Reason for Rejection</label>
                                <textarea
                                    value={data.rejection_reason}
                                    onChange={e => setData('rejection_reason', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowReject(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" disabled={processing} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirm Rejection</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
