import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Classes({ auth, classes }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">My Classes</h2>}
        >
            <Head title="My Classes" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Assigned Classes</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Select a class to manage</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Class</th>
                                        <th className="px-6 py-3 text-left">Level</th>
                                        <th className="px-6 py-3 text-left">Students</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classes.length > 0 ? classes.map((cls) => (
                                        <tr key={cls.id} className="hover:bg-indigo-50/40">
                                            <td className="px-6 py-4 font-bold text-gray-900">{cls.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${cls.level === 'primary' ? 'bg-green-100 text-green-700' :
                                                    cls.level === 'jss' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {cls.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-semibold">
                                                {cls.students_count} Students
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('teacher.class.view', cls.id)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700 hover:bg-indigo-50"
                                                >
                                                    Open
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-bold italic">
                                                No classes assigned yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
