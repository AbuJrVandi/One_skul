import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

export default function Index({ auth, subjects, levels }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterLevel, setFilterLevel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        code: '',
        level: 'all',
        category: '',
        is_active: true,
    });

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.subjects.store'), {
            onSuccess: () => {
                reset();
                setIsCreating(false);
            }
        });
    };

    const submitUpdate = (e, subjectId) => {
        e.preventDefault();
        patch(route('admin.subjects.update', subjectId), {
            onSuccess: () => {
                reset();
                setEditingId(null);
            }
        });
    };

    const startEdit = (subject) => {
        setEditingId(subject.id);
        setData({
            name: subject.name,
            code: subject.code || '',
            level: subject.level || 'all',
            category: subject.category || '',
            is_active: subject.is_active,
        });
    };

    const toggleStatus = (subject) => {
        if (subject.is_active) {
            router.post(route('admin.subjects.deactivate', subject.id));
        } else {
            router.post(route('admin.subjects.activate', subject.id));
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        if (filterLevel && subject.level !== filterLevel && subject.level !== 'all') return false;
        if (filterStatus === 'active' && !subject.is_active) return false;
        if (filterStatus === 'inactive' && subject.is_active) return false;
        return true;
    });

    const getLevelBadge = (level) => {
        const badges = {
            'primary': 'bg-green-100 text-green-800',
            'jss': 'bg-blue-100 text-blue-800',
            'sss': 'bg-purple-100 text-purple-800',
            'all': 'bg-gray-100 text-gray-800',
        };
        return badges[level] || badges['all'];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Subject Management</h2>}
        >
            <Head title="Subjects - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                            >
                                <option value="">All Levels</option>
                                {levels.map((level) => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm font-medium focus:ring-indigo-500"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        {!isCreating && (
                            <PrimaryButton onClick={() => setIsCreating(true)} className="!bg-indigo-600 hover:!bg-indigo-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Subject
                            </PrimaryButton>
                        )}
                    </div>

                    {/* Create Form */}
                    {isCreating && (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Create New Subject</h3>
                            <form onSubmit={submitCreate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Subject Name" />
                                        <TextInput
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="code" value="Subject Code (Optional)" />
                                        <TextInput
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. MTH, ENG"
                                        />
                                        <InputError message={errors.code} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="level" value="Level" />
                                        <select
                                            id="level"
                                            value={data.level}
                                            onChange={(e) => setData('level', e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-gray-300 focus:ring-indigo-500"
                                        >
                                            {levels.map((level) => (
                                                <option key={level.value} value={level.value}>{level.label}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.level} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="category" value="Category (Optional)" />
                                        <TextInput
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. Science, Arts"
                                        />
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton onClick={() => { setIsCreating(false); reset(); }}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit" disabled={processing} className="!bg-indigo-600">
                                        Create Subject
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Subjects Table */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h3 className="text-lg font-black text-gray-900">
                                Platform Subjects ({filteredSubjects.length})
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                These subjects are automatically available to all schools on the platform.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSubjects.map((subject) => (
                                        <tr key={subject.id} className={`hover:bg-gray-50 transition-colors ${!subject.is_active ? 'opacity-50' : ''}`}>
                                            {editingId === subject.id ? (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <TextInput
                                                            value={data.name}
                                                            onChange={(e) => setData('name', e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <TextInput
                                                            value={data.code}
                                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                                            className="w-full"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={data.level}
                                                            onChange={(e) => setData('level', e.target.value)}
                                                            className="w-full rounded-lg border-gray-300"
                                                        >
                                                            {levels.map((level) => (
                                                                <option key={level.value} value={level.value}>{level.label}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <TextInput
                                                            value={data.category}
                                                            onChange={(e) => setData('category', e.target.value)}
                                                            className="w-full"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">-</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={(e) => submitUpdate(e, subject.id)}
                                                            className="text-green-600 hover:text-green-800 font-semibold mr-3"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingId(null); reset(); }}
                                                            className="text-gray-500 hover:text-gray-700 font-semibold"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-900">{subject.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-sm text-gray-600">{subject.code || '-'}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getLevelBadge(subject.level)}`}>
                                                            {subject.level}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{subject.category || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${subject.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {subject.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => startEdit(subject)}
                                                            className="text-indigo-600 hover:text-indigo-800 font-semibold mr-3"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => toggleStatus(subject)}
                                                            className={`font-semibold ${subject.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                        >
                                                            {subject.is_active ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredSubjects.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <p className="font-medium">No subjects found</p>
                                    <p className="text-sm">Create your first subject to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
