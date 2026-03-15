import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        identity: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.login.store'));
    };

    return (
        <GuestLayout>
            <Head title="Applicant Login" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                    {status}
                </div>
            )}

            <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-slate-900">Applicant Login</h1>
                <p className="text-sm text-slate-500 mt-1">Use your email or phone number to sign in.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel value="Email or Phone" />
                    <TextInput className="mt-1 block w-full" value={data.identity} onChange={(e) => setData('identity', e.target.value)} />
                    <InputError message={errors.identity} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Password" />
                    <TextInput type="password" className="mt-1 block w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    Login
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                New applicant?{' '}
                <Link href={route('applicant.register')} className="font-semibold text-indigo-600 hover:text-indigo-800">
                    Create an account
                </Link>
            </div>
        </GuestLayout>
    );
}
