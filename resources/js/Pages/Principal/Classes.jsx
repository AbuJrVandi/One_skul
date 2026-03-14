import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Classes({ auth, classes = [], teachers = [] }) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        level: 'primary',
        teacher_ids: [],
    });

    const [isAdding, setIsAdding] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [assigningClass, setAssigningClass] = useState(null);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        if (editingClass) {
            patch(route('principal.classes.update', editingClass.id), {
                onSuccess: () => {
                    reset();
                    setEditingClass(null);
                },
            });
        } else {
            post(route('principal.classes.store'), {
                onSuccess: () => {
                    reset();
                    setIsAdding(false);
                },
            });
        }
    };

    const toggleTeacherInForm = (id) => {
        setData('teacher_ids',
            data.teacher_ids.includes(id)
                ? data.teacher_ids.filter(tId => tId !== id)
                : [...data.teacher_ids, id]
        );
    };

    const startEditing = (cls) => {
        setEditingClass(cls);
        setIsAdding(false);
        setData({
            name: cls.name,
            level: cls.level,
            teacher_ids: cls.teachers.map(t => t.id),
        });
    };

    const deleteClass = (id) => {
        if (confirm('Are you sure you want to delete this class? This will affect student assignments.')) {
            router.delete(route('principal.classes.destroy', id));
        }
    };

    const submitAssignment = () => {
        router.post(route('principal.classes.assign', assigningClass.id), {
            teacher_ids: selectedTeachers
        }, {
            onSuccess: () => setAssigningClass(null)
        });
    };

    const toggleTeacher = (id) => {
        setSelectedTeachers(prev =>
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        );
    };

    const cancelAction = () => {
        setIsAdding(false);
        setEditingClass(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Academic Structure</h2>
                    {!isAdding && !editingClass && (
                        <PrimaryButton onClick={() => setIsAdding(true)}>
                            Create New Class
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title="Manage Classes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Add/Edit Class Form */}
                    {(isAdding || editingClass) && (
                        <div className={`p-8 rounded-[2.5rem] shadow-xl border ${editingClass ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-gray-100'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                            <h3 className="text-2xl font-black mb-8 flex items-center">
                                <span className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                </span>
                                {editingClass ? `Modify ${editingClass.name}` : 'Establish New Class'}
                            </h3>
                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <InputLabel htmlFor="name" value="Official Class Name" className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2" />
                                        <TextInput
                                            id="name"
                                            value={data.name}
                                            className="block w-full !bg-gray-50/50 !border-gray-100 !py-4 focus:!ring-indigo-600 rounded-2xl"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="e.g. Senior Secondary 3"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="level" value="Academic Stream" className="text-xs uppercase font-black text-gray-400 tracking-widest mb-2" />
                                        <select
                                            id="level"
                                            value={data.level}
                                            className="block w-full border-gray-100 bg-gray-50/50 py-4 focus:ring-indigo-600 rounded-2xl font-bold text-gray-700"
                                            onChange={(e) => setData('level', e.target.value)}
                                            required
                                        >
                                            <option value="primary">Primary Section</option>
                                            <option value="jss">Junior Secondary (JSS)</option>
                                            <option value="sss">Senior Secondary (SSS)</option>
                                        </select>
                                        <InputError message={errors.level} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Assign Teachers (Faculties)" className="text-xs uppercase font-black text-gray-400 tracking-widest mb-4" />
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {teachers.map(t => (
                                            <div
                                                key={t.id}
                                                onClick={() => toggleTeacherInForm(t.id)}
                                                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${data.teacher_ids.includes(t.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-tight">{t.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {teachers.length === 0 && (
                                        <p className="text-xs text-rose-500 font-bold italic">No teachers registered yet. Please add teachers first.</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <SecondaryButton onClick={cancelAction} className="!rounded-2xl !py-4 !px-8">Discard</SecondaryButton>
                                    <PrimaryButton disabled={processing} className="!rounded-2xl !py-4 !px-10">
                                        {editingClass ? 'Apply Changes' : 'Confirm & Create'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Teacher Assignment Shortcut */}
                    {assigningClass && (
                        <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-white animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black italic">Assign Staff to {assigningClass.name}</h3>
                                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">Personnel Management</p>
                                </div>
                                <button onClick={() => setAssigningClass(null)} className="p-2 transition-all hover:rotate-90">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                                {teachers.map((teacher) => (
                                    <div
                                        key={teacher.id}
                                        onClick={() => toggleTeacher(teacher.id)}
                                        className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedTeachers.includes(teacher.id)
                                            ? 'bg-white text-indigo-900 border-white shadow-xl'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <span className="font-black text-xs uppercase tracking-tighter">{teacher.name}</span>
                                        {selectedTeachers.includes(teacher.id) && (
                                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-4">
                                <SecondaryButton onClick={() => setAssigningClass(null)} className="!bg-transparent !text-white !border-white/20 hover:!bg-white/10 !rounded-2xl">Cancel</SecondaryButton>
                                <button onClick={submitAssignment} className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all uppercase text-xs tracking-widest">
                                    Save Staff Config
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Classes List / Empty State */}
                    {Array.isArray(classes) && classes.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Class Directory</h3>
                                    <p className="text-sm text-gray-500">Manage classes, assign staff, and review enrollment.</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100 text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-widest">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-bold">Class</th>
                                            <th className="px-6 py-3 text-left font-bold">Level</th>
                                            <th className="px-6 py-3 text-left font-bold">Students</th>
                                            <th className="px-6 py-3 text-left font-bold">Teachers</th>
                                            <th className="px-6 py-3 text-right font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {classes.map((cls) => {
                                            const teacherNames = cls.teachers?.map((t) => t.name) ?? [];
                                            const visibleTeachers = teacherNames.slice(0, 2);
                                            const extraTeachers = teacherNames.length - visibleTeachers.length;

                                            return (
                                                <tr key={cls.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-semibold text-gray-900">{cls.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${cls.level === 'primary' ? 'bg-green-100 text-green-700' :
                                                            cls.level === 'jss' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                                                            }`}>
                                                            {cls.level}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{cls.students_count}</td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {teacherNames.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {visibleTeachers.map((name) => (
                                                                    <span key={name} className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                                        {name}
                                                                    </span>
                                                                ))}
                                                                {extraTeachers > 0 && (
                                                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                                                                        +{extraTeachers} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No teachers assigned</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => startEditing(cls)}
                                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAssigningClass(cls);
                                                                setSelectedTeachers(cls.teachers.map((t) => t.id));
                                                            }}
                                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                                                        >
                                                            Assign
                                                        </button>
                                                        <Link
                                                            href={route('principal.students.index', { class_id: cls.id })}
                                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
                                                        >
                                                            Records
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteClass(cls.id)}
                                                            className="inline-flex items-center px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white py-32 px-10 rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-10 font-black text-5xl rotate-3 hover:rotate-0 transition-transform duration-500">?</div>
                            <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Academic Structure Pending</h3>
                            <p className="max-w-md text-gray-500 font-bold text-lg mb-12 leading-relaxed">
                                Your school currently has no defined classrooms. Please establish your classes to begin student enrollment and staff assignments.
                            </p>
                            {!isAdding && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-indigo-600 text-white py-5 px-12 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:scale-105 hover:bg-indigo-700 transition-all flex items-center gap-3"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="4" /></svg>
                                    Engineer Your School
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
