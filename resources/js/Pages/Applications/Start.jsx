import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Start({ school }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);

    const categories = [
        {
            id: 'primary',
            label: 'Primary School',
            subtitle: 'Class 1 - 6',
            desc: 'For pupils aged 6-11 years entering basic education.',
            icon: '🎒',
            gradient: 'from-emerald-500 to-teal-600',
            classes: [
                { id: 'class-1', name: 'Class 1' },
                { id: 'class-2', name: 'Class 2' },
                { id: 'class-3', name: 'Class 3' },
                { id: 'class-4', name: 'Class 4' },
                { id: 'class-5', name: 'Class 5' },
                { id: 'class-6', name: 'Class 6' },
            ]
        },
        {
            id: 'jss',
            label: 'Junior Secondary',
            subtitle: 'JSS 1 - 3',
            desc: 'For students transitioning from primary school.',
            icon: '📚',
            gradient: 'from-blue-500 to-indigo-600',
            classes: [
                { id: 'jss-1', name: 'JSS 1' },
                { id: 'jss-2', name: 'JSS 2' },
                { id: 'jss-3', name: 'JSS 3' },
            ]
        },
        {
            id: 'sss',
            label: 'Senior Secondary',
            subtitle: 'SSS 1 - 3',
            desc: 'For students preparing for WASSCE/NECO examinations.',
            icon: '🎓',
            gradient: 'from-purple-500 to-pink-600',
            classes: [
                { id: 'sss-1', name: 'SSS 1' },
                { id: 'sss-2', name: 'SSS 2' },
                { id: 'sss-3', name: 'SSS 3' },
            ]
        },
    ];

    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <Head title={`Apply to ${school.name}`} />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-4xl w-full text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Online Application Portal
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {school.name}
                    </h1>

                    {school.district && (
                        <p className="text-lg text-blue-200/80 mb-2">{school.district}</p>
                    )}

                    <p className="text-xl text-blue-100/60">
                        Begin your admission journey with us
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="max-w-3xl w-full mb-10">
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">1</div>
                            <span className="ml-2 text-white font-medium hidden sm:block">Select Class</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white/10 text-white/40 flex items-center justify-center font-bold text-sm">2</div>
                            <span className="ml-2 text-white/40 font-medium hidden sm:block">Fill Form</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white/10 text-white/40 flex items-center justify-center font-bold text-sm">3</div>
                            <span className="ml-2 text-white/40 font-medium hidden sm:block">Review</span>
                        </div>
                        <div className="w-12 h-0.5 bg-white/20"></div>
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white/10 text-white/40 flex items-center justify-center font-bold text-sm">4</div>
                            <span className="ml-2 text-white/40 font-medium hidden sm:block">Submit</span>
                        </div>
                    </div>
                </div>

                {/* Category Selection */}
                <div className="max-w-4xl w-full">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                        <h2 className="text-2xl font-semibold text-white text-center mb-2">
                            Select Your Class Category
                        </h2>
                        <p className="text-blue-200/60 text-center mb-8">
                            Choose the educational level you're applying for
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelectedCategory(category.id);
                                        setSelectedClass(null);
                                    }}
                                    className={`relative rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                                            ? `bg-gradient-to-br ${category.gradient} shadow-xl shadow-${category.gradient.split('-')[1]}-500/25`
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {selectedCategory === category.id && (
                                        <div className="absolute top-4 right-4">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="text-4xl mb-4 block">{category.icon}</span>
                                    <h3 className="text-xl font-bold text-white mb-1">{category.label}</h3>
                                    <p className="text-sm text-white/60 font-medium mb-2">{category.subtitle}</p>
                                    <p className="text-sm text-white/40">{category.desc}</p>
                                </button>
                            ))}
                        </div>

                        {/* Class Level Selection */}
                        {selectedCategory && selectedCategoryData && (
                            <div className="mt-8 pt-8 border-t border-white/10 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-white text-center mb-4">
                                    Select Specific Class
                                </h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {selectedCategoryData.classes.map((cls) => (
                                        <button
                                            key={cls.id}
                                            onClick={() => setSelectedClass(cls.id)}
                                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${selectedClass === cls.id
                                                    ? 'bg-white text-slate-900 shadow-lg'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {cls.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Continue Button */}
                        {selectedCategory && selectedClass && (
                            <div className="mt-8 flex justify-center animate-fadeIn">
                                <Link
                                    href={route('public.applications.form', {
                                        school: school.id,
                                        category: selectedCategory,
                                        class: selectedClass
                                    })}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                                >
                                    Continue to Application Form
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-12 text-center">
                    <p className="text-blue-200/40 text-sm">
                        Already submitted an application?{' '}
                        <a href="#" className="text-blue-300 hover:text-blue-200 underline">Check your status</a>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
