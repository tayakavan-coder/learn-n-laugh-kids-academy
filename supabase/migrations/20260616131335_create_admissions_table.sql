CREATE TABLE IF NOT EXISTS admissions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name  text NOT NULL,
  parent_name   text NOT NULL,
  phone         text NOT NULL,
  email         text NOT NULL,
  class_applying text NOT NULL,
  message       text,
  status        text NOT NULL DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admissions_insert_anon" ON admissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admissions_select_auth" ON admissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "admissions_update_auth" ON admissions
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admissions_delete_auth" ON admissions
  FOR DELETE TO authenticated
  USING (true);
