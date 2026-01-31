import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

export default function Dashboard({ auth, school, stats, notices }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        target_audience: 'all',
    });

    const [isPosting, setIsPosting] = useState(false);

    const submitNotice = (e) => {
        e.preventDefault();
        post(route('principal.notices.store'), {
            onSuccess: () => {
                reset();
                setIsPosting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Principal's Office: {school.name}</h2>}
        >
            <Head title="Principal Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* ... existing stats ... */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-gray-900">{stats.students}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total Students</span>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-gray-900">{stats.teachers}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total Teachers</span>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-4xl font-black text-gray-900">{stats.classes}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total Classes</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Navigation Actions */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Link
                                    href={route('principal.teachers.index')}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-2 text-left">Staff Management</h3>
                                    <p className="text-gray-500 text-sm mb-6 text-left">Register and manage your teaching staff. Assign credentials and roles.</p>
                                    <span className="text-indigo-600 font-bold flex items-center group-hover:underline">
                                        Manage Teachers <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.applications.index')}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-2 text-left">Student Applications</h3>
                                    <p className="text-gray-500 text-sm mb-6 text-left">Review incoming student applications, approve admissions, and auto-generate accounts.</p>
                                    <span className="text-green-600 font-bold flex items-center group-hover:underline">
                                        Review Applications <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.classes.index')}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-2 text-left">School Structure</h3>
                                    <p className="text-gray-500 text-sm mb-6 text-left">Define classes from Class 1 to SSS 3 and assign teachers to them.</p>
                                    <span className="text-indigo-600 font-bold flex items-center group-hover:underline">
                                        Manage Classes <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.subjects.index')}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group md:col-span-2"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-2 text-left">Subject Management</h3>
                                    <p className="text-gray-500 text-sm mb-6 text-left">Enable/disable subjects for your school and assign them to classes. Subjects are defined at platform level.</p>
                                    <span className="text-purple-600 font-bold flex items-center group-hover:underline">
                                        Manage Subjects <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>
                            </div>

                            {/* Post Notice Section */}
                            <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Broadcasting Center</h3>
                                    {!isPosting && (
                                        <button onClick={() => setIsPosting(true)} className="bg-white text-indigo-900 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                                            Post New Notice
                                        </button>
                                    )}
                                </div>

                                {isPosting ? (
                                    <form onSubmit={submitNotice} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="title" value="Announcement Title" className="!text-indigo-200" />
                                                <TextInput id="title" value={data.title} className="mt-1 block w-full !bg-white/10 !text-white !border-white/20" onChange={(e) => setData('title', e.target.value)} required />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="audience" value="Target Audience" className="!text-indigo-200" />
                                                <select value={data.target_audience} onChange={(e) => setData('target_audience', e.target.value)} className="mt-1 block w-full border-white/20 bg-white/10 text-white rounded-xl font-bold">
                                                    <option value="all" className="text-gray-900">Everyone</option>
                                                    <option value="teachers" className="text-gray-900">Teachers Only</option>
                                                    <option value="students" className="text-gray-900">Students & Parents</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="content" value="Message Content" className="!text-indigo-200" />
                                            <textarea value={data.content} onChange={(e) => setData('content', e.target.value)} className="mt-1 block w-full border-white/20 bg-white/10 text-white rounded-xl focus:ring-white h-32"></textarea>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4">
                                            <SecondaryButton onClick={() => setIsPosting(false)} className="!bg-transparent !text-white !border-white/20 hover:!bg-white/10">Cancel</SecondaryButton>
                                            <PrimaryButton disabled={processing} className="!bg-white !text-indigo-900 hover:!bg-gray-100">Broadcast Now</PrimaryButton>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="py-6 flex flex-col items-center justify-center text-center opacity-70">
                                        <svg className="w-12 h-12 mb-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                        <p className="text-sm font-bold uppercase tracking-widest">No Active Broadcast Session</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Notices Feed (Sidebar feel) */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                                Global Feed
                            </h3>
                            <div className="space-y-4">
                                {notices.length > 0 ? notices.map((notice) => (
                                    <div key={notice.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${notice.target_audience === 'all' ? 'bg-indigo-500' :
                                            notice.target_audience === 'teachers' ? 'bg-emerald-500' : 'bg-orange-500'
                                            }`}></div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{new Date(notice.created_at).toLocaleString()}</span>
                                        <h4 className="font-black text-gray-900 mt-1 mb-2 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{notice.content}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-[8px] font-black uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md text-gray-400 border border-gray-100">
                                                For: {notice.target_audience}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center opacity-30 italic font-bold">
                                        No announcements yet...
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
