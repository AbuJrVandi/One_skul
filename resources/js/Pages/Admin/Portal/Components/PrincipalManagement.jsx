import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function PrincipalManagement({ school, principal }) {
    const [isResetting, setIsResetting] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleResetPassword = (e) => {
        e.preventDefault();
        post(route('admin.portal.principal.reset-password', school.id), {
            onSuccess: () => {
                setIsResetting(false);
                reset();
            },
        });
    };

    const toggleStatus = () => {
        if (confirm(`Are you sure you want to ${principal.is_active ? 'disable' : 'enable'} this account?`)) {
            post(route('admin.portal.principal.toggle-status', school.id));
        }
    };

    if (!principal) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Principal Found</h3>
                <p className="text-gray-500 mt-2">A principal account hasn't been created for this school yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                            {principal.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{principal.name}</h3>
                            <p className="text-gray-500 font-medium">{principal.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${principal.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {principal.is_active ? 'Account Active' : 'Account Disabled'}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                            Last Login: {principal.last_login_at ? new Date(principal.last_login_at).toLocaleString() : 'Never'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setIsResetting(!isResetting)}
                        className="flex items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-2xl font-bold transition-all border border-gray-100 hover:border-indigo-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {isResetting ? 'Cancel Reset' : 'Reset Password'}
                    </button>

                    <button
                        onClick={toggleStatus}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold transition-all border ${principal.is_active
                                ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-100'
                                : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        {principal.is_active ? 'Disable Login' : 'Enable Login'}
                    </button>
                </div>

                {isResetting && (
                    <form onSubmit={handleResetPassword} className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-4">Set New Password</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full rounded-xl border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                    <p className="text-lg font-black text-gray-800 uppercase">{principal.role}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                    <p className="text-lg font-black text-gray-800">{new Date(principal.created_at).toLocaleDateString()}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Permissions</p>
                    <p className="text-lg font-black text-emerald-600">Full Access</p>
                </div>
            </div>
        </div>
    );
}
