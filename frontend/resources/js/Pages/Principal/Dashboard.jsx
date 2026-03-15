import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const chartColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function Dashboard({ auth, school, stats, notices, analytics }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        target_audience: 'all',
    });

    const [isPosting, setIsPosting] = useState(false);

    const kpis = analytics?.kpis ?? {};
    const enrollmentTrend = analytics?.enrollment_trend ?? [];
    const applicationsTrend = analytics?.applications_trend ?? [];
    const applicationsStatus = analytics?.applications_status ?? [];
    const classSizes = analytics?.class_sizes ?? [];
    const activity = analytics?.activity ?? {};
    const lastUpdated = analytics?.last_updated ?? null;

    const pendingApps = kpis.applications_pending ?? 0;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['stats', 'analytics', 'notices'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

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
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Principal Dashboard — {school.name}</h2>}
        >
            <Head title="Principal Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Monitor staffing, enrollment, and admissions at a glance.</p>
                            <p className="text-xs text-gray-400 mt-1">Auto-refreshes every 30 seconds.</p>
                        </div>
                        {lastUpdated && (
                            <div className="text-xs text-gray-500 bg-white border border-gray-100 px-3 py-2 rounded-full shadow-sm">
                                Last updated: <span className="font-semibold text-gray-700">{lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Students</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{kpis.students ?? stats.students}</p>
                            <p className="text-xs text-gray-500 mt-2">+{activity.students_30d ?? 0} last 30 days</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Teachers</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{kpis.teachers ?? stats.teachers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Classes</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{kpis.classes ?? stats.classes}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Applications</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">{kpis.applications ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-2">{pendingApps} pending review</p>
                        </div>
                    </div>

                    {/* Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Enrollment Growth</h3>
                                <span className="text-xs text-gray-400">Last 12 months</span>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={enrollmentTrend}>
                                        <defs>
                                            <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                        <Area type="monotone" dataKey="total" stroke="#2563eb" fill="url(#enrollFill)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Applications Volume</h3>
                                <span className="text-xs text-gray-400">Last 14 days</span>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={applicationsTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                        <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Class Sizes</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={classSizes} margin={{ left: 12, right: 12 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                        <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={applicationsStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                                            {applicationsStatus.map((_, index) => (
                                                <Cell key={`app-status-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Link
                                    href={route('principal.teachers.index')}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-lg font-black text-gray-900 mb-2 text-left">Teacher Directory</h3>
                                    <p className="text-gray-500 text-sm mb-5 text-left">Add staff, manage roles, and assign classes.</p>
                                    <span className="text-indigo-600 font-bold flex items-center group-hover:underline">
                                        Manage Teachers <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.applications.index')}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-lg font-black text-gray-900 mb-2 text-left">Admissions Queue</h3>
                                    <p className="text-gray-500 text-sm mb-5 text-left">Review submissions and approve or reject applications.</p>
                                    <span className="text-emerald-600 font-bold flex items-center group-hover:underline">
                                        Review Applications <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.classes.index')}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-lg font-black text-gray-900 mb-2 text-left">Class Register</h3>
                                    <p className="text-gray-500 text-sm mb-5 text-left">Create classes and assign teaching teams.</p>
                                    <span className="text-indigo-600 font-bold flex items-center group-hover:underline">
                                        Manage Classes <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>

                                <Link
                                    href={route('principal.subjects.index')}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                                >
                                    <h3 className="text-lg font-black text-gray-900 mb-2 text-left">Subject Settings</h3>
                                    <p className="text-gray-500 text-sm mb-5 text-left">Enable subjects and align them to class levels.</p>
                                    <span className="text-purple-600 font-bold flex items-center group-hover:underline">
                                        Manage Subjects <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                                    </span>
                                </Link>
                            </div>

                            {/* Broadcast Center */}
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
                                                <InputError message={errors.title} className="mt-2 !text-red-200" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="audience" value="Target Audience" className="!text-indigo-200" />
                                                <select value={data.target_audience} onChange={(e) => setData('target_audience', e.target.value)} className="mt-1 block w-full border-white/20 bg-white/10 text-white rounded-xl font-bold">
                                                    <option value="all" className="text-gray-900">Everyone</option>
                                                    <option value="teachers" className="text-gray-900">Teachers Only</option>
                                                    <option value="students" className="text-gray-900">Students & Parents</option>
                                                </select>
                                                <InputError message={errors.target_audience} className="mt-2 !text-red-200" />
                                            </div>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="content" value="Message Content" className="!text-indigo-200" />
                                            <textarea value={data.content} onChange={(e) => setData('content', e.target.value)} className="mt-1 block w-full border-white/20 bg-white/10 text-white rounded-xl focus:ring-white h-32"></textarea>
                                            <InputError message={errors.content} className="mt-2 !text-red-200" />
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

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">30 Day Activity</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span>New students</span>
                                        <span className="font-semibold text-gray-900">{activity.students_30d ?? 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>New applications</span>
                                        <span className="font-semibold text-gray-900">{activity.applications_30d ?? 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                    School Updates
                                </h3>
                                <div className="space-y-4">
                                    {notices.length > 0 ? notices.map((notice) => (
                                        <div key={notice.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
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
            </div>
        </AuthenticatedLayout>
    );
}
