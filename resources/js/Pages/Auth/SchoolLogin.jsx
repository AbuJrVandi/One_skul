import React, { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function SchoolLogin({ school, role, roleLabel }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        school_id: school.id, // Ensure we pass school context
        intended_role: role,  // Ensure we pass role context
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title={`${roleLabel} Login`} />

            <div className="mb-8 text-center text-sm">
                <div className="inline-block p-1 px-3 mb-4 bg-indigo-50 text-indigo-700 font-black rounded-full uppercase tracking-widest text-[10px]">
                    {roleLabel} Portal
                </div>
                <h1 className="text-xl font-bold text-gray-900">{school.name}</h1>
                <p className="text-gray-500 mt-1">Please enter your credentials to access the system.</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Institutional Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-gray-50/50"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={`${role}@${school.name.toLowerCase().replace(/\s/g, '')}.edu`}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-gray-50/50"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-400 font-bold">Stay logged in</span>
                    </label>

                    <Link
                        href={route('password.request')}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                    >
                        Forgot password?
                    </Link>
                </div>

                <PrimaryButton className="w-full justify-center !py-4 !rounded-2xl shadow-lg shadow-indigo-100" disabled={processing}>
                    Login to Portal
                </PrimaryButton>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link
                    href={route('school.roles', school.id)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center justify-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" /></svg>
                    Switch User Role
                </Link>
            </div>
        </GuestLayout>
    );
}
