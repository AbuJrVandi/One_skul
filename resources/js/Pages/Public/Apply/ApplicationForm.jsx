import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ApplicationForm({ school }) {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        previous_school: '',
        grade_applying_for: '',
        terms: false,
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submit = (e) => {
        e.preventDefault();
        post(route('apply.submit', school.id), {
            onError: (errors) => {
                console.error('Submission errors:', errors);
                // If there are errors, we should probably go back to the first step or show them.
                // Since we don't know which step the error is on easily without mapping, 
                // let's show a global alert and go to step 1 so they can check.
                alert('Please check your application details. There are invalid fields.');
                // Optional: rudimentary logic to find first error step
                if (errors.first_name || errors.last_name || errors.email || errors.phone || errors.date_of_birth || errors.gender || errors.address) {
                    setStep(1);
                } else if (errors.guardian_name || errors.guardian_phone || errors.guardian_email || errors.previous_school || errors.grade_applying_for) {
                    setStep(2);
                } else if (errors.terms) {
                    setStep(3);
                }
            }
        });
    };

    const steps = [
        { id: 1, title: 'Student Info' },
        { id: 2, title: 'Guardian Info & Academic' },
        { id: 3, title: 'Review & Terms' },
        { id: 4, title: 'Payment' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Apply to ${school.name}`} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">New Application</p>
                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">{school.name}</h1>
                    <p className="mt-2 text-lg text-gray-500">{school.district.name} District</p>
                </div>

                {/* Progress Steps */}
                <nav aria-label="Progress" className="mb-10">
                    <ol role="list" className="flex items-center">
                        {steps.map((s, index) => (
                            <li key={s.id} className={`${index !== steps.length - 1 ? 'w-full pr-8 sm:pr-20' : ''} relative`}>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className={`h-0.5 w-full ${step > s.id ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                </div>
                                <a
                                    href="#"
                                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step >= s.id ? 'bg-indigo-600 hover:bg-indigo-900' : 'bg-gray-200 hover:bg-gray-300'
                                        } transition-colors`}
                                    onClick={(e) => { e.preventDefault(); if (step > s.id) setStep(s.id); }}
                                >
                                    <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
                                    <span className="sr-only">{s.title}</span>
                                </a>
                                <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium w-max ${step === s.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {s.title}
                                </span>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel value="First Name" />
                                        <TextInput className="w-full mt-1" value={data.first_name} onChange={e => setData('first_name', e.target.value)} />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Last Name" />
                                        <TextInput className="w-full mt-1" value={data.last_name} onChange={e => setData('last_name', e.target.value)} />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Email" />
                                        <TextInput type="email" className="w-full mt-1" value={data.email} onChange={e => setData('email', e.target.value)} />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="phone" />
                                        <TextInput className="w-full mt-1" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Date of Birth" />
                                        <TextInput type="date" className="w-full mt-1" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />
                                        <InputError message={errors.date_of_birth} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Gender" />
                                        <select className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <InputError message={errors.gender} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel value="Address" />
                                        <textarea className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" value={data.address} onChange={e => setData('address', e.target.value)} />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Guardian & Academic Info</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputLabel value="Guardian Name" />
                                        <TextInput className="w-full mt-1" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)} />
                                        <InputError message={errors.guardian_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Guardian Phone" />
                                        <TextInput className="w-full mt-1" value={data.guardian_phone} onChange={e => setData('guardian_phone', e.target.value)} />
                                        <InputError message={errors.guardian_phone} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Guardian Email (Optional)" />
                                        <TextInput type="email" className="w-full mt-1" value={data.guardian_email} onChange={e => setData('guardian_email', e.target.value)} />
                                        <InputError message={errors.guardian_email} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2 border-t pt-4 mt-2">
                                        <h3 className="font-semibold text-gray-700 mb-4">Academic History</h3>
                                    </div>
                                    <div>
                                        <InputLabel value="Previous School" />
                                        <TextInput className="w-full mt-1" value={data.previous_school} onChange={e => setData('previous_school', e.target.value)} />
                                        <InputError message={errors.previous_school} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Grade Applying For" />
                                        <select className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" value={data.grade_applying_for} onChange={e => setData('grade_applying_for', e.target.value)}>
                                            <option value="">Select Grade</option>
                                            <option value="Grade 1">Grade 1</option>
                                            <option value="Grade 2">Grade 2</option>
                                            <option value="JSS 1">JSS 1</option>
                                            <option value="SSS 1">SSS 1</option>
                                        </select>
                                        <InputError message={errors.grade_applying_for} className="mt-2" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Review Application</h2>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><span className="text-gray-500">Name:</span> <p className="font-semibold">{data.first_name} {data.last_name}</p></div>
                                        <div><span className="text-gray-500">Email:</span> <p className="font-semibold">{data.email}</p></div>
                                        <div><span className="text-gray-500">Grade:</span> <p className="font-semibold">{data.grade_applying_for}</p></div>
                                        <div><span className="text-gray-500">Guardian:</span> <p className="font-semibold">{data.guardian_name}</p></div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            checked={data.terms}
                                            onChange={(e) => setData('terms', e.target.checked)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-medium text-gray-700">I agree to the Terms and Conditions</label>
                                        <p className="text-gray-500">I confirm all information is accurate and I agree to the school's enrollment policies.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900">Application Payment</h2>
                                <div className="border border-green-200 bg-green-50 p-6 rounded-xl">
                                    <h3 className="text-green-800 font-semibold mb-2">Application Fee: $50.00</h3>
                                    <p className="text-sm text-green-700 mb-4">Please select a payment method to complete your application.</p>

                                    <div className="space-y-3">
                                        <label className="flex items-center p-4 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-indigo-500 transition-colors">
                                            <input type="radio" name="payment" className="bg-slate-900 border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                                            <span className="ml-3 font-medium">Credit/Debit Card (Mock)</span>
                                        </label>
                                        <label className="flex items-center p-4 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-indigo-500 transition-colors">
                                            <input type="radio" name="payment" className="bg-slate-900 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="ml-3 font-medium">Bank Transfer (Mock)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                        {step > 1 ? (
                            <SecondaryButton onClick={prevStep}>Back</SecondaryButton>
                        ) : (
                            <div></div>
                        )}

                        {step < 4 ? (
                            <PrimaryButton onClick={nextStep} disabled={step === 3 && !data.terms}>Next</PrimaryButton>
                        ) : (
                            <PrimaryButton onClick={submit} className={`ml-4 ${processing ? 'opacity-25' : ''}`} disabled={processing}>
                                Submit Application
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
