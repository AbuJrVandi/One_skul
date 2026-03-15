<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Application Status Notice</title>
    <style>
        @page { margin: 28px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; color: #111827; font-size: 12px; }
        .header { display: flex; align-items: center; border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 18px; }
        .logo { width: 70px; height: 70px; object-fit: contain; margin-right: 16px; }
        .school-name { font-size: 20px; font-weight: 700; }
        .muted { color: #6b7280; font-size: 11px; }
        .title { text-align: center; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 18px 0; }
        .section-title { font-weight: 700; margin: 14px 0 6px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        .info-table td { padding: 6px 0; vertical-align: top; }
        .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; }
        .footer { margin-top: 26px; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .small { font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        @if (!empty($school['logo_url']))
            <img class="logo" src="{{ $school['logo_url'] }}" alt="School Logo">
        @endif
        <div>
            <div class="school-name">{{ $school['name'] }}</div>
            <div class="muted">{{ $school['address'] ?? '' }}</div>
            <div class="muted">
                @if(!empty($school['email'])) Email: {{ $school['email'] }} @endif
                @if(!empty($school['phone'])) | Phone: {{ $school['phone'] }} @endif
            </div>
        </div>
    </div>

    <div class="title">APPLICATION STATUS NOTICE</div>

    <div class="section-title">Applicant Information</div>
    <table class="info-table">
        <tr>
            <td><strong>Student Name:</strong> {{ $student['full_name'] }}</td>
            <td><strong>Application ID:</strong> <span class="mono">{{ $application['reference'] }}</span></td>
        </tr>
        <tr>
            <td><strong>Class Applied For:</strong> {{ strtoupper($application['class_level']) }}</td>
            <td><strong>Academic Year:</strong> {{ $document['academic_year'] }}</td>
        </tr>
    </table>

    <div class="section-title">Decision</div>
    <p>
        We regret to inform you that your application for admission into {{ $school['name'] }} has not been successful
        for the {{ $document['academic_year'] }} academic year.
    </p>
    <p>
        This decision was made after careful review of all submitted applications.
        You may apply again in the next admission cycle.
    </p>

    <div class="section-title">Document Verification</div>
    <div class="box">
        <div><strong>Document ID:</strong> <span class="mono">{{ $document['document_id'] }}</span></div>
        <div><strong>Verification Code:</strong> <span class="mono">{{ $document['verification_code'] }}</span></div>
        <div class="small muted">Use the verification code on the school portal to validate this document.</div>
    </div>

    <div class="footer">
        <strong>Reviewed By:</strong><br>
        {{ $principal['name'] ?? 'Principal' }}<br>
        {{ $school['name'] }}<br>
        <span class="muted">Date: {{ $document['generated_at'] }}</span>
    </div>
</body>
</html>
