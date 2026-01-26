import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function SchoolProfile({ school }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Head title={`${school.name} - One-Skul`} />

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

            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-gray-700">Districts</Link>
                    <span className="mx-2">&rarr;</span>
                    <Link href={route('public.district', school.district.id)} className="hover:text-gray-700">{school.district.name}</Link>
                    <span className="mx-2">&rarr;</span>
                    <span className="text-gray-900 font-medium">{school.name}</span>
                </nav>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
                    <div className="px-4 py-6 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{school.name}</h1>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{school.district.name} District</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${school.school_type === 'government' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                            {school.school_type.charAt(0).toUpperCase() + school.school_type.slice(1)}
                        </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500">School Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{school.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500">District Location</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{school.district.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500">Year Founded</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{school.year_founded}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500">School Type</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{school.school_type}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                <dt className="text-sm font-medium text-gray-500">Principal Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{school.principal_name}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-6 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <Link
                            href={route('school.roles', school.id)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                        >
                            Enter School Portal &rarr;
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400 italic">
                        All information published here has been verified and approved by the district education office.
                    </p>
                </div>
            </main>
        </div>
    );
}
