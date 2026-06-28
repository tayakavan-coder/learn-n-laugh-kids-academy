CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_insert_own" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_select_auth" ON contact_messages
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "contact_update_auth" ON contact_messages
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "contact_delete_auth" ON contact_messages
  FOR DELETE TO authenticated
  USING (true);

CREATE INDEX contact_messages_created_at_idx ON contact_messages (created_at DESC);
CREATE INDEX contact_messages_status_idx ON contact_messages (status);

CREATE INDEX admissions_created_at_idx ON admissions (created_at DESC);
CREATE INDEX admissions_status_idx ON admissions (status);