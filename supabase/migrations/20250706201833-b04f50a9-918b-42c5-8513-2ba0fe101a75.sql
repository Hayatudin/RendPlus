
-- Create storage bucket for quote files if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quote_files', 'quote_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload quote files
CREATE POLICY "Allow authenticated users to upload quote files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'quote_files' AND auth.role() = 'authenticated');

-- Create policy to allow public read access to quote files  
CREATE POLICY "Allow public read access to quote files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'quote_files');

-- Create policy to allow authenticated users to update quote files
CREATE POLICY "Allow authenticated users to update quote files"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'quote_files' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete quote files
CREATE POLICY "Allow authenticated users to delete quote files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'quote_files' AND auth.role() = 'authenticated');

-- Update the quote_files table to allow authenticated users to insert files
DROP POLICY IF EXISTS "Authenticated users can view files" ON public.quote_files;

-- Create new RLS policies for quote_files table
CREATE POLICY "Allow authenticated users to insert quote files" 
ON public.quote_files 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view quote files" 
ON public.quote_files 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin users to manage quote files" 
ON public.quote_files 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'softcode132@gmail.com');
