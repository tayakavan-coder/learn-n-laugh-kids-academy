-- Unique constraint: one attendance record per student per date
-- Prevents duplicate attendance entries when teachers re-save
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_student_date_unique
  ON attendance (student_id, date);

-- Performance indexes for frequently queried columns
-- students: filter by class, search by name, filter by active status
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students (class_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students (is_active);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON students (admission_number);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students (full_name);

-- attendance: filter by class+date (daily attendance view)
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance (class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance (status);

-- assignments: filter by teacher, class, active status
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments (teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON assignments (class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_is_active ON assignments (is_active);

-- events: filter by date range (upcoming events)
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events (is_active);

-- announcements: filter by active, sort by created_at
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements (is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements (created_at);

-- gallery_images: filter by category, active, sort order
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images (category);
CREATE INDEX IF NOT EXISTS idx_gallery_is_active ON gallery_images (is_active);

-- admissions: filter by status, search by student name
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions (status);
CREATE INDEX IF NOT EXISTS idx_admissions_student_name ON admissions (student_name);

-- contact_messages: filter by status, sort by created_at
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at);

-- profiles: filter by role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- classes: filter by active
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON classes (is_active);
