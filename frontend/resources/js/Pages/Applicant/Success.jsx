import { Head, Link } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';

export default function Success({ school, application }) {
    return (
        <ApplicantLayout title="Application Submitted">
            <Head title="Application Submitted" />

            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Application Received</h2>
                <p className="text-slate-500 mt-2">Your application has been submitted to {school.name}.</p>

                <div className="mt-6 inline-flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl text-indigo-700 font-mono text-lg">
                    {application.reference}
                </div>

                <p className="text-sm text-slate-500 mt-4">Status: <span className="font-semibold capitalize">{application.status === 'submitted' ? 'pending' : application.status}</span></p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link href={route('applicant.dashboard')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
                        Go to Dashboard
                    </Link>
                    <Link href={route('applicant.schools.index')} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold">
                        Apply to Another School
                    </Link>
                </div>
            </div>
        </ApplicantLayout>
    );
}
