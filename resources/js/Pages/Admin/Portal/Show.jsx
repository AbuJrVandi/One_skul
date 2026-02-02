import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

import PrincipalManagement from './Components/PrincipalManagement';
import ReportCardDesigner from './Components/ReportCardDesigner';

export default function Show({ auth, school, principal, stats }) {
    const [activeTab, setActiveTab] = React.useState('principal');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.portal.index')}
                            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="font-black text-2xl text-gray-900 leading-tight tracking-tight">
                                {school.name}
                            </h2>
                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest flex items-center">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                                {school.district.name} &bull; Management Portal
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Manage ${school.name}`} />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Navigation Tabs */}
                    <div className="flex p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 w-fit">
                        <button
                            onClick={() => setActiveTab('principal')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'principal'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Principal Account
                        </button>
                        <button
                            onClick={() => setActiveTab('report-card')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'report-card'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Report Designer
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="transition-all duration-300">
                        {activeTab === 'principal' ? (
                            <PrincipalManagement school={school} principal={principal} />
                        ) : (
                            <ReportCardDesigner school={school} />
                        )}
                    </div>

                    {/* Preserved Stats (Hidden but accessible via data if needed) */}
                    <div className="mt-12 opacity-50 border-t pt-8 flex gap-8">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Total Enrollment</span>
                            <span className="text-xl font-black text-gray-700">{stats.students} Students</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Active Curriculum</span>
                            <span className="text-xl font-black text-gray-700">{stats.subjects} Subjects</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
