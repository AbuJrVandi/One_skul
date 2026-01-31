import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ClassAssignment({ auth, classes, subjects }) {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [saving, setSaving] = useState(false);

    const openClassModal = (schoolClass) => {
        setSelectedClass(schoolClass);
        setSelectedSubjects(schoolClass.assigned_subjects || []);
    };

    const closeModal = () => {
        setSelectedClass(null);
        setSelectedSubjects([]);
    };

    const toggleSubject = (subjectId) => {
        if (selectedSubjects.includes(subjectId)) {
            setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
        } else {
            setSelectedSubjects([...selectedSubjects, subjectId]);
        }
    };

    const saveAssignments = () => {
        setSaving(true);
        router.post(route('principal.classes.assign-subjects', selectedClass.id), {
            subject_ids: selectedSubjects
        }, {
            onSuccess: () => {
                setSaving(false);
                closeModal();
            },
            onError: () => {
                setSaving(false);
            }
        });
    };

    const getLevelBadge = (level) => {
        const badges = {
            'primary': 'bg-green-100 text-green-800',
            'jss': 'bg-blue-100 text-blue-800',
            'sss': 'bg-purple-100 text-purple-800',
        };
        return badges[level] || 'bg-gray-100 text-gray-800';
    };

    const getSubjectsForLevel = (level) => {
        return subjects.filter(s => s.level === level || s.level === 'all');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Assign Subjects to Classes</h2>}
        >
            <Head title="Subject Assignment - School Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link
                            href={route('principal.subjects.index')}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Subjects
                        </Link>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-indigo-800">
                                Assign subjects to each class in your school.
                            </p>
                            <p className="text-sm text-indigo-600">
                                Only enabled subjects can be assigned. Teachers will see assigned subjects when entering grades.
                            </p>
                        </div>
                    </div>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((schoolClass) => (
                            <div
                                key={schoolClass.id}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-black text-xl text-gray-900">{schoolClass.name}</h3>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${getLevelBadge(schoolClass.level)}`}>
                                            {schoolClass.level}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">Assigned Subjects:</p>
                                    <p className="text-2xl font-black text-indigo-600">
                                        {schoolClass.assigned_subjects?.length || 0}
                                        <span className="text-sm font-normal text-gray-400 ml-2">
                                            / {getSubjectsForLevel(schoolClass.level).length} available
                                        </span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => openClassModal(schoolClass)}
                                    className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                                >
                                    Manage Subjects
                                </button>
                            </div>
                        ))}
                    </div>

                    {classes.length === 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No classes found</h3>
                            <p className="text-gray-500 mb-6">Create classes first to assign subjects.</p>
                            <Link
                                href={route('principal.classes.index')}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                            >
                                Manage Classes
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>

                        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-3xl">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">
                                            Assign Subjects to {selectedClass.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Select subjects to offer in this class
                                        </p>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="px-8 py-6 max-h-96 overflow-y-auto">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">
                                        {selectedSubjects.length} selected
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedSubjects(getSubjectsForLevel(selectedClass.level).map(s => s.id))}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                        >
                                            Select All
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            onClick={() => setSelectedSubjects([])}
                                            className="text-xs font-bold text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {getSubjectsForLevel(selectedClass.level).map((subject) => (
                                        <label
                                            key={subject.id}
                                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedSubjects.includes(subject.id)
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSubjects.includes(subject.id)}
                                                onChange={() => toggleSubject(subject.id)}
                                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 flex-1">
                                                <span className="font-bold text-gray-900">{subject.name}</span>
                                                {subject.code && (
                                                    <span className="ml-2 text-sm text-gray-400 font-mono">({subject.code})</span>
                                                )}
                                            </span>
                                            {subject.level !== 'all' && (
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getLevelBadge(subject.level)}`}>
                                                    {subject.level}
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {getSubjectsForLevel(selectedClass.level).length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No subjects available for this level.</p>
                                        <p className="text-sm">Enable subjects from the Subjects page first.</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton
                                    onClick={saveAssignments}
                                    disabled={saving}
                                    className="!bg-indigo-600 hover:!bg-indigo-700"
                                >
                                    {saving ? 'Saving...' : 'Save Assignments'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
