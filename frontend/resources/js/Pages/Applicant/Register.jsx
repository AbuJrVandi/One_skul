import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.register.store'));
    };

    return (
        <GuestLayout>
            <Head title="Applicant Registration" />

            <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-slate-900">Create Applicant Account</h1>
                <p className="text-sm text-slate-500 mt-1">Apply to any school with one secure profile.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel value="Full Name" />
                    <TextInput className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Email Address" />
                    <TextInput type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Phone Number" />
                    <TextInput className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    <InputError message={errors.phone} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Password" />
                    <TextInput type="password" className="mt-1 block w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Confirm Password" />
                    <TextInput type="password" className="mt-1 block w-full" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    Create Account
                </PrimaryButton>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href={route('applicant.login')} className="font-semibold text-indigo-600 hover:text-indigo-800">
                    Login
                </Link>
            </div>
        </GuestLayout>
    );
}
