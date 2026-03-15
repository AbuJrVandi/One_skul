import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Review({ school, form, files }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        confirm: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.applications.store', school.slug || school.id));
    };

    return (
        <ApplicantLayout title="Review Application">
            <Head title={`Review Application - ${school.name}`} />

            {flash?.error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {flash.error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-8">
                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Review Application</h2>
                        <Link
                            href={route('applicant.applications.create', school.slug || school.id)}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            Edit Details
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Student Information</p>
                            <p><span className="font-semibold">Full Name:</span> {form.student_full_name || '—'}</p>
                            <p><span className="font-semibold">Gender:</span> {form.gender || '—'}</p>
                            <p><span className="font-semibold">Date of Birth:</span> {form.date_of_birth || '—'}</p>
                            <p><span className="font-semibold">Place of Birth:</span> {form.place_of_birth || '—'}</p>
                            <p><span className="font-semibold">Nationality:</span> {form.nationality || '—'}</p>
                            <p><span className="font-semibold">District:</span> {form.district || '—'}</p>
                            <p><span className="font-semibold">Address:</span> {form.address || '—'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Class & School</p>
                            <p><span className="font-semibold">School:</span> {school.name}</p>
                            <p><span className="font-semibold">Category:</span> {form.class_category}</p>
                            <p><span className="font-semibold">Class:</span> {form.class_level || '—'}</p>
                            <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">Previous School</p>
                            <p><span className="font-semibold">School Name:</span> {form.previous_school_name || '—'}</p>
                            <p><span className="font-semibold">Last Class:</span> {form.previous_school_last_class || '—'}</p>
                            <p><span className="font-semibold">Year Completed:</span> {form.previous_school_year_completed || '—'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Guardian Information</p>
                            <p><span className="font-semibold">Name:</span> {form.guardian_name || '—'}</p>
                            <p><span className="font-semibold">Occupation:</span> {form.guardian_occupation || '—'}</p>
                            <p><span className="font-semibold">Phone:</span> {form.guardian_phone || '—'}</p>
                            <p><span className="font-semibold">Email:</span> {form.guardian_email || '—'}</p>
                            <p><span className="font-semibold">Address:</span> {form.guardian_address || '—'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-widest text-slate-400">Documents</p>
                            {files.length === 0 && <p>—</p>}
                            {files.map((file) => (
                                <p key={file.type}>
                                    <span className="font-semibold">{file.type.replace('_', ' ')}:</span> {file.name}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6">
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                        <input type="checkbox" checked={data.confirm} onChange={(e) => setData('confirm', e.target.checked)} />
                        <span>I confirm the information provided is correct.</span>
                    </label>
                    <InputError message={errors.confirm} className="mt-2" />
                </section>

                <div className="flex justify-between">
                    <Link
                        href={route('applicant.applications.create', school.slug || school.id)}
                        className="text-sm font-semibold text-slate-600 hover:text-slate-800"
                    >
                        Back to Form
                    </Link>
                    <PrimaryButton className="justify-center" disabled={processing}>
                        Submit Application
                    </PrimaryButton>
                </div>
            </form>
        </ApplicantLayout>
    );
}
