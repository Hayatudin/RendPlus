
-- Drop existing RLS policies for portfolios table
DROP POLICY IF EXISTS "Enable all actions for admins only" ON public.portfolios;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.portfolios;

-- Create new RLS policies that don't reference auth.users table
-- Allow public read access to portfolios
CREATE POLICY "Enable read access for all users" 
ON public.portfolios 
FOR SELECT 
USING (true);

-- Allow admin users to manage portfolios (using email check)
CREATE POLICY "Enable all actions for admin users" 
ON public.portfolios 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'softcode132@gmail.com');
