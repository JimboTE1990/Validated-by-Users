-- Drop the current public read policy
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;

-- Drop the current service-role-only insert policy  
DROP POLICY IF EXISTS "Only service role can create posts" ON public.posts;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can read posts" 
ON public.posts 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert posts" 
ON public.posts 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

-- Keep the existing update policy (it's already correct)
-- CREATE POLICY "Users can update their own posts" already exists

-- Allow admins/service role to manage all posts
CREATE POLICY "Admins can manage all posts" 
ON public.posts 
FOR ALL 
TO service_role 
USING (true);