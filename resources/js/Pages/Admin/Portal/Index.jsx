import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, schools }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">
                        Schools Management Portal
                    </h2>
                    <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {schools.length} Active Schools
                    </p>
                </div>
            }
        >
            <Head title="Schools Portal" />

            <div className="py-12 bg-gray-50/50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schools.map((school) => (
                            <Link
                                key={school.id}
                                href={route('admin.portal.show', school.id)}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                            >
                                {/* Card Header/Banner Part */}
                                <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 relative">
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/30">
                                        {school.school_type}
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-white font-bold text-xl truncate group-hover:text-yellow-200 transition-colors">
                                            {school.name}
                                        </h3>
                                        <p className="text-indigo-100 text-xs mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {school.district.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase font-semibold">Principal</span>
                                            <span className="text-sm font-bold text-gray-700">{school.principal_name}</span>
                                        </div>
                                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-gray-800">{school.students_count || 0}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Students</p>
                                        </div>
                                        <div className="text-center border-l border-gray-50">
                                            <p className="text-2xl font-black text-gray-800">{school.year_founded}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Est.</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="w-full py-2.5 rounded-xl bg-gray-50 text-indigo-600 text-xs font-bold text-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                            Manage School
                                            <svg className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Empty State / Add New Placeholder Card */}
                        <Link
                            href={route('admin.schools.index')}
                            className="group border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all min-h-[350px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-500 transition-all duration-300 shadow-sm">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="mt-4 font-bold text-gray-600 group-hover:text-indigo-600">Register New School</h3>
                            <p className="text-xs text-gray-400 text-center mt-2 px-4 italic leading-relaxed">
                                Expand the One SKul network by adding another institution to the system.
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
