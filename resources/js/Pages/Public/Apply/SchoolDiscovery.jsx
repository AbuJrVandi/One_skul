import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function SchoolDiscovery({ schools, districts, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [district, setDistrict] = useState(filters.district || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('apply.discovery'), { search, district }, { preserveState: true, replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="Find a School - One-Skul" />

            <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                                One-Skul
                            </span>
                        </Link>
                        <Link href={route('login')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            Staff Login
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Discover Your Future School
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse top-rated schools in your district and apply online in minutes.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 transform hover:scale-[1.01] transition-all duration-300 border border-gray-100">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Schools</label>
                            <input
                                type="text"
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3"
                                placeholder="Search by name, city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            >
                                <option value="">All Districts</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {schools.length > 0 ? (
                        schools.map((school) => (
                            <Link
                                key={school.id}
                                href={route('apply.form', school.id)}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
                                    <span className="text-6xl">🏫</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${school.school_type === 'private' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {school.school_type.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-500">{school.district.name}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {school.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Founded in {school.year_founded} • Principal {school.principal_name}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="block w-full text-center py-2 rounded-lg bg-gray-50 text-indigo-600 font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            Apply Now &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">No schools found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
