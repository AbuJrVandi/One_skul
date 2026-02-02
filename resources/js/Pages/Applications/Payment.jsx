import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Payment({ school, application }) {
    const { post, processing } = useForm({
        payment_method: 'bank_transfer',
    });
    const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

    const submit = (e) => {
        e.preventDefault();
        post(route('public.applications.pay', { school: school.id, ref: application.application_reference }), {
            data: { payment_method: selectedMethod }
        });
    };

    const fee = 5000; // Fixed fee for now

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
            <Head title="Application Payment" />

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{school.name}</h1>
                    <p className="text-emerald-100 mt-1">Application Fee Payment</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                        <span className="text-emerald-50 text-xs uppercase font-bold tracking-wider">Reference</span>
                        <span className="font-mono font-bold">{application.application_reference}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Step 4 of 5</span>
                        <span className="font-medium text-emerald-600">Secure Payment</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8">
                        {/* Application Summary */}
                        <div className="text-center mb-10">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Payment Amount</p>
                            <div className="flex items-center justify-center text-5xl font-extrabold text-gray-900 mt-2">
                                <span className="text-2xl text-gray-400 mr-1">₦</span>
                                {fee.toLocaleString()}
                                <span className="text-2xl text-gray-400 ml-1">.00</span>
                            </div>
                            <p className="mt-2 text-gray-500">
                                Application for {application.first_name} {application.last_name}
                            </p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                {application.class_category_label} • {application.class_level?.replace('-', ' ').toUpperCase()}
                            </div>
                        </div>

                        <form onSubmit={submit} className="max-w-xl mx-auto space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>

                            <div className="space-y-4">
                                {/* Bank Transfer Option */}
                                <label className={`relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedMethod === 'bank_transfer'
                                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="bank_transfer"
                                        checked={selectedMethod === 'bank_transfer'}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="h-12 w-12 flex items-center justify-center bg-white rounded-lg border border-gray-100 shadow-sm text-2xl mr-4">
                                        🏦
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900">Bank Transfer</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Direct transfer to School Account</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'bank_transfer' ? 'border-emerald-500' : 'border-gray-300'
                                        }`}>
                                        {selectedMethod === 'bank_transfer' && (
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        )}
                                    </div>
                                </label>

                                {/* Card Payment Option */}
                                <label className={`relative flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedMethod === 'card'
                                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="card"
                                        checked={selectedMethod === 'card'}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="h-12 w-12 flex items-center justify-center bg-white rounded-lg border border-gray-100 shadow-sm text-2xl mr-4">
                                        💳
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900">Card Payment</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Secure payment via Paystack / Flutterwave</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-emerald-500' : 'border-gray-300'
                                        }`}>
                                        {selectedMethod === 'card' && (
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        )}
                                    </div>
                                </label>
                            </div>

                            {/* Payment Notice */}
                            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 flex gap-3">
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p>
                                    Your payment is secure. By clicking the button below, your application will be formally submitted for review by the school administration.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-emerald-500/30 text-base font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        Pay ₦{fee.toLocaleString()} & Submit Application
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
