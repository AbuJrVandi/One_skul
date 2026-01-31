import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

export default function GradesIndex({ auth, schoolClass, students, subjects, terms, filters, existingGrades }) {
    // Helper to find existing grade for a student
    const getGrade = (studentId) => existingGrades[studentId] || { score: '', remarks: '' };

    const { data, setData, post, processing, errors } = useForm({
        subject_id: filters.subject_id || '',
        term_id: filters.term_id || '',
        grades: students.map(student => ({
            student_id: student.id,
            score: getGrade(student.id).score,
            remarks: getGrade(student.id).remarks
        }))
    });

    // Update local state when filters change, but we actually need to reload page to let backend fetch `existingGrades`
    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        router.get(
            route('teacher.class.grades.index', schoolClass.id),
            newFilters,
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleGradeChange = (index, field, value) => {
        const newGrades = [...data.grades];
        newGrades[index][field] = value;
        setData('grades', newGrades);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.class.grades.store', schoolClass.id), {
            preserveScroll: true,
            onSuccess: () => alert('Grades saved successfully!')
        });
    };

    const isReadyToGrade = filters.subject_id && filters.term_id;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">
                    Grading: {schoolClass.name}
                </h2>
            }
        >
            <Head title={`Grades - ${schoolClass.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100 p-8">

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <select
                                    value={filters.subject_id || ''}
                                    onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Subject...</option>
                                    {subjects.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Term</label>
                                <select
                                    value={filters.term_id || ''}
                                    onChange={(e) => handleFilterChange('term_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select Term...</option>
                                    {terms.map(term => (
                                        <option key={term.id} value={term.id}>{term.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!isReadyToGrade ? (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold text-lg">Please select a Subject and Term to begin grading.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit}>
                                <div className="overflow-x-auto rounded-xl border border-gray-100 mb-8">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Score (0-100)</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map((student, index) => (
                                                <tr key={student.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-900">{student.first_name} {student.last_name}</div>
                                                        <div className="text-xs text-gray-500">{student.index_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <TextInput
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={data.grades[index].score}
                                                            onChange={(e) => handleGradeChange(index, 'score', e.target.value)}
                                                            className="w-full font-mono font-bold"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <TextInput
                                                            value={data.grades[index].remarks}
                                                            onChange={(e) => handleGradeChange(index, 'remarks', e.target.value)}
                                                            className="w-full text-sm"
                                                            placeholder="Excellent, Needs improvement..."
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end gap-3 sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-gray-100 shadow-lg">
                                    <SecondaryButton onClick={() => window.history.back()}>Cancel</SecondaryButton>
                                    <PrimaryButton disabled={processing} className="px-8">{processing ? 'Saving...' : 'Save Grades'}</PrimaryButton>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
