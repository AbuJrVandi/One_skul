# Phased Migration Plan: Centralized Subjects & Report Cards

This plan outlines the steps to transition the One_SKul MVP from a basic school directory to a integrated system supporting centralized subjects and automated report cards.

## Goals
- **Consistency**: Centralize subject definitions to prevent duplication and name variations.
- **Relatability**: Connect schools, students, subjects, and grades seamlessly.
- **Scalability**: Ensure the schema can handle multi-term and multi-year data.
- **Safety**: No breaking changes to existing `districts` or `schools` tables.

---

## Phase 1: Foundation (Centralized Entities)
*Objective: Create the master tables that don't depend on existing school data.*

1.  **Create `subjects` Table**:
    - Fields: `id`, `name` (unique), `code` (unique), `category` (e.g., Science, Arts), `is_active`.
2.  **Create `academic_years` Table**:
    - Fields: `id`, `name` (e.g., "2023/2024"), `start_date`, `end_date`, `is_current`.
3.  **Create `terms` Table**:
    - Fields: `id`, `academic_year_id`, `name` (e.g., "Term 1"), `type` (e.g., First, Second, Third).

---

## Phase 2: School & Student Integration
*Objective: Connect the central entities to specific schools and introduce students.*

1.  **Create `school_subject` (Pivot Table)**:
    - Fields: `school_id`, `subject_id`.
    - *Rationale*: Allows schools to choose which centralized subjects they offer.
2.  **Create `students` Table**:
    - Fields: `id`, `school_id`, `first_name`, `last_name`, `index_number` (unique), `date_of_birth`, `gender`, `grade_level` (e.g., JSS1, SSS3).

---

## Phase 3: The Report Card System
*Objective: Build the structure for storing and retrieving student performance data.*

1.  **Create `report_cards` Table**:
    - Fields: `id`, `student_id`, `term_id`, `total_marks`, `average`, `rank`, `attendance`, `teacher_comment`, `principal_comment`.
    - *Note*: This acts as the header/summary for a student's term performance.
2.  **Create `marks` (or `grades`) Table**:
    - Fields: `id`, `report_card_id`, `subject_id`, `continuous_assessment` (CA), `exam_score`, `total_score`, `grade`, `position_in_subject`.

---

## Phase 4: Data Migration (If applicable)
*Objective: Safely move any legacy data to the new structure.*

1.  **Identify Legacy Data**: Check for any ad-hoc subject strings in existing tables (none found in current schema).
2.  **Seeding**: Populate the `subjects` table with a standard curriculum (e.g., West African Curriculum).
3.  **Cross-Check**: Ensure all existing `schools` can be associated with the new `students` and `subjects`.

---

## Phase 5: Business Logic & UI
*Objective: Enable users to interact with the new data structures.*

1.  **Models & Relationships**:
    - Define `belongsTo`, `hasMany`, and `belongsToMany` in Eloquent models.
2.  **Admin UI**: Dashboard to manage the central `subjects` list.
3.  **School Portal**: Interfaces for enrolling students and assigning subjects to schools.
4.  **Mark Entry**: A grid-like interface for teachers to enter CA and Exam scores.
5.  **PDF Generation**: Implement a service to generate the actual Report Card PDF.

---

## Safety Checklist
- [ ] **Backups**: Always backup the environment before running migrations.
- [ ] **Foreign Keys**: Ensure `onDelete('cascade')` or `onDelete('restrict')` as appropriate.
- [ ] **Indexing**: Add indexes to `student_id`, `subject_id`, and `term_id` for fast reporting.
- [ ] **Validation**: Update request validators to ensure `subject_id` exists in the master list.
