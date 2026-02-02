import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function ReportCardPrint({ school, student, term, grades, attendance, principal_comment }) {
    const settings = school.report_settings || {
        primary_color: '#1e3a5f',
        secondary_color: '#4b5563',
        font_style: 'Inter',
        show_photo: true,
        custom_school_name: school.name,
        school_motto: 'Opening Doors to Excellence',
        principal_name: school.principal_name || 'Dr. Abubie Kamara'
    };

    const logo = school.report_assets?.find(a => a.asset_type === 'logo')?.preview_url;
    const signature = school.report_assets?.find(a => a.asset_type === 'signature')?.preview_url;

    useEffect(() => {
        // Auto-print when loaded
        setTimeout(() => {
            window.print();
        }, 1000);
    }, []);

    // Calculate grade from score
    const calculateGrade = (score) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    };

    // Get grade color
    const getGradeColor = (grade) => {
        return '#1565c0';
    };

    return (
        <div className="report-card-wrapper">
            <Head>
                <title>{`Report Card - ${student.first_name} ${student.last_name}`}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="report-card">
                {/* ============================================= */}
                {/* 1. HEADER SECTION */}
                {/* ============================================= */}
                <header className="header-section">
                    {/* School Logo */}
                    <div className="school-logo-container">
                        {logo ? (
                            <img src={logo} alt="School Logo" className="school-logo" />
                        ) : (
                            <div className="default-logo">
                                <div className="logo-shield">
                                    <span className="logo-text">TDA</span>
                                    <span className="logo-subtitle">ONE-SKUL</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* School Name */}
                    <h1 className="school-name">
                        {settings.custom_school_name || school.name}
                    </h1>

                    {/* School Motto */}
                    <p className="school-motto">{settings.school_motto || 'Opening Doors to Excellence'}</p>

                    {/* Header Divider */}
                    <div className="header-divider"></div>

                    {/* Report Title */}
                    <h2 className="report-title">OFFICIAL STUDENTS' PROGRESS REPORT</h2>

                    {/* Title Underline */}
                    <div className="title-underline"></div>
                </header>

                {/* ============================================= */}
                {/* 2. STUDENT INFORMATION SECTION */}
                {/* ============================================= */}
                <section className="student-info-section">
                    {/* Student Photo */}
                    <div className="student-photo-container">
                        {student.photo_url ? (
                            <img
                                src={student.photo_url}
                                alt="Student Photo"
                                className="student-photo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className="photo-placeholder" style={{ display: student.photo_url ? 'none' : 'flex' }}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="student-details">
                        <div className="detail-row">
                            <span className="detail-label">Student Name</span>
                            <span className="detail-value bold">{student.first_name} {student.last_name}</span>
                        </div>
                        <div className="detail-row two-column">
                            <div className="detail-group">
                                <span className="detail-label">Student ID</span>
                                <span className="detail-value">{student.admission_number || 'ADM/2025/001'}</span>
                            </div>
                            <div className="detail-group right">
                                <span className="detail-value bold">{student.school_class?.name || 'Primary 5 Alpha'}</span>
                            </div>
                        </div>
                        <div className="detail-row two-column">
                            <div className="detail-group">
                                <span className="detail-label">Class</span>
                                <span className="detail-value">{student.school_class?.name || 'Primary 5 Alpha'}</span>
                            </div>
                            <div className="detail-group right">
                                <span className="detail-value">{attendance.percentage}% ({attendance.present}/{attendance.total_days} Days)</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================= */}
                {/* 3. ACADEMIC PERFORMANCE SECTION */}
                {/* ============================================= */}
                <section className="academic-section">
                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th className="subject-col">SUBJECT</th>
                                <th className="score-col">SCORE</th>
                                <th className="grade-col">GRADE</th>
                                <th className="remark-col">REMARK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.length > 0 ? grades.map((grade, index) => (
                                <tr key={grade.id || index}>
                                    <td className="subject-cell">{grade.subject?.name || grade.subject_name}</td>
                                    <td className="score-cell">{grade.score}</td>
                                    <td className="grade-cell">
                                        <span style={{ color: getGradeColor(grade.grade || calculateGrade(grade.score)) }}>
                                            {grade.grade || calculateGrade(grade.score)}
                                        </span>
                                    </td>
                                    <td className="remark-cell">{grade.remark || 'Good performance'}</td>
                                </tr>
                            )) : (
                                <>
                                    <tr>
                                        <td className="subject-cell">Mathematics</td>
                                        <td className="score-cell">92</td>
                                        <td className="grade-cell"><span style={{ color: '#1565c0' }}>A+</span></td>
                                        <td className="remark-cell">Excellent Performance</td>
                                    </tr>
                                    <tr>
                                        <td className="subject-cell">English Language</td>
                                        <td className="score-cell">85</td>
                                        <td className="grade-cell"><span style={{ color: '#1565c0' }}>A</span></td>
                                        <td className="remark-cell">Very Good Mastery</td>
                                    </tr>
                                    <tr>
                                        <td className="subject-cell">Science</td>
                                        <td className="score-cell">78</td>
                                        <td className="grade-cell"><span style={{ color: '#1565c0' }}>B</span></td>
                                        <td className="remark-cell">Commendable Work</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* ============================================= */}
                {/* 4. PRINCIPAL'S REMARKS SECTION */}
                {/* ============================================= */}
                <section className="remarks-section">
                    <fieldset className="remarks-fieldset">
                        <legend className="remarks-legend">PRINCIPAL'S REMARKS</legend>
                        <div className="remarks-content">
                            <p className="remarks-text">
                                {principal_comment || 'An outstanding performance this term. John has shown exceptional growth in leadership.'}
                            </p>
                        </div>
                    </fieldset>

                    {/* Principal Signature */}
                    <div className="signature-section">
                        <div className="signature-container">
                            {signature ? (
                                <img src={signature} alt="Principal Signature" className="signature-image" />
                            ) : (
                                <span className="signature-placeholder">Abubie Kamara</span>
                            )}
                        </div>
                        <p className="principal-name">{settings.principal_name || school.principal_name || 'Dr. Abubie Kamara'}</p>
                        <p className="principal-title">Principal</p>
                    </div>
                </section>

                {/* ============================================= */}
                {/* 5. FOOTER SECTION */}
                {/* ============================================= */}
                <footer className="footer-section">
                    {/* System Generated Notice */}
                    <p className="system-notice">
                        This report is system-generated and officially approved by the school authority via <span className="one-skul-text">One-Skul.</span>
                    </p>

                    {/* Footer Logos Bar */}
                    <div className="footer-logos-bar">
                        {/* One-Skul Logo */}
                        <div className="footer-logo-item">
                            <img
                                src="/images/one_skul_logo.png"
                                alt="One-Skul Logo"
                                className="footer-logo-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="fallback-logo one-skul" style={{ display: 'none' }}>
                                <svg viewBox="0 0 40 40" className="logo-icon">
                                    <circle cx="20" cy="12" r="8" fill="white" stroke="white" strokeWidth="1" />
                                    <path d="M8 35 L20 20 L32 35 Z" fill="white" />
                                </svg>
                                <span>ONE-SKUL</span>
                            </div>
                        </div>

                        {/* Ministry Logo */}
                        <div className="footer-logo-item ministry">
                            <img
                                src="/images/ministry_education_logo.png"
                                alt="Ministry of Education Logo"
                                className="footer-logo-img ministry-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="fallback-logo ministry" style={{ display: 'none' }}>
                                <div className="ministry-text">
                                    <span>MINISTRY OF BASIC AND SENIOR</span>
                                    <span>SECONDARY EDUCATION</span>
                                    <span className="country">SIERRA LEONE</span>
                                </div>
                            </div>
                        </div>

                        {/* Sierra Leone Coat of Arms */}
                        <div className="footer-logo-item">
                            <img
                                src="/images/sierra_leone_coat_of_arms.png"
                                alt="Sierra Leone Coat of Arms"
                                className="footer-logo-img"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="fallback-logo coat" style={{ display: 'none' }}>
                                <svg viewBox="0 0 50 50" className="coat-icon">
                                    <path d="M10 40 L25 10 L40 40 Z" fill="none" stroke="white" strokeWidth="2" />
                                    <circle cx="25" cy="28" r="8" fill="none" stroke="white" strokeWidth="1.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* ============================================= */}
            {/* STYLES */}
            {/* ============================================= */}
            <style dangerouslySetInnerHTML={{
                __html: `
                /* ========== BASE STYLES ========== */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .report-card-wrapper {
                    background: #f0f0f0;
                    min-height: 100vh;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .report-card {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    padding: 15mm 20mm;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                }

                /* ========== HEADER SECTION ========== */
                .header-section {
                    text-align: center;
                    margin-bottom: 15px;
                }

                .school-logo-container {
                    margin-bottom: 10px;
                }

                .school-logo {
                    width: 70px;
                    height: 70px;
                    object-fit: contain;
                }

                .default-logo {
                    display: inline-block;
                }

                .logo-shield {
                    width: 65px;
                    height: 80px;
                    background: linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%);
                    border-radius: 5px 5px 50% 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    border: 3px solid #1e3a5f;
                }

                .logo-text {
                    font-size: 22px;
                    font-weight: 700;
                    letter-spacing: 2px;
                }

                .logo-subtitle {
                    font-size: 7px;
                    letter-spacing: 1px;
                    margin-top: 3px;
                    opacity: 0.9;
                }

                .school-name {
                    font-family: 'Libre Baskerville', 'Georgia', serif;
                    font-size: 22px;
                    font-weight: 700;
                    color: #1e3a5f;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 5px;
                }

                .school-motto {
                    font-family: 'Libre Baskerville', 'Georgia', serif;
                    font-size: 14px;
                    font-style: italic;
                    color: #1e3a5f;
                    margin-bottom: 15px;
                }

                .header-divider {
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #1e3a5f, transparent);
                    margin: 10px auto;
                    width: 100%;
                }

                .report-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: #555;
                    letter-spacing: 3px;
                    margin: 15px 0 8px 0;
                }

                .title-underline {
                    height: 1px;
                    background: #ccc;
                    width: 100%;
                }

                /* ========== STUDENT INFO SECTION ========== */
                .student-info-section {
                    display: flex;
                    gap: 25px;
                    margin: 20px 0;
                    padding: 15px;
                    align-items: flex-start;
                }

                .student-photo-container {
                    width: 100px;
                    height: 110px;
                    border: 2px solid #ddd;
                    border-radius: 3px;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: #f5f5f5;
                }

                .student-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .photo-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e8e8e8;
                }

                .photo-placeholder svg {
                    width: 50px;
                    height: 50px;
                    color: #bbb;
                }

                .student-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .detail-row {
                    display: flex;
                    align-items: baseline;
                    gap: 15px;
                }

                .detail-row.two-column {
                    justify-content: space-between;
                }

                .detail-group {
                    display: flex;
                    gap: 10px;
                    align-items: baseline;
                }

                .detail-group.right {
                    text-align: right;
                }

                .detail-label {
                    font-size: 12px;
                    color: #666;
                    min-width: 90px;
                }

                .detail-value {
                    font-size: 13px;
                    color: #333;
                }

                .detail-value.bold {
                    font-weight: 700;
                }

                /* ========== ACADEMIC TABLE ========== */
                .academic-section {
                    margin: 15px 0;
                }

                .grades-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }

                .grades-table thead tr {
                    background: #1e3a5f;
                    color: white;
                }

                .grades-table th {
                    padding: 12px 15px;
                    text-align: left;
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 1px;
                }

                .grades-table th.score-col,
                .grades-table th.grade-col {
                    text-align: center;
                    width: 80px;
                }

                .grades-table th.remark-col {
                    width: 180px;
                }

                .grades-table tbody tr {
                    border-bottom: 1px solid #e5e5e5;
                }

                .grades-table tbody tr:hover {
                    background: #fafafa;
                }

                .grades-table td {
                    padding: 12px 15px;
                }

                .subject-cell {
                    font-weight: 500;
                    color: #333;
                }

                .score-cell {
                    text-align: center;
                    font-weight: 600;
                }

                .grade-cell {
                    text-align: center;
                    font-weight: 700;
                }

                .remark-cell {
                    font-style: italic;
                    color: #555;
                    font-size: 12px;
                }

                /* ========== PRINCIPAL'S REMARKS ========== */
                .remarks-section {
                    margin: 25px 0 15px 0;
                }

                .remarks-fieldset {
                    border: 1px solid #ddd;
                    border-left: 3px solid #1e3a5f;
                    padding: 15px 20px;
                    margin: 0;
                    background: #fafafa;
                }

                .remarks-legend {
                    font-size: 10px;
                    font-weight: 600;
                    color: #555;
                    letter-spacing: 2px;
                    padding: 0 10px;
                    background: white;
                }

                .remarks-content {
                    margin-top: 5px;
                }

                .remarks-text {
                    font-style: italic;
                    font-size: 13px;
                    color: #444;
                    line-height: 1.6;
                }

                .signature-section {
                    text-align: right;
                    margin-top: 20px;
                    padding-right: 20px;
                }

                .signature-container {
                    min-height: 40px;
                    margin-bottom: 5px;
                }

                .signature-image {
                    max-height: 50px;
                    max-width: 150px;
                }

                .signature-placeholder {
                    font-family: 'Brush Script MT', 'Segoe Script', cursive;
                    font-size: 24px;
                    color: #1e3a5f;
                    font-style: italic;
                }

                .principal-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 2px;
                }

                .principal-title {
                    font-size: 12px;
                    color: #666;
                }

                /* ========== FOOTER SECTION ========== */
                .footer-section {
                    margin-top: auto;
                    padding-top: 20px;
                }

                .system-notice {
                    font-size: 11px;
                    color: #666;
                    text-align: center;
                    margin-bottom: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #e5e5e5;
                }

                .one-skul-text {
                    color: #1565c0;
                    font-weight: 700;
                }

                .footer-logos-bar {
                    background: #1e3a5f;
                    padding: 20px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 0;
                    margin: 0 -20mm;
                    padding-left: 25mm;
                    padding-right: 25mm;
                }

                .footer-logo-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }

                .footer-logo-item.ministry {
                    flex: 1;
                    max-width: 200px;
                }

                .footer-logo-img {
                    height: 55px;
                    width: auto;
                    object-fit: contain;
                    border-radius: 4px;
                }

                .footer-logo-img.ministry-img {
                    height: 60px;
                }

                .fallback-logo {
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    color: white;
                }

                .fallback-logo svg {
                    height: 40px;
                    width: 40px;
                }

                .fallback-logo span {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .ministry-text {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: white;
                    font-size: 8px;
                    font-weight: 600;
                    text-align: center;
                    line-height: 1.4;
                    letter-spacing: 0.5px;
                }

                .ministry-text .country {
                    color: #ffd700;
                    margin-top: 2px;
                }

                /* ========== PRINT STYLES ========== */
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }

                    html, body {
                        width: 210mm;
                        height: 297mm;
                    }

                    .report-card-wrapper {
                        padding: 0;
                        background: white;
                        min-height: auto;
                    }

                    .report-card {
                        box-shadow: none;
                        width: 100%;
                        min-height: 100%;
                        page-break-after: always;
                    }

                    .footer-logos-bar {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    .grades-table thead tr {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    .remarks-fieldset {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }

                /* ========== RESPONSIVE ========== */
                @media screen and (max-width: 800px) {
                    .report-card-wrapper {
                        padding: 10px;
                    }

                    .report-card {
                        width: 100%;
                        min-height: auto;
                        padding: 20px;
                    }

                    .student-info-section {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .student-details {
                        width: 100%;
                    }

                    .detail-row.two-column {
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    }

                    .footer-logos-bar {
                        flex-direction: column;
                        gap: 20px;
                        margin: 0 -20px;
                        padding: 20px;
                    }
                }
            `}} />
        </div>
    );
}
