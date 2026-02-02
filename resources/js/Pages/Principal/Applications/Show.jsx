import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Show({ auth, application, classes, credentials }) {
    const [confirmingReject, setConfirmingReject] = useState(false);
    const [confirmingApprove, setConfirmingApprove] = useState(false);

    // Reject Form
    const { data: rejectData, setData: setRejectData, post: postReject, processing: processingReject, errors: errorsReject, reset: resetReject } = useForm({
        rejection_reason: '',
    });

    // Approve Form
    const { data: approveData, setData: setApproveData, post: postApprove, processing: processingApprove, errors: errorsApprove, reset: resetApprove } = useForm({
        school_class_id: '',
    });

    // Approval Handlers
    const confirmApprove = () => setConfirmingApprove(true);

    const approve = (e) => {
        e.preventDefault();
        postApprove(route('principal.applications.approve', application.id), {
            onSuccess: () => setConfirmingApprove(false),
        });
    };

    // Rejection Handlers
    const confirmReject = () => setConfirmingReject(true);

    const reject = (e) => {
        e.preventDefault();
        postReject(route('principal.applications.reject', application.id), {
            onSuccess: () => setConfirmingReject(false),
        });
    };

    const closeRecjectModal = () => {
        setConfirmingReject(false);
        resetReject();
    };

    const closeApproveModal = () => {
        setConfirmingApprove(false);
        resetApprove();
    };

    const data = application.application_data;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Application: <span className="font-mono">{application.application_reference}</span>
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-${application.status_color}-100 text-${application.status_color}-800`}>
                        {application.status}
                    </div>
                </div>
            }
        >
            <Head title={`Application ${application.application_reference}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Credentials Flash */}
                    {credentials && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg leading-6 font-medium text-green-800">Application Approved & Account Created</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p className="mb-2">Please share these credentials with the student immediately. The password will not be shown again.</p>
                                        <div className="bg-white p-4 rounded-lg border border-green-200 inline-block">
                                            <p className="font-mono"><strong>Email:</strong> {credentials.email}</p>
                                            <p className="font-mono"><strong>Password:</strong> {credentials.password}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Applicant Details */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Applicant Information</h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{application.first_name} {application.last_name}</dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.date_of_birth} (Age: {new Date().getFullYear() - new Date(data.date_of_birth).getFullYear()})</dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{data.gender}</dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.address}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Guardian Details */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Guardian Information</h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Guardian Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.guardian_name}</dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.guardian_phone}</dd>
                                        </div>
                                        {data.guardian_email && (
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.guardian_email}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Academic History */}
                            {application.class_category !== 'primary' && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Academic History</h3>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                        <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Previous School</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.previous_school}</dd>
                                            </div>
                                            {data.bece_index_number && (
                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">BECE Index No.</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">{data.bece_index_number}</dd>
                                                </div>
                                            )}
                                            {data.subject_interests && (
                                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Interests</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.subject_interests}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Actions Card */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>

                                {application.status === 'submitted' ? (
                                    <div className="space-y-3">
                                        <PrimaryButton onClick={confirmApprove} className="w-full justify-center">
                                            Approve Application
                                        </PrimaryButton>
                                        <DangerButton onClick={confirmReject} className="w-full justify-center bg-white text-red-600 border border-red-200 hover:bg-red-50">
                                            Reject Application
                                        </DangerButton>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4 italic">
                                        This application has been processed.
                                    </p>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <SecondaryButton onClick={() => window.print()} className="w-full justify-center">
                                        Print Application
                                    </SecondaryButton>
                                    <SecondaryButton onClick={() => window.open(route('public.applications.download', { school: 1, ref: application.application_reference }), '_blank')} className="w-full justify-center mt-3">
                                        Download PDF
                                    </SecondaryButton>
                                </div>
                            </div>

                            {/* Meta Info Card */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Application Meta</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Applied Class:</dt>
                                        <dd className="font-medium text-gray-900">{application.class_level?.toUpperCase()}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Category:</dt>
                                        <dd className="font-medium text-gray-900 capitalize">{application.class_category}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Submitted:</dt>
                                        <dd className="font-medium text-gray-900">{application.submitted_at}</dd>
                                    </div>
                                    {application.reviewed_at && (
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Reviewed:</dt>
                                            <dd className="font-medium text-gray-900">{application.reviewed_at}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <Modal show={confirmingApprove} onClose={closeApproveModal}>
                <form onSubmit={approve} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Approve Application
                    </h2>

                    <div className="mb-4 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                        <p>Approving this application will:</p>
                        <ul className="list-disc ml-5 mt-1 space-y-1">
                            <li>Create a new student account automatically.</li>
                            <li>Generate login credentials for the student.</li>
                            <li>Assign the student to the selected class.</li>
                            <li>Mark the application as Approved.</li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="school_class_id" value="Assign to Class" />
                        <select
                            id="school_class_id"
                            name="school_class_id"
                            value={approveData.school_class_id}
                            onChange={(e) => setApproveData('school_class_id', e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            required
                        >
                            <option value="">Select a Class...</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} {cls.grade_level ? `(${cls.grade_level})` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errorsApprove.school_class_id} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeApproveModal}>Cancel</SecondaryButton>
                        <PrimaryButton disabled={processingApprove}>
                            Confirm Approval
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Reject Modal */}
            <Modal show={confirmingReject} onClose={closeRecjectModal}>
                <form onSubmit={reject} className="p-6">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Reject Application
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Please provide a reason for rejecting this application. This helps maintain records for future reference.
                    </p>

                    <div className="mt-4">
                        <InputLabel htmlFor="rejection_reason" value="Reason for Rejection" />
                        <textarea
                            id="rejection_reason"
                            name="rejection_reason"
                            rows="4"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            value={rejectData.rejection_reason}
                            onChange={(e) => setRejectData('rejection_reason', e.target.value)}
                            placeholder="e.g. Incomplete documentation, Class full..."
                            required
                        />
                        <InputError message={errorsReject.rejection_reason} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeRecjectModal}>Cancel</SecondaryButton>
                        <DangerButton disabled={processingReject}>
                            Reject Application
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
