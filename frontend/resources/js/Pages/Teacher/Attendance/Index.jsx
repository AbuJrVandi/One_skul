import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Added router
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput'; // Added TextInput

export default function AttendanceIndex({ auth, schoolClass, students, date, attendanceData, stats }) {
    // Initialize form with existing data or defaults
    const getInitialAttendance = () => {
        return students.map(student => ({
            student_id: student.id,
            status: attendanceData[student.id]?.status || 'present',
            remarks: attendanceData[student.id]?.remarks || ''
        }));
    };

    const { data, setData, post, processing, errors } = useForm({
        date: date,
        attendance: getInitialAttendance(),
    });

    const handleStatusChange = (index, status) => {
        const newAttendance = [...data.attendance];
        newAttendance[index].status = status;
        setData('attendance', newAttendance);
    };

    const handleRemarksChange = (index, remarks) => {
        const newAttendance = [...data.attendance];
        newAttendance[index].remarks = remarks;
        setData('attendance', newAttendance);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.class.attendance.store', schoolClass.id), {
            preserveScroll: true,
        });
    };

    const handleDateChange = (newDate) => {
        router.get(
            route('teacher.class.attendance.index', schoolClass.id),
            { date: newDate },
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">Daily Attendance</h2>
                        <p className="text-sm text-gray-500">{schoolClass.name}</p>
                    </div>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-widest bg-white p-2 rounded-xl shadow-sm">
                        <div className="text-green-600">Present: {stats.present}</div>
                        <div className="text-red-500">Absent: {stats.absent}</div>
                        <div className="text-orange-500">Late: {stats.late}</div>
                    </div>
                </div>
            }
        >
            <Head title={`Attendance - ${schoolClass.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-3xl border border-gray-100 p-8">

                        {/* Date Selector */}
                        <div className="mb-8 flex items-center gap-4">
                            <label className="font-bold text-gray-700">Select Date:</label>
                            <TextInput
                                type="date"
                                value={data.date}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            />
                        </div>

                        <form onSubmit={submit}>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                            {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {['present', 'absent', 'late', 'excused'].map((statusOption) => (
                                                            <button
                                                                key={statusOption}
                                                                type="button"
                                                                onClick={() => handleStatusChange(index, statusOption)}
                                                                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${data.attendance[index].status === statusOption
                                                                    ? statusOption === 'present' ? 'bg-green-500 text-white shadow-md'
                                                                        : statusOption === 'absent' ? 'bg-red-500 text-white shadow-md'
                                                                            : statusOption === 'late' ? 'bg-orange-400 text-white shadow-md'
                                                                                : 'bg-blue-400 text-white shadow-md'
                                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {statusOption.charAt(0)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <TextInput
                                                        value={data.attendance[index].remarks}
                                                        onChange={(e) => handleRemarksChange(index, e.target.value)}
                                                        className="w-full text-sm border-gray-200"
                                                        placeholder="Optional note..."
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-gray-100 shadow-lg">
                                <SecondaryButton onClick={() => window.history.back()}>Cancel</SecondaryButton>
                                <PrimaryButton disabled={processing} className="px-8">{processing ? 'Saving...' : 'Save Attendance'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
