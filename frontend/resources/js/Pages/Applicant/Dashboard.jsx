import { Head, Link } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';

export default function Dashboard({ stats, applications }) {
    return (
        <ApplicantLayout title="Applicant Dashboard">
            <Head title="Applicant Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applications', value: stats.total },
                    { label: 'Pending', value: stats.pending },
                    { label: 'Accepted', value: stats.accepted },
                    { label: 'Rejected', value: stats.rejected },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{card.label}</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900">My Applications</h2>
                    <Link href={route('applicant.schools.index')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        Apply to a School
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <div className="text-sm text-slate-500">No applications yet.</div>
                ) : (
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="py-2">School</th>
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Decision Letter</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.map((app) => (
                                    <tr key={`${app.school.slug}-${app.id}`} className="hover:bg-slate-50">
                                        <td className="py-3 font-semibold text-slate-900">{app.school.name}</td>
                                        <td className="text-slate-600">{app.class_level}</td>
                                        <td className="text-slate-600 capitalize">{app.status === 'submitted' ? 'pending' : app.status}</td>
                                        <td className="text-slate-500">{app.submitted_at || '—'}</td>
                                        <td>
                                            {app.decision_document ? (
                                                <a
                                                    href={route('applicant.applications.decision-documents.show', {
                                                        school: app.school.slug,
                                                        application: app.id,
                                                        document: app.decision_document.id,
                                                    })}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center rounded-lg border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
                                                >
                                                    {app.decision_document.decision === 'accepted' ? 'Admission Letter' : 'Decision Letter'}
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={route('applicant.applications.show', { school: app.school.slug, application: app.id })}
                                                    className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                >
                                                    View
                                                </a>
                                                {app.id && (
                                                    <a
                                                        href={route('applicant.applications.print', { school: app.school.slug, application: app.id })}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
                                                    >
                                                        Print
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ApplicantLayout>
    );
}
