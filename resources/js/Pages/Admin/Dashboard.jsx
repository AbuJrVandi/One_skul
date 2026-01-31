import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, recentSchools }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Total Districts</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.districts}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Total Schools</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.schools}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium">Pending Approval</h3>
                            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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

                        {/* Recent Schools */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
