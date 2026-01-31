import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Payment({ school, application }) {
    const { post, processing } = useForm();
    const [method, setMethod] = useState('bank_transfer');

    const submit = (e) => {
        e.preventDefault();
        // In a real app, this would integrate with a payment gateway.
        // Here we just mark as submitted.
        post(route('public.applications.pay', { school: school.id, ref: application.application_reference }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Application Payment" />

            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-900 py-6 px-8 text-white">
                    <h2 className="text-xl font-bold">Application Fee Payment</h2>
                    <p className="text-gray-400 text-sm mt-1">Ref: {application.application_reference}</p>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-3xl font-bold text-gray-900">₦ 5,000.00</p>
                        <p className="text-sm text-gray-500">Standard Application Fee ({application.class_category.toUpperCase()})</p>
                    </div>

                    <div className="space-y-4">
                        <div onClick={() => setMethod('bank_transfer')}
                            className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${method === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">🏦</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Bank Transfer</p>
                                    <p className="text-xs text-gray-500">Direct transfer to School Account</p>
                                </div>
                            </div>
                            {method === 'bank_transfer' && <span className="text-blue-600 font-bold">✓</span>}
                        </div>

                        <div onClick={() => setMethod('card')}
                            className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">💳</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Card Payment</p>
                                    <p className="text-xs text-gray-500">Paystact / Flutterwave</p>
                                </div>
                            </div>
                            {method === 'card' && <span className="text-blue-600 font-bold">✓</span>}
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={submit}
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {processing ? 'Processing...' : `Pay & Submit Application`}
                        </button>
                        <p className="mt-4 text-center text-xs text-gray-400">
                            * By clicking Pay, your application will be formally submitted for review.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
