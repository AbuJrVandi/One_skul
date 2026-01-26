import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function RoleSelection({ school }) {
    const roles = [
        {
            id: 'admin',
            name: 'Principal / Admin',
            icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0020 10c0-2.236-.733-4.302-1.975-5.976M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 2.04l-.054.09A10.003 10.003 0 004 10c0 2.236.733 4.302 1.975 5.976M12 11a1 1 0 110-2 1 1 0 010 2z',
            desc: 'Access school management tools'
        },
        {
            id: 'teacher',
            name: 'Teacher',
            icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
            desc: 'Manage classes and grades'
        },
        {
            id: 'parent',
            name: 'Parent / Student',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            desc: 'View progress and report cards'
        }
    ];

    return (
        <GuestLayout>
            <Head title={`Login to ${school.name}`} />

            <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900">{school.name}</h1>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Select your role to continue</p>
            </div>

            <div className="space-y-4">
                {roles.map((role) => (
                    <Link
                        key={role.id}
                        href={route('school.login', { school: school.id, role: role.id })}
                        className="flex items-center p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                    >
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={role.icon} />
                            </svg>
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-bold text-gray-800">{role.name}</h3>
                            <p className="text-xs text-gray-500">{role.desc}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-gray-600">
                    &larr; Back to Schools List
                </Link>
            </div>
        </GuestLayout>
    );
}
