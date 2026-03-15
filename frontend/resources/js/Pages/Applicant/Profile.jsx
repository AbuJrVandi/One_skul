import { Head, useForm, usePage } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Profile({ user }) {
    const { flash } = usePage().props;
    const { data, setData, patch, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('applicant.profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.patch(route('applicant.profile.password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <ApplicantLayout title="Profile">
            <Head title="Applicant Profile" />

            {flash?.success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Profile Details</h2>
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

                    <PrimaryButton disabled={processing}>
                        Update Profile
                    </PrimaryButton>
                </form>

                <form onSubmit={submitPassword} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                    <div>
                        <InputLabel value="Current Password" />
                        <TextInput type="password" className="mt-1 block w-full" value={passwordForm.data.current_password} onChange={(e) => passwordForm.setData('current_password', e.target.value)} />
                        <InputError message={passwordForm.errors.current_password} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="New Password" />
                        <TextInput type="password" className="mt-1 block w-full" value={passwordForm.data.password} onChange={(e) => passwordForm.setData('password', e.target.value)} />
                        <InputError message={passwordForm.errors.password} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="Confirm New Password" />
                        <TextInput type="password" className="mt-1 block w-full" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} />
                        <InputError message={passwordForm.errors.password_confirmation} className="mt-2" />
                    </div>

                    <PrimaryButton disabled={passwordForm.processing}>
                        Update Password
                    </PrimaryButton>
                </form>
            </div>
        </ApplicantLayout>
    );
}
