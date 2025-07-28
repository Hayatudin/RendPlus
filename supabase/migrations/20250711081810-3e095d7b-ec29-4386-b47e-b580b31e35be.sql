
-- Create admin_fcm_tokens table to store FCM tokens for admin users
CREATE TABLE public.admin_fcm_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.admin_fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage their own FCM tokens
CREATE POLICY "Admin users can manage their own FCM tokens" 
  ON public.admin_fcm_tokens 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for admin users to read all FCM tokens (needed for sending notifications)
CREATE POLICY "Admin users can read all FCM tokens" 
  ON public.admin_fcm_tokens 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE users.id = auth.uid() 
      AND (users.email = 'softcode132@gmail.com' OR users.raw_user_meta_data->>'isAdmin' = 'true')
    )
  );
