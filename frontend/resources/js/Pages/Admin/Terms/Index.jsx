import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';

export default function Index({ auth, academicYears, termNumbers }) {
    const [isCreatingYear, setIsCreatingYear] = useState(false);
    const [editingYearId, setEditingYearId] = useState(null);
    const [editingTermId, setEditingTermId] = useState(null);
    const [expandedYear, setExpandedYear] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        is_current: false,
    });

    const termForm = useForm({
        academic_year_id: '',
        name: '',
        term_number: '1',
    });

    const submitCreateYear = (e) => {
        e.preventDefault();
        post(route('admin.academic-years.store'), {
            onSuccess: () => {
                reset();
                setIsCreatingYear(false);
            }
        });
    };

    const submitUpdateYear = (e, yearId) => {
        e.preventDefault();
        patch(route('admin.academic-years.update', yearId), {
            onSuccess: () => {
                reset();
                setEditingYearId(null);
            }
        });
    };

    const startEditYear = (year) => {
        setEditingYearId(year.id);
        setData({
            name: year.name,
            start_date: year.start_date,
            end_date: year.end_date,
            is_current: year.is_current,
        });
    };

    const setCurrent = (yearId) => {
        router.post(route('admin.academic-years.set-current', yearId));
    };

    const toggleTermStatus = (term) => {
        if (term.is_active) {
            router.post(route('admin.terms.deactivate', term.id));
        } else {
            router.post(route('admin.terms.activate', term.id));
        }
    };

    const startEditTerm = (term) => {
        setEditingTermId(term.id);
        termForm.setData({
            name: term.name,
            is_active: term.is_active,
        });
    };

    const submitUpdateTerm = (e, termId) => {
        e.preventDefault();
        termForm.patch(route('admin.terms.update', termId), {
            onSuccess: () => {
                termForm.reset();
                setEditingTermId(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Term Management</h2>}
        >
            <Head title="Terms - Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <p className="text-gray-600">
                                Manage academic years and terms. Terms are automatically available to all schools.
                            </p>
                        </div>
                        {!isCreatingYear && (
                            <PrimaryButton onClick={() => setIsCreatingYear(true)} className="!bg-indigo-600 hover:!bg-indigo-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Academic Year
                            </PrimaryButton>
                        )}
                    </div>

                    {/* Create Academic Year Form */}
                    {isCreatingYear && (
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Create New Academic Year</h3>
                            <form onSubmit={submitCreateYear} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Academic Year Name" />
                                        <TextInput
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g. 2024/2025"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Start Date" />
                                        <TextInput
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.start_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="end_date" value="End Date" />
                                        <TextInput
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.end_date} className="mt-2" />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data.is_current}
                                                onChange={(e) => setData('is_current', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Set as Current Year</span>
                                        </label>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 bg-blue-50 p-4 rounded-xl">
                                    <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Three terms (Term 1, Term 2, Term 3) will be automatically created for this academic year.
                                </p>
                                <div className="flex justify-end gap-3">
                                    <SecondaryButton onClick={() => { setIsCreatingYear(false); reset(); }}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton type="submit" disabled={processing} className="!bg-indigo-600">
                                        Create Academic Year
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Academic Years List */}
                    <div className="space-y-6">
                        {academicYears.map((year) => (
                            <div key={year.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                                <div
                                    className={`px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${year.is_current ? 'bg-indigo-50' : ''}`}
                                    onClick={() => setExpandedYear(expandedYear === year.id ? null : year.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                                {year.name}
                                                {year.is_current && (
                                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full uppercase">
                                                        Current
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!year.is_current && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrent(year.id); }}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                            >
                                                Set as Current
                                            </button>
                                        )}
                                        <span className="text-sm text-gray-400">{year.terms?.length || 0} Terms</span>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedYear === year.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Terms Table */}
                                {expandedYear === year.id && (
                                    <div className="border-t border-gray-100">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-8 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Term</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Term Number</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {year.terms?.map((term) => (
                                                    <tr key={term.id} className={`hover:bg-gray-50 ${!term.is_active ? 'opacity-50' : ''}`}>
                                                        {editingTermId === term.id ? (
                                                            <>
                                                                <td className="px-8 py-4">
                                                                    <TextInput
                                                                        value={termForm.data.name}
                                                                        onChange={(e) => termForm.setData('name', e.target.value)}
                                                                        className="w-full"
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4 text-gray-600">{term.term_number}</td>
                                                                <td className="px-6 py-4">-</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <button
                                                                        onClick={(e) => submitUpdateTerm(e, term.id)}
                                                                        className="text-green-600 hover:text-green-800 font-semibold mr-3"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { setEditingTermId(null); termForm.reset(); }}
                                                                        className="text-gray-500 hover:text-gray-700 font-semibold"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-8 py-4">
                                                                    <span className="font-bold text-gray-900">{term.name}</span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-700">
                                                                        {term.term_number}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${term.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {term.is_active ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <button
                                                                        onClick={() => startEditTerm(term)}
                                                                        className="text-indigo-600 hover:text-indigo-800 font-semibold mr-3"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toggleTermStatus(term)}
                                                                        className={`font-semibold ${term.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                                    >
                                                                        {term.is_active ? 'Deactivate' : 'Activate'}
                                                                    </button>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {(!year.terms || year.terms.length === 0) && (
                                            <div className="text-center py-8 text-gray-500">
                                                No terms defined for this academic year.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {academicYears.length === 0 && (
                            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Academic Years</h3>
                                <p className="text-gray-500 mb-6">Get started by creating your first academic year.</p>
                                <PrimaryButton onClick={() => setIsCreatingYear(true)} className="!bg-indigo-600">
                                    Create Academic Year
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
