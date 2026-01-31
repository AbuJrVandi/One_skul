import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, student, school, class: schoolClass, notices }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Student Portal</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    {/* ... existing welcome ... */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black mb-2">Hello, {student?.first_name}!</h1>
                            <p className="text-indigo-100 text-lg opacity-90 font-medium">
                                Welcome to your academic dashboard at {school?.name}.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-sm font-bold">
                                    Class: {schoolClass?.name || 'Not assigned'}
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-sm font-bold">
                                    ID: {student?.index_number}
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Status Cards */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 self-start">
                            {/* Report Cards Card */}
                            <Link
                                href={route('student.grades')}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">My Results</h3>
                                <p className="text-gray-500 text-sm mb-4">View and download your termly report cards and subject grades.</p>
                                <span className="text-emerald-600 font-bold text-sm">View Report Cards &rarr;</span>
                            </Link>

                            {/* Attendance Card */}
                            <Link
                                href={route('student.attendance')}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">Attendance</h3>
                                <p className="text-gray-500 text-sm mb-4">Track your daily class attendance and participation records.</p>
                                <span className="text-blue-600 font-bold text-sm">Check History &rarr;</span>
                            </Link>

                            {/* Profile Card */}
                            <Link
                                href={route('profile.edit')}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">My Profile</h3>
                                <p className="text-gray-500 text-sm mb-4">Update your personal information and change your password.</p>
                                <span className="text-indigo-600 font-bold text-sm">Edit Profile &rarr;</span>
                            </Link>
                        </div>

                        {/* Recent Notices */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                School News
                            </h3>
                            <div className="space-y-4">
                                {notices.length > 0 ? notices.map((notice) => (
                                    <div key={notice.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400">{new Date(notice.created_at).toLocaleDateString()}</span>
                                        <h4 className="font-black text-gray-900 mt-1 mb-2">{notice.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notice.content}</p>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center opacity-30 italic font-bold bg-white rounded-3xl border border-gray-100">
                                        No notices for today.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
