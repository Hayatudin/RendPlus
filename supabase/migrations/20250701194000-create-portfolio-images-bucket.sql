
-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Create policy to allow public read access to portfolio images  
CREATE POLICY "Allow public read access to portfolio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Create policy to allow authenticated users to update portfolio images
CREATE POLICY "Allow authenticated users to update portfolio images"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete portfolio images
CREATE POLICY "Allow authenticated users to delete portfolio images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
