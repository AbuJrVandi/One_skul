import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ReportCardDesigner({ school }) {
    const settings = school.report_settings || {
        primary_color: '#1e3a5f',
        secondary_color: '#10b981',
        font_style: 'Inter',
        show_photo: true,
        custom_school_name: school.name,
        school_motto: 'Opening Doors to Excellence',
        principal_name: 'Dr. Abubie Kamara',
        layout_config: {
            header_height: '100px',
            font_size: '12pt',
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        custom_school_name: settings.custom_school_name || school.name,
        school_motto: settings.school_motto || 'Opening Doors to Excellence',
        principal_name: settings.principal_name || school.principal_name || 'Dr. Abubie Kamara',
        primary_color: settings.primary_color || '#1e3a5f',
        secondary_color: settings.secondary_color || '#10b981',
        font_style: settings.font_style || 'Inter',
        show_photo: settings.show_photo ?? true,
        layout_config: settings.layout_config || {},
    });

    const [logoPreview, setLogoPreview] = useState(school.report_assets?.find(a => a.asset_type === 'logo')?.preview_url);
    const [signaturePreview, setSignaturePreview] = useState(school.report_assets?.find(a => a.asset_type === 'signature')?.preview_url);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        post(route('admin.portal.report-settings.update', school.id));
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'logo') setLogoPreview(reader.result);
            else setSignaturePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Actual upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('asset_type', type);

        post(route('admin.portal.report-assets.upload', school.id), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Settings Panels */}
            <div className="xl:col-span-1 space-y-6">
                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-black text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Visual Branding
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">School Display Name</label>
                        <input
                            type="text"
                            value={data.custom_school_name}
                            onChange={e => setData('custom_school_name', e.target.value)}
                            className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="THE DOOR INTERNATIONAL ACADEMY"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">School Motto</label>
                        <input
                            type="text"
                            value={data.school_motto}
                            onChange={e => setData('school_motto', e.target.value)}
                            className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Opening Doors to Excellence"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Principal's Name</label>
                        <input
                            type="text"
                            value={data.principal_name}
                            onChange={e => setData('principal_name', e.target.value)}
                            className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Dr. Abubie Kamara"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={data.primary_color}
                                    onChange={e => setData('primary_color', e.target.value)}
                                    className="w-10 h-10 rounded-lg p-1 border-gray-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.primary_color}
                                    onChange={e => setData('primary_color', e.target.value)}
                                    className="flex-1 rounded-lg border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Accent Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={data.secondary_color}
                                    onChange={e => setData('secondary_color', e.target.value)}
                                    className="w-10 h-10 rounded-lg p-1 border-gray-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={data.secondary_color}
                                    onChange={e => setData('secondary_color', e.target.value)}
                                    className="flex-1 rounded-lg border-gray-200 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Typography Style</label>
                        <select
                            value={data.font_style}
                            onChange={e => setData('font_style', e.target.value)}
                            className="w-full rounded-xl border-gray-200"
                        >
                            <option value="Inter">Modern (Inter)</option>
                            <option value="Libre Baskerville">Classic Serif (Libre Baskerville)</option>
                            <option value="Roboto">Corporate (Roboto)</option>
                            <option value="Merriweather">Elegant (Merriweather)</option>
                            <option value="Outfit">Contemporary (Outfit)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            checked={data.show_photo}
                            onChange={e => setData('show_photo', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Display Student Photo</label>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Preferences
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Are you sure you want to reset to default settings?')) {
                                    setData({
                                        custom_school_name: school.name,
                                        school_motto: 'Opening Doors to Excellence',
                                        principal_name: 'Dr. Abubie Kamara',
                                        primary_color: '#1e3a5f',
                                        secondary_color: '#10b981',
                                        font_style: 'Inter',
                                        show_photo: true,
                                        layout_config: {},
                                    });
                                }
                            }}
                            className="w-full py-3 bg-white text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all border border-gray-100"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </form>

                {/* Asset Management */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="font-black text-gray-900 border-b pb-4 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Official Assets
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3 text-center">School Logo / Crest</label>
                        <div className="relative group w-32 h-32 mx-auto mb-4">
                            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-center p-2">
                                        <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-[10px] text-gray-400">Upload Logo</span>
                                    </div>
                                )}
                            </div>
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer rounded-2xl transition-all">
                                <span className="text-xs font-bold">Update Logo</span>
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'logo')} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3 text-center">Principal's Signature</label>
                        <div className="relative group w-full h-20 mx-auto">
                            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50">
                                {signaturePreview ? (
                                    <img src={signaturePreview} alt="Signature" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-xs text-gray-400 italic font-medium">Digital Signature Required</span>
                                )}
                            </div>
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer rounded-2xl transition-all">
                                <span className="text-xs font-bold">Upload Signature</span>
                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'signature')} accept="image/*" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Preview - Matches Reference Design Exactly */}
            <div className="xl:col-span-2">
                <div className="bg-gray-200 p-6 rounded-[32px] shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm">
                            📄 Live Report Card Preview
                        </span>
                    </div>

                    {/* Report Card Preview - Exact Match to Reference */}
                    <div
                        className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto"
                        style={{
                            maxWidth: '600px',
                            fontFamily: data.font_style === 'Libre Baskerville' ? "'Libre Baskerville', Georgia, serif" : `'${data.font_style}', sans-serif`
                        }}
                    >
                        {/* Header Section */}
                        <div className="text-center pt-8 pb-4 px-8">
                            {/* School Logo */}
                            <div className="mb-3">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="School Logo" className="w-16 h-16 mx-auto object-contain" />
                                ) : (
                                    <div
                                        className="w-16 h-20 mx-auto rounded-t-lg rounded-b-[50%] flex flex-col items-center justify-center text-white"
                                        style={{ background: `linear-gradient(180deg, ${data.primary_color} 0%, ${data.primary_color}dd 100%)` }}
                                    >
                                        <span className="text-lg font-bold">TDA</span>
                                        <span className="text-[6px] tracking-wider">ONE-SKUL</span>
                                    </div>
                                )}
                            </div>

                            {/* School Name */}
                            <h1
                                className="text-lg font-bold uppercase tracking-wide"
                                style={{ color: data.primary_color }}
                            >
                                {data.custom_school_name}
                            </h1>

                            {/* School Motto */}
                            <p
                                className="text-sm italic mt-1"
                                style={{ color: data.primary_color }}
                            >
                                {data.school_motto}
                            </p>

                            {/* Divider */}
                            <div
                                className="h-0.5 mt-4 mx-auto"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${data.primary_color}, transparent)`,
                                    width: '100%'
                                }}
                            ></div>

                            {/* Report Title */}
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-4">
                                OFFICIAL STUDENTS' PROGRESS REPORT
                            </p>
                            <div className="h-px bg-gray-300 mt-2"></div>
                        </div>

                        {/* Student Info Section */}
                        <div className="flex gap-4 px-8 py-4">
                            {/* Student Photo */}
                            {data.show_photo && (
                                <div className="w-20 h-24 border-2 border-gray-200 rounded flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                            )}

                            {/* Student Details */}
                            <div className="flex-1 text-xs space-y-1">
                                <div className="flex">
                                    <span className="text-gray-500 w-24">Student Name</span>
                                    <span className="font-bold text-gray-800">John Doe Smith</span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <span className="text-gray-500 w-24">Student ID</span>
                                        <span className="text-gray-800">ADM/2025/001</span>
                                    </div>
                                    <span className="font-bold text-gray-800">Primary 5 Alpha</span>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <span className="text-gray-500 w-24">Class</span>
                                        <span className="text-gray-800">Primary 5 Alpha</span>
                                    </div>
                                    <span className="text-gray-800">98% (48/50 Days)</span>
                                </div>
                            </div>
                        </div>

                        {/* Grades Table */}
                        <div className="px-8 py-4">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr style={{ backgroundColor: data.primary_color }} className="text-white">
                                        <th className="py-2 px-3 text-left font-semibold">SUBJECT</th>
                                        <th className="py-2 px-3 text-center font-semibold w-16">SCORE</th>
                                        <th className="py-2 px-3 text-center font-semibold w-16">GRADE</th>
                                        <th className="py-2 px-3 text-left font-semibold">REMARK</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 px-3 font-medium">Mathematics</td>
                                        <td className="py-2 px-3 text-center font-semibold">92</td>
                                        <td className="py-2 px-3 text-center font-bold text-blue-600">A+</td>
                                        <td className="py-2 px-3 italic text-gray-500">Excellent Performance</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 px-3 font-medium">English Language</td>
                                        <td className="py-2 px-3 text-center font-semibold">85</td>
                                        <td className="py-2 px-3 text-center font-bold text-blue-600">A</td>
                                        <td className="py-2 px-3 italic text-gray-500">Very Good Mastery</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 px-3 font-medium">Science</td>
                                        <td className="py-2 px-3 text-center font-semibold">78</td>
                                        <td className="py-2 px-3 text-center font-bold text-blue-600">B</td>
                                        <td className="py-2 px-3 italic text-gray-500">Commendable Work</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Principal's Remarks */}
                        <div className="px-8 py-4">
                            <fieldset
                                className="border border-gray-200 rounded p-3"
                                style={{ borderLeftWidth: '3px', borderLeftColor: data.primary_color }}
                            >
                                <legend className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider px-2">
                                    PRINCIPAL'S REMARKS
                                </legend>
                                <p className="text-xs italic text-gray-600 leading-relaxed">
                                    An outstanding performance this term. John has shown exceptional growth in leadership.
                                </p>
                            </fieldset>

                            {/* Signature */}
                            <div className="text-right mt-4 pr-4">
                                <div className="inline-block text-center">
                                    {signaturePreview ? (
                                        <img src={signaturePreview} alt="Signature" className="h-10 mb-1 ml-auto" />
                                    ) : (
                                        <span className="text-lg italic text-gray-400" style={{ fontFamily: 'cursive' }}>
                                            Abubie Kamara
                                        </span>
                                    )}
                                    <p className="text-xs font-bold text-gray-800">{data.principal_name}</p>
                                    <p className="text-[10px] text-gray-500">Principal</p>
                                </div>
                            </div>
                        </div>

                        {/* System Notice */}
                        <div className="px-8 py-2 border-t border-gray-100">
                            <p className="text-[9px] text-gray-400 text-center">
                                This report is system-generated and officially approved by the school authority via <span className="text-blue-600 font-bold">One-Skul.</span>
                            </p>
                        </div>

                        {/* Footer Logos */}
                        <div
                            className="py-4 px-6 flex justify-between items-center"
                            style={{ backgroundColor: data.primary_color }}
                        >
                            <div className="flex flex-col items-center">
                                <img src="/images/one_skul_logo.png" alt="One-Skul" className="h-10 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                                <span className="text-white text-[8px] font-bold mt-1">ONE-SKUL</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <img src="/images/ministry_education_logo.png" alt="Ministry" className="h-12 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className="text-white text-[7px] font-semibold leading-tight mt-1">
                                    <div>MINISTRY OF BASIC AND SENIOR</div>
                                    <div>SECONDARY EDUCATION</div>
                                    <div className="text-yellow-300">SIERRA LEONE</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/images/sierra_leone_coat_of_arms.png" alt="Coat of Arms" className="h-12 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Preview Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => window.open(`/admin/reports/preview/${school.id}`, '_blank')}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Open Full Print Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
