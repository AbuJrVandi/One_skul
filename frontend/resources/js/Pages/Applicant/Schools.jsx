import { Head, Link } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';

export default function Schools({ schools }) {
    return (
        <ApplicantLayout title="Apply to a School">
            <Head title="Select School" />

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <table className="min-w-full text-sm">
                    <thead className="text-left text-xs uppercase text-slate-400">
                        <tr>
                            <th className="py-2">School Name</th>
                            <th>District</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {schools.map((school) => (
                            <tr key={school.id}>
                                <td className="py-3 font-semibold text-slate-900">{school.name}</td>
                                <td className="text-slate-600">{school.district?.name}</td>
                                <td className="text-right">
                                    <Link
                                        href={route('applicant.applications.create', school.slug || school.id)}
                                        className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest"
                                    >
                                        Apply
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ApplicantLayout>
    );
}
