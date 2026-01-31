import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function StudentGrades({ auth, student, grades }) {
    // Group grades by Term
    const gradesByTerm = grades.reduce((acc, grade) => {
        const termName = grade.term?.name || 'Uncategorized';
        if (!acc[termName]) acc[termName] = [];
        acc[termName].push(grade);
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-2xl text-gray-900 leading-tight">My Report Card</h2>}
        >
            <Head title="My Grades" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {Object.keys(gradesByTerm).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-bold">
                            No grades recorded yet.
                        </div>
                    ) : (
                        Object.entries(gradesByTerm).map(([termName, termGrades]) => (
                            <div key={termName} className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100 p-8">
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                    <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
                                    {termName}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {termGrades.map(grade => (
                                        <div key={grade.id} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <div className="text-6xl font-black text-indigo-900">{grade.score}</div>
                                            </div>

                                            <div className="relative z-10">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{grade.subject.code}</div>
                                                <div className="text-lg font-black text-indigo-900 mb-4">{grade.subject.name}</div>

                                                <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                                                    <div>
                                                        <div className="text-xs text-gray-400 font-medium">Score</div>
                                                        <div className={`text-2xl font-black ${grade.score >= 70 ? 'text-green-600' :
                                                                grade.score >= 50 ? 'text-orange-500' : 'text-red-500'
                                                            }`}>
                                                            {grade.score}%
                                                        </div>
                                                    </div>
                                                    {grade.remarks && (
                                                        <div className="text-right max-w-[60%]">
                                                            <div className="text-xs text-gray-400 font-medium">Remarks</div>
                                                            <div className="text-sm font-bold text-gray-600 italic">"{grade.remarks}"</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
