import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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

export default function Dashboard({ auth, stats, recentSchools, analytics }) {
    const kpis = analytics?.kpis ?? {};
    const schoolTypes = analytics?.school_types ?? [];
    const applicationsStatus = analytics?.applications_status ?? [];
    const schoolsTrend = analytics?.schools_trend ?? [];
    const applicationsTrend = analytics?.applications_trend ?? [];
    const activity = analytics?.activity ?? {};
    const lastUpdated = analytics?.last_updated ?? null;

    const pendingApps = applicationsStatus.find((item) => item.name === 'Pending')?.value ?? 0;

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['stats', 'recentSchools', 'analytics'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500">System-wide analytics for every district and school.</p>
                            <p className="text-xs text-gray-400 mt-1">Auto-refreshes every 30 seconds.</p>
                        </div>
                        {lastUpdated && (
                            <div className="text-xs text-gray-500 bg-white border border-gray-100 px-3 py-2 rounded-full shadow-sm">
                                Last updated: <span className="font-semibold text-gray-700">{lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Districts</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.districts ?? stats.districts}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Schools</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.schools ?? stats.schools}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                {kpis.approved_schools ?? 0} approved • {kpis.pending_schools ?? stats.pending} pending
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Applications</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{kpis.applications ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-2">{pendingApps} pending</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Pending Approvals</p>
                            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                            <p className="text-xs text-gray-500 mt-2">Schools awaiting approval</p>
                        </div>
                    </div>

                    {/* Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Schools Growth</h3>
                                <span className="text-xs text-gray-400">Last 12 months</span>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={schoolsTrend}>
                                        <defs>
                                            <linearGradient id="approvedFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="pendingFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                        <Area type="monotone" dataKey="approved" stroke="#10b981" fill="url(#approvedFill)" stackId="1" />
                                        <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="url(#pendingFill)" stackId="1" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                                        <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#2563eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">School Types</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={schoolTypes} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                            {schoolTypes.map((_, index) => (
                                                <Cell key={`school-type-${index}`} fill={chartColors[index % chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Applications Status</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={applicationsStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link
                                    href={route('admin.districts.index')}
                                    className="block w-full text-center px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-md hover:bg-blue-100 transition-colors"
                                >
                                    Manage Districts
                                </Link>
                                <Link
                                    href={route('admin.schools.index')}
                                    className="block w-full text-center px-4 py-3 bg-green-50 text-green-700 font-semibold rounded-md hover:bg-green-100 transition-colors"
                                >
                                    Manage Schools
                                </Link>
                                <Link
                                    href={route('admin.subjects.index')}
                                    className="block w-full text-center px-4 py-3 bg-purple-50 text-purple-700 font-semibold rounded-md hover:bg-purple-100 transition-colors"
                                >
                                    Manage Subjects
                                </Link>
                                <Link
                                    href={route('admin.terms.index')}
                                    className="block w-full text-center px-4 py-3 bg-orange-50 text-orange-700 font-semibold rounded-md hover:bg-orange-100 transition-colors"
                                >
                                    Manage Terms
                                </Link>
                            </div>
                        </div>

                        {/* Operational Activity */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4">Operational Activity</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>New schools (7 days)</span>
                                    <span className="font-semibold text-gray-900">{activity.schools_7d ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Applications (7 days)</span>
                                    <span className="font-semibold text-gray-900">{activity.applications_7d ?? 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Schools */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4">Recently Added Schools</h3>
                            <div className="divide-y">
                                {recentSchools.map((school) => (
                                    <div key={school.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-900">{school.name}</p>
                                            <p className="text-sm text-gray-500">{school.district.name}</p>
                                        </div>
                                        <div>
                                            {school.is_approved ? (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Approved</span>
                                            ) : (
                                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {recentSchools.length === 0 && (
                                    <p className="text-sm text-gray-500 py-4">No schools added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
