import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function Index({ auth, subjects, levels }) {
    const [filterLevel, setFilterLevel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSubject = (subjectId) => {
        router.post(route('principal.subjects.toggle', subjectId), {}, {
            preserveScroll: true
        });
    };

    const filteredSubjects = subjects.filter(subject => {
        if (filterLevel && subject.level !== filterLevel && subject.level !== 'all') return false;
        if (filterStatus === 'enabled' && !subject.is_enabled) return false;
        if (filterStatus === 'disabled' && subject.is_enabled) return false;
        if (searchQuery && !subject.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const getLevelBadge = (level) => {
        const badges = {
            'primary': 'bg-green-100 text-green-800',
            'jss': 'bg-blue-100 text-blue-800',
            'sss': 'bg-purple-100 text-purple-800',
            'all': 'bg-gray-100 text-gray-800',
        };
        return badges[level] || badges['all'];
    };

    const enabledCount = subjects.filter(s => s.is_enabled).length;
    const disabledCount = subjects.filter(s => !s.is_enabled).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">School Subjects</h2>}
        >
            <Head title="Subjects - School Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900">{subjects.length}</p>
                                    <p className="text-sm font-medium text-gray-500">Total Subjects</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-green-600">{enabledCount}</p>
                                    <p className="text-sm font-medium text-gray-500">Enabled Subjects</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-red-600">{disabledCount}</p>
                                    <p className="text-sm font-medium text-gray-500">Disabled Subjects</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Actions */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500 w-64"
                            />
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                            >
                                <option value="">All Levels</option>
                                {levels.map((level) => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                            >
                                <option value="">All Status</option>
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>
                        <Link
                            href={route('principal.subjects.class-assignment')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Assign to Classes
                        </Link>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">
                                These are platform subjects managed by One-Skul administrators.
                            </p>
                            <p className="text-sm text-blue-600">
                                You can enable or disable subjects for your school, but cannot create or modify global subject details.
                            </p>
                        </div>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map((subject) => (
                            <div
                                key={subject.id}
                                className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-lg ${!subject.is_enabled ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-black text-lg text-gray-900">{subject.name}</h3>
                                        {subject.code && (
                                            <span className="font-mono text-sm text-gray-500">{subject.code}</span>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getLevelBadge(subject.level)}`}>
                                        {subject.level}
                                    </span>
                                </div>

                                {subject.category && (
                                    <p className="text-sm text-gray-500 mb-4">Category: {subject.category}</p>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${subject.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {subject.is_enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <button
                                        onClick={() => toggleSubject(subject.id)}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${subject.is_enabled
                                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                    >
                                        {subject.is_enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredSubjects.length === 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No subjects found</h3>
                            <p className="text-gray-500">No subjects match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
