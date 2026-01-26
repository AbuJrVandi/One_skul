import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50 min-h-screen">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <Link href="/">
                                    <img src="/images/logo.png" alt="One Skul Logo" className="h-20 w-auto" />
                                </Link>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white font-black uppercase text-xs tracking-widest"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white font-black uppercase text-xs tracking-widest"
                                        >
                                            Faculty Access
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white font-black uppercase text-xs tracking-widest ml-4"
                                        >
                                            Register School
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-16">
                            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-700">
                                <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-none">
                                    Unified School <br /> <span className="text-indigo-600">Enterprise Portal</span>
                                </h1>
                                <p className="max-w-2xl mx-auto text-xl text-gray-500 font-medium mb-12 leading-relaxed">
                                    A professional ecosystem for modern education. Manage faculty, track student performance, and broadcast school-wide announcements with surgical precision.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    {!auth.user && (
                                        <Link href={route('login')} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
                                            Administrator Login
                                        </Link>
                                    )}
                                    <Link href="/school-login" className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all">
                                        Parent & Student Portal
                                    </Link>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            &copy; {new Date().getFullYear()} One Skul Enterprise &bull; Powering the next generation of excellence
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
