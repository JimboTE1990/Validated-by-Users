-- Remove the policy that allows direct post creation
DROP POLICY "Users can create their own posts" ON public.posts;

-- Create a restrictive policy that only allows service role to create posts
-- This ensures posts can only be created through edge functions after payment
CREATE POLICY "Only service role can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role'::text);