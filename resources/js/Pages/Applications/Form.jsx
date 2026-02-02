import { useForm, Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Form({ school, category, classLevel, classLevels }) {
    const { data, setData, post, processing, errors } = useForm({
        class_category: category,
        class_level: classLevel || '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        // Conditional fields
        email: '',
        previous_school: '',
        primary_school: '',
        bece_index_number: '',
        subject_interests: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('public.applications.store', school.id));
    };

    const isPrimary = category === 'primary';
    const isJSS = category === 'jss';
    const isSSS = category === 'sss';

    const categoryLabels = {
        primary: 'Primary School',
        jss: 'Junior Secondary School',
        sss: 'Senior Secondary School'
    };

    const InputField = ({ label, name, type = 'text', required = false, placeholder = '', helper = '', ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                required={required}
                {...props}
            />
            {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
        </div>
    );

    const TextAreaField = ({ label, name, required = false, placeholder = '', rows = 3, helper = '' }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                value={data[name]}
                onChange={e => setData(name, e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                required={required}
            />
            {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Head title="Application Form" />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href={route('public.applications.start', school.id)}
                        className="inline-flex items-center text-blue-200 hover:text-white text-sm mb-4"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Category Selection
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{school.name}</h1>
                    <p className="text-blue-200 mt-1">Student Application Form</p>

                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                        <span className="text-white font-medium">{categoryLabels[category]}</span>
                        {classLevel && (
                            <>
                                <span className="text-blue-300">•</span>
                                <span className="text-blue-200">{classLevels?.find(c => c.id === classLevel)?.name || classLevel}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Step 2 of 5</span>
                        <span className="font-medium text-blue-600">Fill Application Details</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {errors.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {errors.error}
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    {/* Hidden Fields */}
                    <input type="hidden" name="class_category" value={data.class_category} />

                    {/* Class Level Selection (if not selected) */}
                    {!classLevel && classLevels && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                                Select Class Level
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {classLevels.map((cls) => (
                                    <button
                                        key={cls.id}
                                        type="button"
                                        onClick={() => setData('class_level', cls.id)}
                                        className={`p-4 rounded-xl border-2 font-medium transition-all ${data.class_level === cls.id
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-blue-300 text-gray-700'
                                            }`}
                                    >
                                        {cls.name}
                                    </button>
                                ))}
                            </div>
                            {errors.class_level && <p className="mt-2 text-sm text-red-600">{errors.class_level}</p>}
                        </div>
                    )}

                    {/* Section 1: Student Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                {classLevel ? '1' : '2'}
                            </span>
                            Student Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="First Name"
                                name="first_name"
                                required
                                placeholder="e.g. John"
                                helper="As it appears on birth certificate"
                            />
                            <InputField
                                label="Last Name"
                                name="last_name"
                                required
                                placeholder="e.g. Doe"
                            />
                            <InputField
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                required
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4 mt-2">
                                    {['male', 'female'].map((g) => (
                                        <label
                                            key={g}
                                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.gender === g
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={data.gender === g}
                                                onChange={e => setData('gender', e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className="text-xl">{g === 'male' ? '👦' : '👧'}</span>
                                            <span className="font-medium capitalize">{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {!isPrimary && (
                            <div className="mt-6">
                                <InputField
                                    label="Student Email"
                                    name="email"
                                    type="email"
                                    placeholder="student@email.com"
                                    helper="Optional - for receiving notifications"
                                />
                            </div>
                        )}

                        <div className="mt-6">
                            <TextAreaField
                                label="Home Address"
                                name="address"
                                required
                                placeholder="Enter full residential address"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Section 2: Guardian Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                                {classLevel ? '2' : '3'}
                            </span>
                            Parent / Guardian Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Guardian Full Name"
                                name="guardian_name"
                                required
                                placeholder="e.g. Mr. James Doe"
                            />
                            <InputField
                                label="Guardian Phone Number"
                                name="guardian_phone"
                                type="tel"
                                required
                                placeholder="e.g. +234 801 234 5678"
                            />
                            <div className="md:col-span-2">
                                <InputField
                                    label="Guardian Email"
                                    name="guardian_email"
                                    type="email"
                                    placeholder="guardian@email.com"
                                    helper="For important communications regarding the application"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Academic Background (for JSS/SSS) */}
                    {!isPrimary && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                                    {classLevel ? '3' : '4'}
                                </span>
                                Academic Background
                            </h3>

                            <div className="space-y-6">
                                <InputField
                                    label="Previous School Attended"
                                    name="previous_school"
                                    required
                                    placeholder="Name of last school attended"
                                />

                                {isSSS && (
                                    <>
                                        <InputField
                                            label="BECE Index Number"
                                            name="bece_index_number"
                                            required
                                            placeholder="e.g. 1234567890"
                                            helper="Your Basic Education Certificate Examination index number"
                                        />
                                        <TextAreaField
                                            label="Subject Area Interests"
                                            name="subject_interests"
                                            required
                                            placeholder="e.g. Science (Physics, Chemistry, Biology) or Arts (Literature, Government, Economics)"
                                            helper="What subjects are you most interested in?"
                                            rows={2}
                                        />
                                    </>
                                )}

                                {isJSS && (
                                    <InputField
                                        label="Primary School Attended"
                                        name="primary_school"
                                        placeholder="Name of primary school (optional)"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Please review all information before proceeding. You will be able to review everything on the next page.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Review
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
