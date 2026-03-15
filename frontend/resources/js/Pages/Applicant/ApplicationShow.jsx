import { Head, Link } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';

export default function ApplicationShow({ school, application, documents, decisionDocuments = [] }) {
    const data = application.application_data || {};
    const statusLabel = application.status === 'submitted' ? 'pending' : application.status;

    return (
        <ApplicantLayout title="My Application">
            <Head title={`Application ${application.reference}`} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">School</p>
                    <h2 className="text-xl font-bold text-slate-900">{school.name}</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-slate-400">Status</p>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">
                        {statusLabel}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">Reference</p>
                        <p className="font-mono text-lg font-semibold text-slate-900">{application.reference}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                        Submitted: {application.submitted_at || '—'}
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={route('applicant.applications.print', { school: school.slug, application: application.id })}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
                        >
                            Print
                        </a>
                        <Link
                            href={route('applicant.dashboard')}
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Student Information</p>
                        <p><span className="font-semibold">Full Name:</span> {data.student_full_name || '—'}</p>
                        <p><span className="font-semibold">Gender:</span> {data.gender || '—'}</p>
                        <p><span className="font-semibold">Date of Birth:</span> {data.date_of_birth || '—'}</p>
                        <p><span className="font-semibold">Place of Birth:</span> {data.place_of_birth || '—'}</p>
                        <p><span className="font-semibold">Nationality:</span> {data.nationality || '—'}</p>
                        <p><span className="font-semibold">District:</span> {data.district || '—'}</p>
                        <p><span className="font-semibold">Address:</span> {data.address || '—'}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Class</p>
                        <p><span className="font-semibold">Category:</span> {application.class_category}</p>
                        <p><span className="font-semibold">Class Level:</span> {application.class_level || '—'}</p>
                        <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">Previous School</p>
                        <p><span className="font-semibold">Name:</span> {data.previous_school_name || '—'}</p>
                        <p><span className="font-semibold">Last Class:</span> {data.previous_school_last_class || '—'}</p>
                        <p><span className="font-semibold">Year Completed:</span> {data.previous_school_year_completed || '—'}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Guardian Information</p>
                        <p><span className="font-semibold">Name:</span> {data.guardian_name || '—'}</p>
                        <p><span className="font-semibold">Occupation:</span> {data.guardian_occupation || '—'}</p>
                        <p><span className="font-semibold">Phone:</span> {data.guardian_phone || '—'}</p>
                        <p><span className="font-semibold">Email:</span> {data.guardian_email || '—'}</p>
                        <p><span className="font-semibold">Address:</span> {data.guardian_address || '—'}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Documents</p>
                        {documents.length === 0 && <p>—</p>}
                        {documents.map((doc) => (
                            <a
                                key={doc.id}
                                href={route('applicant.applications.documents.show', {
                                    school: school.slug,
                                    application: application.id,
                                    document: doc.id,
                                })}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-indigo-600 hover:text-indigo-800"
                            >
                                {doc.type.replace('_', ' ')}
                            </a>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Decision Documents</p>
                        {decisionDocuments.length === 0 && <p>—</p>}
                        {decisionDocuments.map((doc) => (
                            <a
                                key={doc.id}
                                href={route('applicant.applications.decision-documents.show', {
                                    school: school.slug,
                                    application: application.id,
                                    document: doc.id,
                                })}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-indigo-600 hover:text-indigo-800"
                            >
                                {doc.decision === 'accepted' ? 'Admission Letter' : 'Application Decision'}
                                {doc.generated_at ? ` (${doc.generated_at})` : ''}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </ApplicantLayout>
    );
}
