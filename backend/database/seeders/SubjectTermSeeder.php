<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\AcademicYear;
use App\Models\Term;
use App\Models\School;
use App\Modules\Subjects\Models\SchoolSubject;
use Illuminate\Database\Seeder;

class SubjectTermSeeder extends Seeder
{
    /**
     * Seed platform-level subjects and academic year/terms
     */
    public function run(): void
    {
        // Primary Level Subjects
        $primarySubjects = [
            ['name' => 'English Language', 'code' => 'ENG', 'level' => 'primary', 'category' => 'Languages'],
            ['name' => 'Mathematics', 'code' => 'MTH', 'level' => 'all', 'category' => 'Sciences'],
            ['name' => 'Basic Science', 'code' => 'BSC', 'level' => 'primary', 'category' => 'Sciences'],
            ['name' => 'Social Studies', 'code' => 'SST', 'level' => 'primary', 'category' => 'Humanities'],
            ['name' => 'Religious Studies', 'code' => 'REL', 'level' => 'all', 'category' => 'Humanities'],
            ['name' => 'Physical Education', 'code' => 'PHE', 'level' => 'all', 'category' => 'Physical'],
            ['name' => 'Creative Arts', 'code' => 'ART', 'level' => 'primary', 'category' => 'Arts'],
            ['name' => 'Health Education', 'code' => 'HED', 'level' => 'primary', 'category' => 'Health'],
        ];

        // Junior Secondary (JSS) Level Subjects
        $jssSubjects = [
            ['name' => 'Integrated Science', 'code' => 'ISC', 'level' => 'jss', 'category' => 'Sciences'],
            ['name' => 'Basic Technology', 'code' => 'BTC', 'level' => 'jss', 'category' => 'Technology'],
            ['name' => 'Agricultural Science', 'code' => 'AGR', 'level' => 'jss', 'category' => 'Sciences'],
            ['name' => 'Home Economics', 'code' => 'HEC', 'level' => 'jss', 'category' => 'Vocational'],
            ['name' => 'Business Studies', 'code' => 'BUS', 'level' => 'jss', 'category' => 'Commerce'],
            ['name' => 'French', 'code' => 'FRE', 'level' => 'jss', 'category' => 'Languages'],
            ['name' => 'Computer Studies', 'code' => 'COM', 'level' => 'jss', 'category' => 'Technology'],
            ['name' => 'Civic Education', 'code' => 'CIV', 'level' => 'jss', 'category' => 'Humanities'],
        ];

        // Senior Secondary (SSS) Level Subjects
        $sssSubjects = [
            ['name' => 'Physics', 'code' => 'PHY', 'level' => 'sss', 'category' => 'Sciences'],
            ['name' => 'Chemistry', 'code' => 'CHM', 'level' => 'sss', 'category' => 'Sciences'],
            ['name' => 'Biology', 'code' => 'BIO', 'level' => 'sss', 'category' => 'Sciences'],
            ['name' => 'Further Mathematics', 'code' => 'FMT', 'level' => 'sss', 'category' => 'Sciences'],
            ['name' => 'Geography', 'code' => 'GEO', 'level' => 'sss', 'category' => 'Humanities'],
            ['name' => 'History', 'code' => 'HIS', 'level' => 'sss', 'category' => 'Humanities'],
            ['name' => 'Government', 'code' => 'GOV', 'level' => 'sss', 'category' => 'Humanities'],
            ['name' => 'Economics', 'code' => 'ECO', 'level' => 'sss', 'category' => 'Commerce'],
            ['name' => 'Commerce', 'code' => 'CMC', 'level' => 'sss', 'category' => 'Commerce'],
            ['name' => 'Accounting', 'code' => 'ACC', 'level' => 'sss', 'category' => 'Commerce'],
            ['name' => 'Literature in English', 'code' => 'LIT', 'level' => 'sss', 'category' => 'Languages'],
        ];

        $allSubjects = array_merge($primarySubjects, $jssSubjects, $sssSubjects);

        foreach ($allSubjects as $subjectData) {
            Subject::firstOrCreate(
                ['name' => $subjectData['name']],
                array_merge($subjectData, ['is_active' => true])
            );
        }

        // Create Academic Year
        $academicYear = AcademicYear::firstOrCreate(
            ['name' => '2024/2025'],
            [
                'start_date' => '2024-09-01',
                'end_date' => '2025-07-31',
                'is_current' => true,
            ]
        );

        // Create Terms for the academic year
        for ($i = 1; $i <= 3; $i++) {
            Term::firstOrCreate(
                [
                    'academic_year_id' => $academicYear->id,
                    'term_number' => $i,
                ],
                [
                    'name' => "Term {$i}",
                    'is_active' => true,
                ]
            );
        }

        // Associate subjects with existing schools
        $schools = School::all();
        $subjects = Subject::all();
        
        $this->command->info('Associating subjects with ' . $schools->count() . ' schools...');

        foreach ($schools as $school) {
            foreach ($subjects as $subject) {
                // Determine if subject should be enabled based on school type?
                // For MVP, enable all defaults, Principal can disable.
                SchoolSubject::firstOrCreate(
                    [
                        'school_id' => $school->id,
                        'subject_id' => $subject->id
                    ],
                    ['is_enabled' => true]
                );
            }
        }

        $this->command->info('Subjects and Academic Year/Terms seeded and synced successfully!');
    }
}
