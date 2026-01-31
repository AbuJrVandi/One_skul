import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react'; // Import useForm correctly from @inertiajs/react
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

export default function Show({ auth, application }) {
    const [confirmingReject, setConfirmingReject] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    const approve = () => {
        if (confirm('Are you sure you want to approve this application? A student account will be created.')) {
            router.post(route('principal.applications.approve', application.id));
        }
    };

    const confirmReject = () => {
        setConfirmingReject(true);
    };

    const reject = (e) => {
        e.preventDefault();
        post(route('principal.applications.reject', application.id), {
            onSuccess: () => setConfirmingReject(false),
        });
    };

    const closeModal = () => {
        setConfirmingReject(false);
        reset();
    };

    const downloadPdf = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Application Details: {application.application_code}</h2>}
        >
            <Head title={`Application ${application.application_code}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Applicant Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal, Academic, and Guardian details.</p>
                            </div>
                            <div className="flex space-x-3">
                                <SecondaryButton onClick={downloadPdf}>Download PDF</SecondaryButton>
                                {application.status === 'pending' && (
                                    <>
                                        <DangerButton onClick={confirmReject}>Reject</DangerButton>
                                        <PrimaryButton onClick={approve}>Approve</PrimaryButton>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                {/* Status */}
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize font-bold">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                application.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {application.status}
                                        </span>
                                    </dd>
                                </div>
                                {/* Student Info */}
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{application.first_name} {application.last_name}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Applied Grade</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{application.grade_applying_for}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(application.date_of_birth).toLocaleDateString()}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Contacts</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        Email: {application.email}<br />
                                        Phone: {application.phone}
                                    </dd>
                                </div>
                                {/* Address */}
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{application.address}</dd>
                                </div>

                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Guardian</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        Name: {application.guardian_name}<br />
                                        Phone: {application.guardian_phone}<br />
                                        Email: {application.guardian_email || 'N/A'}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                    <dt className="text-sm font-medium text-gray-500">Previous School</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{application.previous_school || 'N/A'}</dd>
                                </div>

                                {application.status === 'rejected' && (
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-red-50">
                                        <dt className="text-sm font-medium text-red-800">Rejection Reason</dt>
                                        <dd className="mt-1 text-sm text-red-900 sm:mt-0 sm:col-span-2">{application.rejection_reason}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal show={confirmingReject} onClose={closeModal}>
                <form onSubmit={reject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Reject Application
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Please provide a reason for rejecting this application. This will be visible to the admin.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="reason" value="Reason" className="sr-only" />

                        <textarea
                            id="reason"
                            name="reason"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows="4"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Reason for rejection..."
                        />

                        <InputError message={errors.reason} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Reject Application
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
