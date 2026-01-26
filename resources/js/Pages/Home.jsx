import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ districts }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Head title="Welcome to One-Skul" />

            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">One-Skul</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href={route('login')} className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-white py-16 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Your School. Your Students. One Platform.
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        One-Skul brings every approved school in your district together under one seamless digital platform.
                    </p>
                </div>
            </header>

            {/* Districts List */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-8">Browse by District</h2>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {districts.map((district) => (
                        <div key={district.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{district.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {district.schools.length} {district.schools.length === 1 ? 'Approved School' : 'Approved Schools'}
                                </p>

                                <div className="space-y-2 mb-6">
                                    {district.schools.slice(0, 3).map((school) => (
                                        <Link
                                            key={school.id}
                                            href={route('public.school', school.id)}
                                            className="block text-sm text-blue-600 hover:underline"
                                        >
                                            {school.name}
                                        </Link>
                                    ))}
                                    {district.schools.length > 3 && (
                                        <p className="text-xs text-gray-400">And {district.schools.length - 3} more...</p>
                                    )}
                                </div>

                                <Link
                                    href={route('public.district', district.id)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    View District
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-white border-t mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} One-Skul. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
