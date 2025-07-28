
-- Create storage bucket for quote submissions if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quote_submissions', 'quote_submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the quote_submissions bucket
CREATE POLICY "Allow authenticated users to upload to quote_submissions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'quote_submissions' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to quote_submissions"
ON storage.objects
FOR SELECT
USING (bucket_id = 'quote_submissions');

CREATE POLICY "Allow admin users to manage quote_submissions"
ON storage.objects
FOR ALL
USING (bucket_id = 'quote_submissions' AND auth.jwt() ->> 'email' = 'softcode132@gmail.com');

-- Add additional columns to quote_files table to store user information
ALTER TABLE public.quote_files 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS project_description TEXT,
ADD COLUMN IF NOT EXISTS service_type TEXT,
ADD COLUMN IF NOT EXISTS preferred_deadline TIMESTAMP WITH TIME ZONE;

-- Update RLS policies to allow better data access for admins
DROP POLICY IF EXISTS "Allow admin users to manage quote files" ON public.quote_files;
CREATE POLICY "Allow admin users to manage quote files" 
ON public.quote_files 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'softcode132@gmail.com');
