import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentProfile({ auth, student }) {
    const dob = student.date_of_birth ? new Date(student.date_of_birth) : null;
    const age = dob && !Number.isNaN(dob.getTime())
        ? new Date().getFullYear() - dob.getFullYear()
        : null;
    const photoUrl = student.photo_url
        ? `${student.photo_url}${student.updated_at ? `?v=${encodeURIComponent(student.updated_at)}` : ''}`
        : null;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Student Profile</h2>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">
                            {student.school_class?.name || 'Class'} • {student.index_number}
                        </p>
                    </div>
                    <Link
                        href={route('teacher.class.view', student.school_class_id)}
                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-indigo-600"
                    >
                        Back to Class
                    </Link>
                </div>
            }
        >
            <Head title={`${student.first_name} ${student.last_name}`} />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl font-black overflow-hidden">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={`${student.first_name} ${student.last_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    student.first_name?.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{student.first_name} {student.last_name}</h3>
                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                                    {student.school_class?.name || 'Class'} • {student.index_number}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3 text-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Basic Info</h4>
                            <p><span className="font-semibold">Gender:</span> {student.gender || '—'}</p>
                            <p><span className="font-semibold">Date of Birth:</span> {student.date_of_birth || '—'} {age !== null && <span className="text-gray-400">({age} yrs)</span>}</p>
                            <p><span className="font-semibold">Grade Level:</span> {student.grade_level || '—'}</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3 text-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Contacts</h4>
                            <p><span className="font-semibold">Address:</span> {student.address || '—'}</p>
                            <p><span className="font-semibold">Emergency Contact:</span> {student.emergency_contact || '—'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
