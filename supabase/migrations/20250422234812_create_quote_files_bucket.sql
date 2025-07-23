
-- Create a storage bucket for quote files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-files', 'Quote Files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
-- Allow authenticated users to upload files
CREATE POLICY "Anyone can upload files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'quote-files');

-- Allow authenticated users to update files
CREATE POLICY "Anyone can update files" 
ON storage.objects FOR UPDATE
TO authenticated 
USING (bucket_id = 'quote-files');

-- Allow anyone to download files
CREATE POLICY "Anyone can download files" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'quote-files');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete files" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'quote-files');

-- Enable Row Level Security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
