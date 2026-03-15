import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, applications, stats }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApplications = applications.filter(app =>
        app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_reference.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.pending}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Applications</h2>
                    <div className="text-sm text-gray-500">
                        Managing admissions for {auth.user.school?.name}
                    </div>
                </div>
            }
        >
            <Head title="Applications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Applications</div>
                            <div className="mt-2 text-3xl font-extrabold text-gray-900">{stats.total}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border-l-4 border-yellow-400">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Review</div>
                            <div className="mt-2 text-3xl font-extrabold text-yellow-600">{stats.pending}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border-l-4 border-green-400">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Approved</div>
                            <div className="mt-2 text-3xl font-extrabold text-green-600">{stats.approved}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border-l-4 border-red-400">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Rejected</div>
                            <div className="mt-2 text-3xl font-extrabold text-red-600">{stats.rejected}</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                            <div className="relative w-full sm:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Search by name or reference..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                {/* Filter dropdowns could go here */}
                            </div>
                        </div>

                        {/* Search Results */}
                        {filteredApplications.length === 0 ? (
                            <div className="p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'New applications will appear here.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Applied</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredApplications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                                            {app.first_name[0]}{app.last_name[0]}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</div>
                                                            <div className="text-sm text-gray-500">{app.email || app.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="font-medium text-gray-900 capitalize">{app.class_level?.replace('-', ' ')}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{app.class_category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {app.submitted_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                                    {app.application_reference}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(app.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={route('principal.applications.show', app.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination placeholder */}
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="text-xs text-gray-500 text-center">
                                Showing all {filteredApplications.length} records
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
