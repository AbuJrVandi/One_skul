import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, schools, districts }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        district_id: '',
        year_founded: '',
        school_type: 'government',
        principal_name: '',
    });

    const [isAdding, setIsAdding] = useState(false);
    const [editingSchool, setEditingSchool] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingSchool) {
            patch(route('admin.schools.update', editingSchool.id), {
                onSuccess: () => {
                    reset();
                    setEditingSchool(null);
                },
            });
        } else {
            post(route('admin.schools.store'), {
                onSuccess: () => {
                    reset();
                    setIsAdding(false);
                },
            });
        }
    };

    const toggleApproval = (id) => {
        router.post(route('admin.schools.toggle-approval', id));
    };

    const deleteSchool = (id) => {
        if (confirm('Are you sure you want to delete this school?')) {
            router.delete(route('admin.schools.destroy', id));
        }
    };

    const startEditing = (school) => {
        setEditingSchool(school);
        setIsAdding(false);
        setData({
            name: school.name,
            district_id: school.district_id,
            year_founded: school.year_founded,
            school_type: school.school_type,
            principal_name: school.principal_name,
        });
    };

    const cancelAction = () => {
        setIsAdding(false);
        setEditingSchool(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Schools</h2>
                    {!isAdding && !editingSchool && (
                        <PrimaryButton onClick={() => setIsAdding(true)}>
                            Add New School
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title="Manage Schools" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Form Section (Add/Edit) */}
                    {(isAdding || editingSchool) && (
                        <div className={`p-6 rounded-lg shadow-sm border ${editingSchool ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
                            <h3 className="text-lg font-bold mb-4">
                                {editingSchool ? `Edit School: ${editingSchool.name}` : 'Add New School'}
                            </h3>
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="name" value="School Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="district_id" value="District" />
                                    <select
                                        id="district_id"
                                        value={data.district_id}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('district_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a district</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>{district.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.district_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="year_founded" value="Year Founded" />
                                    <TextInput
                                        id="year_founded"
                                        type="number"
                                        value={data.year_founded}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('year_founded', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.year_founded} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="school_type" value="School Type" />
                                    <select
                                        id="school_type"
                                        value={data.school_type}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('school_type', e.target.value)}
                                        required
                                    >
                                        <option value="government">Government</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <InputError message={errors.school_type} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="principal_name" value="Principal Name" />
                                    <TextInput
                                        id="principal_name"
                                        type="text"
                                        value={data.principal_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('principal_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.principal_name} className="mt-2" />
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-2">
                                    <SecondaryButton onClick={cancelAction}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {editingSchool ? 'Update School' : 'Save School'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Schools List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {schools.map((school) => (
                                        <tr key={school.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{school.name}</div>
                                                <div className="text-sm text-gray-500">Founded: {school.year_founded}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {school.district.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.school_type === 'government' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                                    {school.school_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.is_approved ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {school.is_approved ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => startEditing(school)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleApproval(school.id)}
                                                    className={`text-sm ${school.is_approved ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} font-bold`}
                                                >
                                                    {school.is_approved ? 'Reject' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => deleteSchool(school.id)}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
