import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, districts }) {
    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        name: '',
    });

    const [editingDistrict, setEditingDistrict] = useState(null);
    const { data: editData, setData: setEditData, patch, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
    });

    const submitAdd = (e) => {
        e.preventDefault();
        post(route('admin.districts.store'), {
            onSuccess: () => addReset(),
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        patch(route('admin.districts.update', editingDistrict.id), {
            onSuccess: () => {
                setEditingDistrict(null);
                editReset();
            },
        });
    };

    const deleteDistrict = (id) => {
        if (confirm('Are you sure you want to delete this district? This will also delete all schools in this district.')) {
            router.delete(route('admin.districts.destroy', id));
        }
    };

    const startEditing = (district) => {
        setEditingDistrict(district);
        setEditData('name', district.name);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage Districts</h2>}
        >
            <Head title="Manage Districts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Add District Form */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Add New District</h3>
                        <form onSubmit={submitAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <InputLabel htmlFor="name" value="District Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={addData.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setAddData('name', e.target.value)}
                                    placeholder="Enter district name"
                                />
                                <InputError message={addErrors.name} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={addProcessing}>
                                Add District
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Edit District Form (Conditional) */}
                    {editingDistrict && (
                        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                            <h3 className="text-lg font-bold mb-4 text-blue-900">Edit District: {editingDistrict.name}</h3>
                            <form onSubmit={submitEdit} className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <InputLabel htmlFor="edit_name" value="District Name" />
                                    <TextInput
                                        id="edit_name"
                                        type="text"
                                        value={editData.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={editErrors.name} className="mt-2" />
                                </div>
                                <div className="flex gap-2">
                                    <PrimaryButton disabled={editProcessing}>
                                        Update
                                    </PrimaryButton>
                                    <SecondaryButton onClick={() => setEditingDistrict(null)}>
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Districts List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schools Count</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {districts.map((district) => (
                                    <tr key={district.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.schools_count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                            <button
                                                onClick={() => startEditing(district)}
                                                className="text-indigo-600 hover:text-indigo-900 font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteDistrict(district.id)}
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
        </AuthenticatedLayout>
    );
}
