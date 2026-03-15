import { Link, usePage } from '@inertiajs/react';

export default function ApplicantLayout({ title, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <Link href="/" className="font-black text-lg tracking-tight text-indigo-700">
                            One-Skul Applicant
                        </Link>
                        <div className="flex items-center gap-4 text-sm font-semibold">
                            <Link href={route('applicant.dashboard')} className="hover:text-indigo-600">
                                Dashboard
                            </Link>
                            <Link href={route('applicant.schools.index')} className="hover:text-indigo-600">
                                Apply to a School
                            </Link>
                            <Link href={route('applicant.profile.edit')} className="hover:text-indigo-600">
                                Profile
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="text-red-600 hover:text-red-700">
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <header className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    {user?.applicant_id && (
                        <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">
                            Applicant ID: {user.applicant_id}
                        </p>
                    )}
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {children}
            </main>
        </div>
    );
}
