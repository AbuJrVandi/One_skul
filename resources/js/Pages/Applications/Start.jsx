import { Link, Head } from '@inertiajs/react';

export default function Start({ school }) {
    const categories = [
        { id: 'primary', label: 'Primary (Class 1-6)', desc: 'For pupils aged 6-11 years entering basic education.', icon: '👶' },
        { id: 'jss', label: 'Junior Secondary (JSS 1-3)', desc: 'For students transitioning from primary school.', icon: '📘' },
        { id: 'sss', label: 'Senior Secondary (SSS 1-3)', desc: 'For students preparing for WASSCE/NECO.', icon: '🎓' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Apply to ${school.name}`} />

            <div className="max-w-3xl w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-4xl font-extrabold text-blue-900">{school.name}</h2>
                    <p className="mt-2 text-lg text-gray-600">Online Student Admission Portal</p>
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        <span className="font-bold">Step 1:</span> Please select the class category you are applying for.
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={route('public.applications.form', { school: school.id, category: category.id })}
                            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center hover:border-blue-500 hover:ring-2 hover:ring-blue-500 focus:outline-none transition-all duration-200 group"
                        >
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</span>
                            <div className="text-center">
                                <span className="block text-lg font-medium text-gray-900">{category.label}</span>
                                <span className="block text-sm text-gray-500 mt-2">{category.desc}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already applied? <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">Check status</Link>
                </div>
            </div>
        </div>
    );
}
