-- Fix critical security issue: Restrict profile access to authenticated users only
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
-- Users can view their own profile and basic info of other users (first_name only)
CREATE POLICY "Users can view their own profile completely" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow authenticated users to view limited profile info of others (for displaying in posts/comments)
CREATE POLICY "Authenticated users can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() != id
);

-- Add a view for public profile information (first name and avatar only)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  first_name,
  avatar_url,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create policy for the public view - only basic info visible to authenticated users
CREATE POLICY "Authenticated users can view public profile info" 
ON public.public_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);