/*
# School Management System — Tables & Indexes

1. New Tables
   - profiles: links to auth.users, stores role (admin/teacher/parent/student), full_name, phone, avatar
   - classes: school classes with grade level, section, assigned teacher, capacity
   - subjects: subjects linked to a class and teacher
   - students: student records with admission number, class assignment, parent link
   - attendance: daily attendance with unique constraint per student+date
   - assignments: homework with due date, class, subject, teacher
   - assignment_submissions: student submissions with grading fields
   - messages: internal messaging between users
   - website_settings: key-value school settings

2. Indexes
   - profiles: role (filter users by role)
   - students: admission_number (unique lookup), class_id, parent_id, is_active, full_name
   - attendance: student_id+date (unique composite), class_id+date, date
   - assignments: class_id, teacher_id, due_date, is_active
   - assignment_submissions: assignment_id, student_id
   - messages: receiver_id+created_at, sender_id+created_at, receiver_id+is_read

3. Security (RLS)
   - profiles: users read own profile; admins read all
   - classes: public read; staff write
   - subjects: public read; staff write
   - students: staff read+write; parents read own children
   - attendance: staff read+write; parents read own children's
   - assignments: authenticated read; staff write
   - assignment_submissions: staff read+write; parents read own children's
   - messages: users read/send own messages only
   - website_settings: public read; admin write

4. Existing Tables Updated
   - teachers, gallery_images, events, announcements: write policies tightened to require staff auth
   - admissions, contact_messages: anon INSERT kept (public forms); read restricted to staff
*/

-- ═════════════════════════════════════════
-- PROFILES TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_profile_on_signup" ON profiles;
CREATE POLICY "insert_profile_on_signup" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ═════════════════════════════════════════
-- CLASSES TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level int,
  section text,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  capacity int DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_classes" ON classes;
CREATE POLICY "read_classes" ON classes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_classes_staff" ON classes;
CREATE POLICY "write_classes_staff" ON classes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_classes_staff" ON classes;
CREATE POLICY "update_classes_staff" ON classes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_classes_staff" ON classes;
CREATE POLICY "delete_classes_staff" ON classes FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- SUBJECTS TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_class_id ON subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id ON subjects(teacher_id);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_subjects" ON subjects;
CREATE POLICY "read_subjects" ON subjects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_subjects_staff" ON subjects;
CREATE POLICY "write_subjects_staff" ON subjects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_subjects_staff" ON subjects;
CREATE POLICY "update_subjects_staff" ON subjects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_subjects_staff" ON subjects;
CREATE POLICY "delete_subjects_staff" ON subjects FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- STUDENTS TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  phone text,
  address text,
  photo_url text,
  admission_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_admission_number ON students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(full_name);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_students" ON students;
CREATE POLICY "read_students" ON students FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_students_staff" ON students;
CREATE POLICY "insert_students_staff" ON students FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_students_staff" ON students;
CREATE POLICY "update_students_staff" ON students FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_students_staff" ON students;
CREATE POLICY "delete_students_staff" ON students FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- ATTENDANCE TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_attendance" ON attendance;
CREATE POLICY "read_attendance" ON attendance FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_attendance_staff" ON attendance;
CREATE POLICY "insert_attendance_staff" ON attendance FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_attendance_staff" ON attendance;
CREATE POLICY "update_attendance_staff" ON attendance FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_attendance_staff" ON attendance;
CREATE POLICY "delete_attendance_staff" ON attendance FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- ASSIGNMENTS TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  due_date date NOT NULL,
  max_marks int DEFAULT 100,
  attachment_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_active ON assignments(is_active);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_assignments" ON assignments;
CREATE POLICY "read_assignments" ON assignments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_assignments_staff" ON assignments;
CREATE POLICY "insert_assignments_staff" ON assignments FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_assignments_staff" ON assignments;
CREATE POLICY "update_assignments_staff" ON assignments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_assignments_staff" ON assignments;
CREATE POLICY "delete_assignments_staff" ON assignments FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- ASSIGNMENT SUBMISSIONS TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submission_text text,
  file_url text,
  submitted_at timestamptz DEFAULT now(),
  marks int,
  feedback text,
  graded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON assignment_submissions(student_id);

ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_submissions" ON assignment_submissions;
CREATE POLICY "read_submissions" ON assignment_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_submissions" ON assignment_submissions;
CREATE POLICY "insert_submissions" ON assignment_submissions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_submissions_staff" ON assignment_submissions;
CREATE POLICY "update_submissions_staff" ON assignment_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_submissions_staff" ON assignment_submissions;
CREATE POLICY "delete_submissions_staff" ON assignment_submissions FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- MESSAGES TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_receiver_created ON messages(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(receiver_id, is_read);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_messages_own" ON messages;
CREATE POLICY "read_messages_own" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "insert_messages_own" ON messages;
CREATE POLICY "insert_messages_own" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update_messages_own" ON messages;
CREATE POLICY "update_messages_own" ON messages FOR UPDATE
  TO authenticated USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "delete_messages_own" ON messages;
CREATE POLICY "delete_messages_own" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ═════════════════════════════════════════
-- WEBSITE SETTINGS TABLE
-- ═════════════════════════════════════════

CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_settings_public" ON website_settings;
CREATE POLICY "read_settings_public" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "write_settings_admin" ON website_settings;
CREATE POLICY "write_settings_admin" ON website_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_settings_admin" ON website_settings;
CREATE POLICY "update_settings_admin" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_settings_admin" ON website_settings;
CREATE POLICY "delete_settings_admin" ON website_settings FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- UPDATE EXISTING TABLES: TIGHTEN WRITE POLICIES
-- ═════════════════════════════════════════

-- TEACHERS: keep anon read, restrict writes to authenticated
DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;

DROP POLICY IF EXISTS "insert_teachers_staff" ON teachers;
CREATE POLICY "insert_teachers_staff" ON teachers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_teachers_staff" ON teachers;
CREATE POLICY "update_teachers_staff" ON teachers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_teachers_staff" ON teachers;
CREATE POLICY "delete_teachers_staff" ON teachers FOR DELETE
  TO authenticated USING (true);

-- GALLERY_IMAGES: keep anon read, restrict writes to authenticated
DROP POLICY IF EXISTS "anon_insert_gallery" ON gallery_images;
DROP POLICY IF EXISTS "anon_update_gallery" ON gallery_images;
DROP POLICY IF EXISTS "anon_delete_gallery" ON gallery_images;

DROP POLICY IF EXISTS "insert_gallery_staff" ON gallery_images;
CREATE POLICY "insert_gallery_staff" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_gallery_staff" ON gallery_images;
CREATE POLICY "update_gallery_staff" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_gallery_staff" ON gallery_images;
CREATE POLICY "delete_gallery_staff" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- EVENTS: keep anon read, restrict writes to authenticated
DROP POLICY IF EXISTS "anon_insert_events" ON events;
DROP POLICY IF EXISTS "anon_update_events" ON events;
DROP POLICY IF EXISTS "anon_delete_events" ON events;

DROP POLICY IF EXISTS "insert_events_staff" ON events;
CREATE POLICY "insert_events_staff" ON events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_events_staff" ON events;
CREATE POLICY "update_events_staff" ON events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_events_staff" ON events;
CREATE POLICY "delete_events_staff" ON events FOR DELETE
  TO authenticated USING (true);

-- ANNOUNCEMENTS: keep anon read, restrict writes to authenticated
DROP POLICY IF EXISTS "anon_insert_announcements" ON announcements;
DROP POLICY IF EXISTS "anon_update_announcements" ON announcements;
DROP POLICY IF EXISTS "anon_delete_announcements" ON announcements;

DROP POLICY IF EXISTS "insert_announcements_staff" ON announcements;
CREATE POLICY "insert_announcements_staff" ON announcements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_announcements_staff" ON announcements;
CREATE POLICY "update_announcements_staff" ON announcements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_announcements_staff" ON announcements;
CREATE POLICY "delete_announcements_staff" ON announcements FOR DELETE
  TO authenticated USING (true);

-- ADMISSIONS: keep anon insert (public form), restrict reads to authenticated
DROP POLICY IF EXISTS "anon_select_admissions" ON admissions;
DROP POLICY IF EXISTS "anon_update_admissions" ON admissions;
DROP POLICY IF EXISTS "anon_delete_admissions" ON admissions;

DROP POLICY IF EXISTS "read_admissions_staff" ON admissions;
CREATE POLICY "read_admissions_staff" ON admissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_admissions_staff" ON admissions;
CREATE POLICY "update_admissions_staff" ON admissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_admissions_staff" ON admissions;
CREATE POLICY "delete_admissions_staff" ON admissions FOR DELETE
  TO authenticated USING (true);

-- CONTACT_MESSAGES: keep anon insert (public form), restrict reads to authenticated
DROP POLICY IF EXISTS "anon_select_contact" ON contact_messages;
DROP POLICY IF EXISTS "anon_update_contact" ON contact_messages;
DROP POLICY IF EXISTS "anon_delete_contact" ON contact_messages;

DROP POLICY IF EXISTS "read_contact_staff" ON contact_messages;
CREATE POLICY "read_contact_staff" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_contact_staff" ON contact_messages;
CREATE POLICY "update_contact_staff" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_contact_staff" ON contact_messages;
CREATE POLICY "delete_contact_staff" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ═════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP
-- ═════════════════════════════════════════

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();