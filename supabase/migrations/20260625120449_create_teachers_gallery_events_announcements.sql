/*
# Create teachers, gallery, events, and announcements tables

1. New Tables
- `teachers` — staff profiles displayed on the website (name, role, qualification, experience, photo URL, display order, active flag)
- `gallery_images` — gallery photos for the masonry grid (image URL, title, category, display order, active flag)
- `events` — school events showcase (title, description, date, image URL, active flag)
- `announcements` — short announcement banners (title, body, active flag, sort order)

2. Security
- All tables have RLS enabled.
- Public read (anon + authenticated) for all four tables so the website can display content.
- Write operations (insert/update/delete) restricted to authenticated users (admin dashboard).
*/

CREATE TABLE IF NOT EXISTS teachers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text NOT NULL,
  qualification text,
  experience    text,
  specialization text,
  photo_url     text,
  chip          text,
  color         text DEFAULT '#FF4FA3',
  sort_order    int  NOT NULL DEFAULT 0,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_teachers" ON teachers;
CREATE POLICY "public_read_teachers" ON teachers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_teachers" ON teachers;
CREATE POLICY "auth_insert_teachers" ON teachers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_teachers" ON teachers;
CREATE POLICY "auth_update_teachers" ON teachers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_teachers" ON teachers;
CREATE POLICY "auth_delete_teachers" ON teachers FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS gallery_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text,
  image_url  text NOT NULL,
  category   text DEFAULT 'general',
  sort_order int  NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery_images;
CREATE POLICY "public_read_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery_images;
CREATE POLICY "auth_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery_images;
CREATE POLICY "auth_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery_images;
CREATE POLICY "auth_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  event_date  date,
  image_url   text,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_events" ON events;
CREATE POLICY "auth_insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_events" ON events;
CREATE POLICY "auth_update_events" ON events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_events" ON events;
CREATE POLICY "auth_delete_events" ON events FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  body       text,
  is_active  boolean NOT NULL DEFAULT true,
  sort_order int  NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_announcements" ON announcements;
CREATE POLICY "auth_insert_announcements" ON announcements FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_announcements" ON announcements;
CREATE POLICY "auth_update_announcements" ON announcements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_announcements" ON announcements;
CREATE POLICY "auth_delete_announcements" ON announcements FOR DELETE
  TO authenticated USING (true);

-- Indexes for sorting
CREATE INDEX IF NOT EXISTS teachers_sort_order_idx ON teachers (sort_order);
CREATE INDEX IF NOT EXISTS gallery_sort_order_idx ON gallery_images (sort_order);
CREATE INDEX IF NOT EXISTS events_sort_order_idx ON events (sort_order);
CREATE INDEX IF NOT EXISTS announcements_sort_order_idx ON announcements (sort_order);

-- Seed default teachers
INSERT INTO teachers (name, role, qualification, experience, specialization, photo_url, chip, color, sort_order)
VALUES
  ('Mrs. Sarah Mitchell', 'Head of Early Years', 'M.Ed. Early Childhood Education', '12 Years Experience', 'Montessori & Play-Based Learning', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=500', 'Lead Educator', '#FF4FA3', 1),
  ('Mr. James Okafor', 'Creative Arts Teacher', 'B.Ed. Arts & Education', '8 Years Experience', 'Visual Arts, Music & Drama', 'https://images.pexels.com/photos/8617673/pexels-photo-8617673.jpeg?auto=compress&cs=tinysrgb&w=500', 'Arts Specialist', '#3B82F6', 2),
  ('Ms. Priya Sharma', 'STEM & Science Teacher', 'M.Sc. Child Development', '9 Years Experience', 'Coding, Science & Mathematics', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=500', 'STEM Expert', '#22C55E', 3)
ON CONFLICT DO NOTHING;

-- Seed default gallery images
INSERT INTO gallery_images (title, image_url, category, sort_order)
VALUES
  ('Children Learning', 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=900', 'classroom', 1),
  ('Art and Craft', 'https://images.pexels.com/photos/8617673/pexels-photo-8617673.jpeg?auto=compress&cs=tinysrgb&w=600', 'activities', 2),
  ('Outdoor Play', 'https://images.pexels.com/photos/8613165/pexels-photo-8613165.jpeg?auto=compress&cs=tinysrgb&w=600', 'outdoor', 3),
  ('Science Activity', 'https://images.pexels.com/photos/8612987/pexels-photo-8612987.jpeg?auto=compress&cs=tinysrgb&w=600', 'activities', 4),
  ('Annual Celebration', 'https://images.pexels.com/photos/8612929/pexels-photo-8612929.jpeg?auto=compress&cs=tinysrgb&w=900', 'events', 5),
  ('Sports Day', 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=600', 'events', 6)
ON CONFLICT DO NOTHING;

-- Seed default events
INSERT INTO events (title, description, event_date, image_url, sort_order)
VALUES
  ('Annual Day Celebration', 'A spectacular showcase of talent, music, and dance by our little stars.', '2025-12-15', 'https://images.pexels.com/photos/8612929/pexels-photo-8612929.jpeg?auto=compress&cs=tinysrgb&w=700', 1),
  ('Science Exhibition', 'Young innovators present their exciting science projects and experiments.', '2025-11-20', 'https://images.pexels.com/photos/8612987/pexels-photo-8612987.jpeg?auto=compress&cs=tinysrgb&w=700', 2),
  ('Sports Day', 'Fun-filled outdoor activities and games for all our young athletes.', '2026-01-10', 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=700', 3)
ON CONFLICT DO NOTHING;

-- Seed default announcement
INSERT INTO announcements (title, body, is_active, sort_order)
VALUES
  ('Admissions Open 2025-26', 'Limited seats available! Apply now to secure your child''s place at Learn''N Laugh Kids Academy.', true, 1)
ON CONFLICT DO NOTHING;
