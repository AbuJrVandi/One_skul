import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Teachers({ auth, teachers = [], classes = [] }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '', // Password only required for new staff OR if changing
    });

    const [isAdding, setIsAdding] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingTeacher) {
            patch(route('principal.teachers.update', editingTeacher.id), {
                onSuccess: () => {
                    reset();
                    setEditingTeacher(null);
                },
            });
        } else {
            post(route('principal.teachers.store'), {
                onSuccess: () => {
                    reset();
                    setIsAdding(false);
                },
            });
        }
    };

    const startEditing = (teacher) => {
        setEditingTeacher(teacher);
        setIsAdding(false);
        setData({
            name: teacher.name,
            email: teacher.email,
            password: '',
        });
    };

    const deleteTeacher = (id) => {
        if (confirm('Are you sure you want to remove this teacher?')) {
            router.delete(route('principal.teachers.destroy', id));
        }
    };

    const cancelAction = () => {
        setIsAdding(false);
        setEditingTeacher(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Faculty Management</h2>
                    {!isAdding && !editingTeacher && (
                        <PrimaryButton onClick={() => setIsAdding(true)}>
                            Register New Teacher
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title="Manage Teachers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Form Section (Add/Edit) */}
                    {(isAdding || editingTeacher) && (
                        <div className={`p-8 rounded-3xl shadow-sm border ${editingTeacher ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'} animate-in fade-in duration-300`}>
                            <h3 className="text-xl font-black mb-6">
                                {editingTeacher ? `Update Staff: ${editingTeacher.name}` : 'Register Staff Member'}
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        className="mt-1 block w-full bg-gray-50/50"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="e.g. Ibrahim Mansaray"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className="mt-1 block w-full bg-gray-50/50"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="teacher@school.edu"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="password" value={editingTeacher ? 'New Password (leave blank if unchanged)' : 'Initial Password'} />
                                    <TextInput
                                        id="password"
                                        type="text"
                                        value={data.password}
                                        className="mt-1 block w-full bg-gray-50/50"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={!editingTeacher}
                                    />
                                    {!editingTeacher && <p className="text-[10px] text-gray-400 mt-2 italic font-bold uppercase tracking-widest">Provide this password to the teacher for their first login.</p>}
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-3">
                                    <SecondaryButton onClick={cancelAction}>Cancel</SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {editingTeacher ? 'Update Record' : 'Save Staff Record'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Teachers List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Teacher Name</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Classes</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-4">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div className="text-sm font-bold text-gray-900">{teacher.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                                            {teacher.email}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-2">
                                                {teacher.classes?.length > 0 ? (
                                                    teacher.classes.map((cls) => (
                                                        <span key={cls.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100">
                                                            {cls.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic font-medium">No classes assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button onClick={() => startEditing(teacher)} className="text-indigo-600 hover:text-indigo-900 font-bold">Edit</button>
                                            <button onClick={() => deleteTeacher(teacher.id)} className="text-red-600 hover:text-red-900 font-bold">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
