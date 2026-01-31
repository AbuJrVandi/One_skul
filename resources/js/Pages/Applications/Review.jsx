import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Review({ school, application }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route('public.applications.confirm', { school: school.id, ref: application.application_reference }));
    };

    const data = application.application_data;

    const InfoRow = ({ label, value }) => (
        <div className="py-3 flex justify-between border-b border-gray-100 last:border-0">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-900 font-semibold text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Review Application" />

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-yellow-500 py-4 px-8 text-white flex justify-between items-center">
                        <h2 className="text-xl font-bold">Review Your Details</h2>
                        <span className="bg-white/20 px-3 py-1 rounded text-sm">Step 3 of 5</span>
                    </div>

                    <div className="p-8">
                        <p className="text-gray-600 mb-6 text-sm">
                            Please carefully review all information below. Once you proceed to payment, you cannot edit these details.
                        </p>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide text-xs">Student Information</h3>
                            <div className="bg-gray-50 rounded p-4">
                                <InfoRow label="First Name" value={application.first_name} />
                                <InfoRow label="Last Name" value={application.last_name} />
                                <InfoRow label="Date of Birth" value={data.date_of_birth} />
                                <InfoRow label="Gender" value={data.gender} />
                                <InfoRow label="Class Category" value={application.class_category.toUpperCase()} />
                                <InfoRow label="Email" value={application.email} />
                                <InfoRow label="Phone" value={data.phone} />
                                <InfoRow label="Address" value={data.address} />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide text-xs">Guardian Information</h3>
                            <div className="bg-gray-50 rounded p-4">
                                <InfoRow label="Guardian Name" value={data.guardian_name} />
                                <InfoRow label="Guardian Phone" value={data.guardian_phone} />
                            </div>
                        </div>

                        {application.class_category !== 'primary' && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide text-xs">Academic History</h3>
                                <div className="bg-gray-50 rounded p-4">
                                    <InfoRow label="Previous School" value={data.previous_school} />
                                    {application.class_category === 'sss' && (
                                        <>
                                            <InfoRow label="BECE Index" value={data.bece_index_number} />
                                            <InfoRow label="Interests" value={data.subject_interests} />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-8 border-t pt-6">
                            <div className="flex items-center mb-6">
                                <input id="terms" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                    I declare that the information provided is true and correct. I accept the school's terms and conditions.
                                </label>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs text-red-500">* Confirming locks your application.</span>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-3 px-8 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Confirm & Proceed
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
