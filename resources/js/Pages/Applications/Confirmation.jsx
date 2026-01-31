import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Confirmation({ school, application }) {
    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
            <Head title="Application Submitted" />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-500 mb-8">Your application has been successfully submitted to {school.name}.</p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <div className="flex justify-between mb-4">
                        <span className="text-sm text-gray-500">Application Reference:</span>
                        <span className="font-mono font-bold text-gray-900">{application.application_reference}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            PENDING REVIEW
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date Submitted:</span>
                        <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <a
                        href={route('public.applications.download', { school: school.id, ref: application.application_reference })}
                        target="_blank"
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Application PDF
                    </a>

                    <Link
                        href={route('public.applications.start', school.id)}
                        className="block text-sm text-gray-500 hover:text-gray-900"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
