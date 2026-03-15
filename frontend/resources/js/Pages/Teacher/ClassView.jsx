import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ClassView({ auth, schoolClass, students }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">{schoolClass.name} Registry</h2>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Class Management Workspace</p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={route('teacher.class.attendance.index', schoolClass.id)}
                            className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-purple-100 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Attendance
                        </a>
                        <a
                            href={route('teacher.class.grades.index', schoolClass.id)}
                            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                            Grades
                        </a>
                    </div>
                </div>
            }
        >
            <Head title={schoolClass.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-xs font-bold uppercase tracking-widest text-indigo-700">
                        Student enrollment is managed by the Principal.
                    </div>

                    {/* Students Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Number</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {students.length > 0 ? students.map((s) => {
                                    const photoUrl = s.photo_url
                                        ? `${s.photo_url}${s.updated_at ? `?v=${encodeURIComponent(s.updated_at)}` : ''}`
                                        : null;

                                    return (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold mr-3 overflow-hidden">
                                                    {photoUrl ? (
                                                        <img
                                                            src={photoUrl}
                                                            alt={`${s.first_name} ${s.last_name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        s.first_name.charAt(0)
                                                    )}
                                                </div>
                                                <div className="text-xs font-bold text-gray-900">{s.first_name} {s.last_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-indigo-600 font-mono italic">{s.index_number}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-[10px] font-black uppercase text-gray-400">{s.gender}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                            {Math.floor((new Date() - new Date(s.date_of_birth)) / 31557600000)} Years
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <Link
                                                href={route('teacher.students.show', s.id)}
                                                className="text-indigo-600 hover:text-indigo-900 font-bold text-xs uppercase tracking-widest"
                                            >
                                                Profile
                                            </Link>
                                        </td>
                                    </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">This class is currently empty.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
