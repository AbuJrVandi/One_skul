import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ApplicationPrint({ school, application }) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 800);
        return () => clearTimeout(timer);
    }, []);

    const data = application.application_data || {};

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <Head title={`Application - ${application.reference}`} />

            <div className="max-w-3xl mx-auto border rounded-lg p-8 print:border-0 print:mx-0 print:w-full">
                <div className="border-b pb-6 mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold uppercase">{school.name}</h1>
                        <p className="text-sm text-gray-500">Student Admission Application</p>
                        <div className="mt-2 text-xs text-gray-400">
                            Generated: {new Date().toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-gray-100 p-2 rounded">
                            <p className="text-xs uppercase text-gray-500">Reference No.</p>
                            <p className="font-mono text-xl font-bold">{application.reference}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase border-b mb-2">Applicant Details</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">Name:</span> <strong>{application.first_name} {application.last_name}</strong></p>
                            <p><span className="text-gray-500 w-24 inline-block">Gender:</span> {data.gender || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">DOB:</span> {data.date_of_birth || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Nationality:</span> {data.nationality || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">District:</span> {data.district || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Category:</span> {application.class_category?.toUpperCase()}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Class:</span> {application.class_level || '—'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase border-b mb-2">Contact Info</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">Address:</span> {data.address || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Guardian:</span> {data.guardian_name || '—'}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Phone:</span> {data.guardian_phone || '—'}</p>
                            {data.guardian_email && (
                                <p><span className="text-gray-500 w-24 inline-block">Email:</span> {data.guardian_email}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase border-b mb-2">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Previous School:</span> {data.previous_school_name || '—'}</div>
                        <div><span className="text-gray-500">Last Class:</span> {data.previous_school_last_class || '—'}</div>
                        <div><span className="text-gray-500">Year Completed:</span> {data.previous_school_year_completed || '—'}</div>
                    </div>
                </div>

                <div className="border-t pt-6 mt-12 text-center text-xs text-gray-400">
                    <p>This document acts as proof of application submission.</p>
                    <p className="mt-1">Please retain this reference number for all future correspondence.</p>
                </div>
            </div>
        </div>
    );
}
