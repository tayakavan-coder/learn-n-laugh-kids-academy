/*
# Storage policies for school-images bucket

1. Storage
- Public bucket 'school-images' for teacher photos and gallery images
2. Security
- Public read for all
- Authenticated users can upload/update/delete
*/

DROP POLICY IF EXISTS "public_read_school_images" ON storage.objects;
CREATE POLICY "public_read_school_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'school-images');

DROP POLICY IF EXISTS "auth_insert_school_images" ON storage.objects;
CREATE POLICY "auth_insert_school_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'school-images');

DROP POLICY IF EXISTS "auth_update_school_images" ON storage.objects;
CREATE POLICY "auth_update_school_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'school-images') WITH CHECK (bucket_id = 'school-images');

DROP POLICY IF EXISTS "auth_delete_school_images" ON storage.objects;
CREATE POLICY "auth_delete_school_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'school-images');
