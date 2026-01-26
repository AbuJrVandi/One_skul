import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function District({ district, schools }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Head title={`${district.name} Schools - One-Skul`} />

            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">One-Skul</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link href={route('login')} className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <header className="bg-white py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-gray-700">Districts</Link>
                        <span className="mx-2">&rarr;</span>
                        <span className="text-gray-900 font-medium">{district.name}</span>
                    </nav>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Schools in {district.name}
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Showing all {schools.length} approved schools in this district.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {schools.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {schools.map((school) => (
                            <Link
                                key={school.id}
                                href={route('public.school', school.id)}
                                className="block group"
                            >
                                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 group-hover:shadow-md transition-shadow h-full">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {school.name}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${school.school_type === 'government' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {school.school_type.charAt(0).toUpperCase() + school.school_type.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4 text-sm text-gray-500 space-y-1">
                                            <p><span className="font-medium">Principal:</span> {school.principal_name}</p>
                                            <p><span className="font-medium">Founded:</span> {school.year_founded}</p>
                                        </div>
                                        <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
                                            View Profile
                                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No schools found</h3>
                        <p className="mt-1 text-sm text-gray-500">There are no approved schools in this district yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
