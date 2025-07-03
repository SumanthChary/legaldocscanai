
-- Create the esignatures storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'esignatures',
  'esignatures', 
  false,
  10485760,
  ARRAY['application/pdf']
);

-- Create storage policies for esignatures bucket
CREATE POLICY "Users can upload their own esignature documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'esignatures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own esignature documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'esignatures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own esignature documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'esignatures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own esignature documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'esignatures' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
