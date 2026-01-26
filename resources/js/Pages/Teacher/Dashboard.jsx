import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, classes, notices }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Teacher Workspace</h2>}
        >
            <Head title="Teacher Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Classes Grid */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-gray-800">Your Assigned Classes</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Select a class to manage students</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {classes.length > 0 ? classes.map((cls) => (
                                    <Link
                                        key={cls.id}
                                        href={route('teacher.class.view', cls.id)}
                                        className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[200px]"
                                    >
                                        <div>
                                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${cls.level === 'primary' ? 'bg-green-100 text-green-700' :
                                                cls.level === 'jss' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {cls.level}
                                            </div>
                                            <h4 className="text-4xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{cls.name}</h4>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                                {cls.students_count} Students
                                            </span>
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-bold italic">No classes assigned yet. Please contact your Principal.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notices Sidebar */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                                Principal's Desk
                            </h3>
                            <div className="space-y-4">
                                {notices.length > 0 ? notices.map((notice) => (
                                    <div key={notice.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{new Date(notice.created_at).toLocaleString()}</span>
                                        <h4 className="font-black text-gray-900 mt-1 mb-2 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium">{notice.content}</p>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center opacity-30 italic font-bold bg-white rounded-3xl border border-gray-100">
                                        No new announcements.
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
