import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Review({ school, application }) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { post, processing } = useForm({
        terms_accepted: false,
    });

    const submit = (e) => {
        e.preventDefault();
        if (!termsAccepted) return;
        post(route('public.applications.confirm', { school: school.id, ref: application.application_reference }), {
            data: { terms_accepted: termsAccepted }
        });
    };

    const data = application.application_data;

    const InfoRow = ({ label, value, highlight = false }) => (
        <div className={`py-3 px-4 flex justify-between items-start ${highlight ? 'bg-blue-50' : ''}`}>
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <span className={`text-right font-semibold max-w-[60%] ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>
                {value || <span className="text-gray-300 font-normal">—</span>}
            </span>
        </div>
    );

    const Section = ({ title, icon, children }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    {title}
                </h3>
            </div>
            <div className="divide-y divide-gray-100">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
            <Head title="Review Application" />

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{school.name}</h1>
                    <p className="text-amber-100 mt-1">Application Review</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                        <span className="font-mono font-bold">{application.application_reference}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Step 3 of 5</span>
                        <span className="font-medium text-amber-600">Review Your Details</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Warning Banner */}
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex gap-3">
                        <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-amber-800">Please Review Carefully</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                Once you confirm and proceed, you won't be able to edit this information.
                                If you spot any errors, please go back to correct them.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Application Info */}
                    <Section title="Application Details" icon="📋">
                        <InfoRow label="Class Category" value={application.class_category_label} highlight />
                        <InfoRow label="Specific Class" value={application.class_level?.replace('-', ' ').toUpperCase()} highlight />
                        <InfoRow label="Reference Number" value={application.application_reference} />
                    </Section>

                    {/* Student Info */}
                    <Section title="Student Information" icon="👤">
                        <InfoRow label="First Name" value={application.first_name} />
                        <InfoRow label="Last Name" value={application.last_name} />
                        <InfoRow label="Date of Birth" value={new Date(data.date_of_birth).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })} />
                        <InfoRow label="Gender" value={data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1)} />
                        {application.email && <InfoRow label="Email" value={application.email} />}
                        <InfoRow label="Address" value={data.address} />
                    </Section>

                    {/* Guardian Info */}
                    <Section title="Guardian Information" icon="👨‍👩‍👧">
                        <InfoRow label="Guardian Name" value={data.guardian_name} />
                        <InfoRow label="Phone Number" value={data.guardian_phone} />
                        {data.guardian_email && <InfoRow label="Email" value={data.guardian_email} />}
                    </Section>

                    {/* Academic Info (if applicable) */}
                    {application.class_category !== 'primary' && (
                        <Section title="Academic Background" icon="📚">
                            <InfoRow label="Previous School" value={data.previous_school} />
                            {data.bece_index_number && <InfoRow label="BECE Index Number" value={data.bece_index_number} />}
                            {data.subject_interests && <InfoRow label="Subject Interests" value={data.subject_interests} />}
                            {data.primary_school && <InfoRow label="Primary School" value={data.primary_school} />}
                        </Section>
                    )}

                    {/* Terms & Confirmation */}
                    <form onSubmit={submit}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>

                            <div className="p-4 bg-gray-50 rounded-xl mb-6 text-sm text-gray-600 max-h-40 overflow-y-auto">
                                <p className="mb-3">By submitting this application, I confirm that:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>All information provided in this application is true, accurate, and complete to the best of my knowledge.</li>
                                    <li>I understand that false information may result in the rejection of this application or dismissal from the school.</li>
                                    <li>I consent to the school processing and storing my personal data for admission purposes.</li>
                                    <li>I agree to abide by the school's rules and regulations if admitted.</li>
                                    <li>I understand that submitting this application does not guarantee admission.</li>
                                </ul>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700 group-hover:text-gray-900">
                                    I have read and agree to the above terms and conditions. I confirm that all information provided is accurate.
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                            <Link
                                href={route('public.applications.form', {
                                    school: school.id,
                                    category: application.class_category,
                                    class: application.class_level
                                })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Go Back & Edit
                            </Link>

                            <button
                                type="submit"
                                disabled={!termsAccepted || processing}
                                className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${termsAccepted
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm & Proceed to Payment
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
