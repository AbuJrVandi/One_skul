import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function StudentAttendance({ auth, student, attendance, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">My Attendance</h2>}
        >
            <Head title="My Attendance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Present</div>
                            <div className="text-3xl font-black text-green-600">{stats.present}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Absent</div>
                            <div className="text-3xl font-black text-red-500">{stats.absent}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Late</div>
                            <div className="text-3xl font-black text-orange-500">{stats.late}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Attendance Rate</div>
                            <div className="text-3xl font-black text-indigo-600">
                                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">History</h3>
                        {attendance.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-gray-400 font-bold text-lg mb-2">No Attendance Records Yet</p>
                                <p className="text-gray-400 text-sm">Your attendance history will appear here once your teacher starts taking attendance.</p>
                            </div>
                        ) : (
                            <div className="flow-root">
                                <ul role="list" className="-mb-8">
                                    {attendance.map((record, eventIdx) => (
                                        <li key={record.id}>
                                            <div className="relative pb-8">
                                                {eventIdx !== attendance.length - 1 ? (
                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                ) : null}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${record.status === 'present' ? 'bg-green-500' :
                                                            record.status === 'absent' ? 'bg-red-500' :
                                                                record.status === 'late' ? 'bg-orange-500' : 'bg-blue-500'
                                                            }`}>
                                                            {record.status === 'present' && <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                                                            {record.status === 'absent' && <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>}
                                                            {record.status === 'late' && <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-medium">
                                                                Marked <span className="font-bold text-gray-900 capitalize">{record.status}</span>
                                                                {record.remarks && <span className="text-gray-400 italic"> — {record.remarks}</span>}
                                                            </p>
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            <time dateTime={record.date}>{new Date(record.date).toLocaleDateString()}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
