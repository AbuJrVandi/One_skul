import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
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

                    {/* Classes Grid / Empty State */}
                    {Array.isArray(classes) && classes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {classes.map((cls) => (
                                <div key={cls.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cls.level === 'primary' ? 'bg-green-100 text-green-700' :
                                                cls.level === 'jss' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {cls.level}
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => startEditing(cls)} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit Class">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => deleteClass(cls.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Class">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAssigningClass(cls);
                                                        setSelectedTeachers(cls.teachers.map(t => t.id));
                                                    }}
                                                    className={`p-2.5 rounded-xl transition-all ${cls.teachers.length > 0 ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                    title="Assign Staff"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight tracking-tighter">{cls.name}</h3>
                                        <p className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest">{cls.students_count} Active Students</p>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {cls.teachers.length > 0 ? (
                                                cls.teachers.map((t) => (
                                                    <div key={t.id} className="flex items-center bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-[9px] text-white flex items-center justify-center mr-2 font-black shadow-md shadow-indigo-200">{t.name.charAt(0)}</div>
                                                        <span className="text-[11px] font-black text-indigo-700 uppercase tracking-tight">{t.name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setAssigningClass(cls);
                                                        setSelectedTeachers([]);
                                                    }}
                                                    className="w-full text-[10px] text-rose-500 font-black uppercase tracking-widest bg-rose-50 px-4 py-3 rounded-2xl border border-rose-100 cursor-pointer hover:bg-rose-100 transition-all text-center flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" /></svg>
                                                    Assign Teacher Now
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        href={route('principal.students.index', { class_id: cls.id })}
                                        className="w-full py-5 bg-gray-50 text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] text-center rounded-[1.5rem] hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-100 transition-all"
                                    >
                                        Enrollment Records
                                    </Link>

                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-[0.02] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.05] transition-opacity"></div>
                                </div>
                            ))}
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
