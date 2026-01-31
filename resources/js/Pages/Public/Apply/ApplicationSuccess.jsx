import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ApplicationSuccess({ application }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <Head title="Application Submitted" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-green-500">
                    <div className="text-center mb-6">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <span className="text-3xl">🎉</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900">Application Submitted!</h2>
                        <p className="mt-2 text-sm text-gray-600">Your application to <span className="font-bold text-indigo-600">{application.school.name}</span> has been received.</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                        <div className="mb-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Application PIN</p>
                            <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">{application.application_code}</p>
                            <p className="text-xs text-gray-500 mt-1">Keep this safe for tracking status.</p>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Applicant:</span>
                                <span className="font-medium">{application.first_name} {application.last_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Grade:</span>
                                <span className="font-medium">{application.grade_applying_for}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-medium">{new Date(application.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handlePrint}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Download Application PDF
                        </button>

                        <Link href="/" className="block text-center text-sm text-indigo-600 hover:text-indigo-500">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
