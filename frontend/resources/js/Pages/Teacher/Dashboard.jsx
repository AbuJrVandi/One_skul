import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { useEffect } from 'react';

const pieColors = ['#2563eb', '#f97316', '#10b981'];

export default function Dashboard({ auth, classes, genderStats }) {
    const classChart = classes.map((cls) => ({
        name: cls.name,
        students: cls.students_count,
    }));

    const genderChart = [
        { name: 'Male', value: genderStats?.male ?? 0 },
        { name: 'Female', value: genderStats?.female ?? 0 },
        { name: 'Other', value: genderStats?.other ?? 0 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['classes', 'genderStats'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Teacher Workspace</h2>}
        >
            <Head title="Teacher Dashboard" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-gray-800">Class Size Overview</h3>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Real-time students per class</span>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={classChart} margin={{ left: 12, right: 12 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                        <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-gray-800">Student Gender Split</h3>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Male vs Female</span>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={genderChart}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={4}
                                        >
                                            {genderChart.map((_, index) => (
                                                <Cell key={`gender-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e5e7eb' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
