import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ClassView({ auth, schoolClass, students, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        school_class_id: schoolClass.id,
        first_name: '',
        last_name: '',
        index_number: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        emergency_contact: '',
        grade_level: schoolClass.name,
    });

    const [isAdding, setIsAdding] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.students.store'), {
            onSuccess: () => {
                reset();
                if (!flash?.temp_credentials) setIsAdding(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">{schoolClass.name} Registry</h2>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Class Management Workspace</p>
                    </div>
                    <PrimaryButton onClick={() => setIsAdding(!isAdding)}>
                        {isAdding ? 'Close Form' : 'Enroll New Student'}
                    </PrimaryButton>
                </div>
            }
        >
            <Head title={schoolClass.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Credential Display (Important!) */}
                    {flash?.temp_credentials && (
                        <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl text-white animate-bounce-short">
                            <h3 className="text-xl font-black mb-2 flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                Registration Successful!
                            </h3>
                            <p className="text-emerald-200 text-sm mb-6">Credential generated for the new student. Please copy these down for the parent.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">Login Username</span>
                                    <p className="text-lg font-mono font-bold tracking-tight">{flash.temp_credentials.username}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-300">Temp Password</span>
                                    <p className="text-lg font-mono font-bold tracking-tight">{flash.temp_credentials.password}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Student Form */}
                    {isAdding && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black mb-6">Student Enrollment Form</h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="first_name" value="First Name" />
                                    <TextInput id="first_name" value={data.first_name} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('first_name', e.target.value)} required />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="last_name" value="Last Name" />
                                    <TextInput id="last_name" value={data.last_name} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('last_name', e.target.value)} required />
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="index_number" value="Student ID / Index #" />
                                    <TextInput id="index_number" value={data.index_number} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('index_number', e.target.value)} required />
                                    <InputError message={errors.index_number} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                                    <TextInput id="date_of_birth" type="date" value={data.date_of_birth} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('date_of_birth', e.target.value)} required />
                                    <InputError message={errors.date_of_birth} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="gender" value="Gender" />
                                    <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className="mt-1 block w-full border-gray-200 bg-gray-50/50 rounded-xl font-bold text-sm">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="emergency_contact" value="Emergency Contact (Parent)" />
                                    <TextInput id="emergency_contact" value={data.emergency_contact} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('emergency_contact', e.target.value)} required placeholder="+232 7X XXX XXX" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="address" value="Residential Address" />
                                    <TextInput id="address" value={data.address} className="mt-1 block w-full bg-gray-50/50" onChange={(e) => setData('address', e.target.value)} />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                                    <SecondaryButton onClick={() => setIsAdding(false)}>Cancel</SecondaryButton>
                                    <PrimaryButton disabled={processing}>Enroll Student & Generate Access</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Students Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Number</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Age</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {students.length > 0 ? students.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mr-4">
                                                    {s.first_name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">{s.first_name} {s.last_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-indigo-600 font-mono italic">{s.index_number}</td>
                                        <td className="px-8 py-5 whitespace-nowrap text-[10px] font-black uppercase text-gray-400">{s.gender}</td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                                            {Math.floor((new Date() - new Date(s.date_of_birth)) / 31557600000)} Years
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <button className="text-indigo-600 hover:text-indigo-900 font-bold text-sm">Profile</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">This class is currently empty. Start enrolling students!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
