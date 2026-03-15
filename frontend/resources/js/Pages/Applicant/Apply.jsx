import { Head, useForm, usePage } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const COUNTRIES = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Congo (Congo-Kinshasa)',
    'Costa Rica',
    'Cote d\'Ivoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
];

const SIERRA_LEONE_DISTRICTS = [
    'Bo',
    'Bombali',
    'Bonthe',
    'Falaba',
    'Kailahun',
    'Kambia',
    'Karene',
    'Kenema',
    'Koinadugu',
    'Kono',
    'Moyamba',
    'Port Loko',
    'Pujehun',
    'Tonkolili',
    'Western Area Rural',
    'Western Area Urban',
];

const CLASS_OPTIONS = {
    primary: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'],
    jss: ['JSS1', 'JSS2', 'JSS3'],
    sss: ['SSS1', 'SSS2', 'SSS3'],
};

export default function Apply({ school }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        student_full_name: '',
        gender: '',
        date_of_birth: '',
        place_of_birth: '',
        nationality: '',
        district: '',
        address: '',
        class_category: 'primary',
        class_level: '',
        previous_school_name: '',
        previous_school_last_class: '',
        previous_school_year_completed: '',
        guardian_name: '',
        guardian_occupation: '',
        guardian_phone: '',
        guardian_email: '',
        guardian_address: '',
        birth_certificate: null,
        passport_photo: null,
        report_card: null,
        transfer_letter: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.applications.review.store', school.slug || school.id), {
            forceFormData: true,
        });
    };

    const levels = CLASS_OPTIONS[data.class_category] || [];

    return (
        <ApplicantLayout title={`Apply to ${school.name}`}>
            <Head title={`Apply to ${school.name}`} />

            {flash?.error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {flash.error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-8">
                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Student Information</h2>
                    <div>
                        <InputLabel value="Student Full Name" />
                        <TextInput className="mt-1 block w-full" value={data.student_full_name} onChange={(e) => setData('student_full_name', e.target.value)} />
                        <InputError message={errors.student_full_name} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <InputLabel value="Gender" />
                            <select className="mt-1 w-full rounded-md border-gray-300" value={data.gender} onChange={(e) => setData('gender', e.target.value)}>
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <InputError message={errors.gender} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Date of Birth" />
                            <TextInput type="date" className="mt-1 block w-full" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                            <InputError message={errors.date_of_birth} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Place of Birth" />
                            <TextInput className="mt-1 block w-full" value={data.place_of_birth} onChange={(e) => setData('place_of_birth', e.target.value)} />
                            <InputError message={errors.place_of_birth} className="mt-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Nationality" />
                            <select
                                className="mt-1 w-full rounded-md border-gray-300"
                                value={data.nationality}
                                onChange={(e) => setData('nationality', e.target.value)}
                                required
                            >
                                <option value="">Select country</option>
                                {COUNTRIES.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <InputError message={errors.nationality} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="District (Sierra Leone)" />
                            <select
                                className="mt-1 w-full rounded-md border-gray-300"
                                value={data.district}
                                onChange={(e) => setData('district', e.target.value)}
                                required
                            >
                                <option value="">Select district</option>
                                {SIERRA_LEONE_DISTRICTS.map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            <InputError message={errors.district} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <InputLabel value="Residential Address" />
                        <textarea className="mt-1 w-full rounded-md border-gray-300" rows="3" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} className="mt-2" />
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Class Applying For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="School Level" />
                            <select className="mt-1 w-full rounded-md border-gray-300" value={data.class_category} onChange={(e) => setData('class_category', e.target.value)}>
                                <option value="primary">Primary School</option>
                                <option value="jss">Junior Secondary</option>
                                <option value="sss">Senior Secondary</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Class" />
                            <select className="mt-1 w-full rounded-md border-gray-300" value={data.class_level} onChange={(e) => setData('class_level', e.target.value)}>
                                <option value="">Select</option>
                                {levels.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            <InputError message={errors.class_level} className="mt-2" />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Previous School Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <InputLabel value="Previous School Name" />
                            <TextInput className="mt-1 block w-full" value={data.previous_school_name} onChange={(e) => setData('previous_school_name', e.target.value)} />
                            <InputError message={errors.previous_school_name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Last Class Attended" />
                            <TextInput className="mt-1 block w-full" value={data.previous_school_last_class} onChange={(e) => setData('previous_school_last_class', e.target.value)} />
                            <InputError message={errors.previous_school_last_class} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Year Completed" />
                            <TextInput className="mt-1 block w-full" value={data.previous_school_year_completed} onChange={(e) => setData('previous_school_year_completed', e.target.value)} />
                            <InputError message={errors.previous_school_year_completed} className="mt-2" />
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Parent / Guardian Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Parent / Guardian Name" />
                            <TextInput className="mt-1 block w-full" value={data.guardian_name} onChange={(e) => setData('guardian_name', e.target.value)} />
                            <InputError message={errors.guardian_name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Occupation" />
                            <TextInput className="mt-1 block w-full" value={data.guardian_occupation} onChange={(e) => setData('guardian_occupation', e.target.value)} />
                            <InputError message={errors.guardian_occupation} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Phone Number" />
                            <TextInput className="mt-1 block w-full" value={data.guardian_phone} onChange={(e) => setData('guardian_phone', e.target.value)} />
                            <InputError message={errors.guardian_phone} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Email Address" />
                            <TextInput type="email" className="mt-1 block w-full" value={data.guardian_email} onChange={(e) => setData('guardian_email', e.target.value)} />
                            <InputError message={errors.guardian_email} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <InputLabel value="Address" />
                        <textarea className="mt-1 w-full rounded-md border-gray-300" rows="3" value={data.guardian_address} onChange={(e) => setData('guardian_address', e.target.value)} />
                        <InputError message={errors.guardian_address} className="mt-2" />
                    </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Document Uploads</h2>
                    <p className="text-sm text-slate-500">Max file size 2MB. Accepted formats: JPG, PNG, PDF.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel value="Birth Certificate" />
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData('birth_certificate', e.target.files[0])} />
                            <InputError message={errors.birth_certificate} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Passport Photo" />
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData('passport_photo', e.target.files[0])} />
                            <InputError message={errors.passport_photo} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Previous School Report Card" />
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData('report_card', e.target.files[0])} />
                            <InputError message={errors.report_card} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Transfer Letter (Optional)" />
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setData('transfer_letter', e.target.files[0])} />
                            <InputError message={errors.transfer_letter} className="mt-2" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <PrimaryButton className="justify-center" disabled={processing}>
                        Review Application
                    </PrimaryButton>
                </div>
            </form>
        </ApplicantLayout>
    );
}
