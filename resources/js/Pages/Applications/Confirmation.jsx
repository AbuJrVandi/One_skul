import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Confirmation({ school, application }) {
    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
            <Head title="Application Submitted" />

            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Confetti / Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

                <div className="p-10 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 mb-8 animate-[bounce_1s_ease-out_1]">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Received!</h2>
                    <p className="text-gray-500 text-lg mb-8">
                        Thank you for applying to <br />
                        <span className="font-semibold text-gray-700">{school.name}</span>
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Reference No.</span>
                            <span className="font-mono text-xl font-bold text-blue-600 tracking-wider copy-all">
                                {application.application_reference}
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Applicant</span>
                                <span className="text-sm font-medium text-gray-900">{application.first_name} {application.last_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Class Applied</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                    {application.class_level?.replace('-', ' ') || application.class_category}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Submitted On</span>
                                <span className="text-sm text-gray-900">{application.submitted_at}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Status</span>
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-800 uppercase tracking-wide">
                                    PENDING REVIEW
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        We have sent a confirmation email to <span className="font-medium text-gray-900">{application.application_data?.email || application.application_data?.guardian_email}</span>.
                    </p>

                    <div className="space-y-4">
                        <a
                            href={route('public.applications.download', { school: school.id, ref: application.application_reference })}
                            target="_blank"
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl shadow-lg shadow-blue-500/20 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Application PDF
                        </a>

                        <Link
                            href={route('public.applications.start', school.id)}
                            className="block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
