
-- Create a table for portfolios
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  client TEXT NOT NULL,
  year TEXT NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the portfolios table
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Allow all users to read portfolios (for public viewing)
CREATE POLICY "Enable read access for all users" 
ON public.portfolios 
FOR SELECT 
USING (true);

-- Allow only admins to manage portfolios
CREATE POLICY "Enable all actions for admins only" 
ON public.portfolios 
FOR ALL
USING (auth.uid() IN ( 
  SELECT users.id
  FROM auth.users
  WHERE ((users.raw_user_meta_data ->> 'isAdmin'::text) = 'true'::text)
));

-- Enable realtime for portfolios table
ALTER TABLE public.portfolios REPLICA IDENTITY FULL;
