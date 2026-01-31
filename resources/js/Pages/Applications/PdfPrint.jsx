import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function PdfPrint({ school, application }) {
    useEffect(() => {
        // Auto-trigger print dialog
        setTimeout(() => window.print(), 1000);
    }, []);

    const data = application.application_data;

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <Head title={`Application - ${application.application_reference}`} />

            <div className="max-w-3xl mx-auto border rounded-lg p-8 print:border-0 print:mx-0 print:w-full">
                {/* Header */}
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
                            <p className="font-mono text-xl font-bold">{application.application_reference}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase border-b mb-2">Applicant Details</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">Name:</span> <strong>{application.first_name} {application.last_name}</strong></p>
                            <p><span className="text-gray-500 w-24 inline-block">Gender:</span> {data.gender}</p>
                            <p><span className="text-gray-500 w-24 inline-block">DOB:</span> {data.date_of_birth}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Category:</span> {application.class_category.toUpperCase()}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase border-b mb-2">Contact Info</h3>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500 w-24 inline-block">Address:</span> {data.address}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Guardian:</span> {data.guardian_name}</p>
                            <p><span className="text-gray-500 w-24 inline-block">Phone:</span> {data.guardian_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase border-b mb-2">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {application.class_category !== 'primary' && (
                            <>
                                <div><span className="text-gray-500">Previous School:</span> {data.previous_school}</div>
                                {data.bece_index_number && <div><span className="text-gray-500">BECE Index:</span> {data.bece_index_number}</div>}
                                {data.subject_interests && <div><span className="text-gray-500">Interests:</span> {data.subject_interests}</div>}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 mt-12 text-center text-xs text-gray-400">
                    <p>This document acts as proof of application submission.</p>
                    <p className="mt-1">Please retain this reference number for all future correspondence.</p>
                </div>
            </div>
        </div>
    );
}
