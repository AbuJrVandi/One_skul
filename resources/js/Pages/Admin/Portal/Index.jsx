import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, schools }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="font-extrabold text-2xl text-gray-900 leading-tight tracking-tight">
                        Schools Management Portal
                    </h2>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            {schools.length} Schools
                        </p>
                        <Link
                            href={route('admin.schools.index')}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Manage Schools
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Schools Portal" />

            <div className="py-12 bg-gray-50/50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">All Schools</h3>
                                <p className="text-sm text-gray-500">Select a school to manage principal credentials and report design.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-bold">School</th>
                                        <th className="px-6 py-3 text-left font-bold">District</th>
                                        <th className="px-6 py-3 text-left font-bold">Type</th>
                                        <th className="px-6 py-3 text-left font-bold">Principal</th>
                                        <th className="px-6 py-3 text-left font-bold">Founded</th>
                                        <th className="px-6 py-3 text-left font-bold">Status</th>
                                        <th className="px-6 py-3 text-right font-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {schools.map((school) => (
                                        <tr key={school.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{school.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{school.district.name}</td>
                                            <td className="px-6 py-4 text-gray-600 capitalize">{school.school_type}</td>
                                            <td className="px-6 py-4 text-gray-600">{school.principal_name}</td>
                                            <td className="px-6 py-4 text-gray-600">{school.year_founded}</td>
                                            <td className="px-6 py-4">
                                                {school.is_approved ? (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('admin.portal.show', school.id)}
                                                    className="inline-flex items-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                                                >
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {schools.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No schools found. Add a school to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
