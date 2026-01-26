import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, school, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.portal.index')}
                        className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">
                            {school.name}
                        </h2>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
                            School Workspace &bull; {school.district.name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Manage ${school.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black mb-2 tracking-tighter">Welcome to the Office</h1>
                                <p className="text-indigo-200 text-lg opacity-80 font-medium">Managing every aspect of {school.name} from one place.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex flex-col items-center min-w-[120px]">
                                    <span className="text-3xl font-black">{stats.students}</span>
                                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Students</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 flex flex-col items-center min-w-[120px]">
                                    <span className="text-3xl font-black">{stats.subjects}</span>
                                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Active Subs</span>
                                </div>
                            </div>
                        </div>
                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-10 -ml-32 -mb-32"></div>
                    </div>

                    {/* Management Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Student Management */}
                        <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-gray-800 text-lg mb-2">Student Registry</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">Enroll new students, manage profiles and class assignments.</p>
                            <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center">
                                Open Section <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                            </span>
                        </div>

                        {/* Subject Management */}
                        <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="font-black text-gray-800 text-lg mb-2">Academic Subs</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">Assign subjects to classes and set up curriculum mappings.</p>
                            <span className="text-xs font-bold text-indigo-600 group-hover:underline flex items-center">
                                Open Section <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                            </span>
                        </div>

                        {/* Report Cards */}
                        <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-gray-800 text-lg mb-2">Report Cards</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">Process grades, generate termly results and print PDFs.</p>
                            <span className="text-xs font-bold text-emerald-600 group-hover:underline flex items-center">
                                Open Section <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                            </span>
                        </div>

                        {/* Staff Management */}
                        <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-gray-800 text-lg mb-2">Staff & Teachers</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">Manage teacher accounts and assign them to specific subjects.</p>
                            <span className="text-xs font-bold text-rose-600 group-hover:underline flex items-center">
                                Open Section <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
