-- Fix overly broad admin permissions on posts table
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;

-- Create granular admin policies for posts
CREATE POLICY "Admins can view all posts" 
ON public.posts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update post status and contest management" 
ON public.posts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  -- Admins can only update specific administrative fields
  (OLD.author_id = NEW.author_id) AND 
  (OLD.created_at = NEW.created_at) AND
  (OLD.prize_pool = NEW.prize_pool OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can delete posts for moderation" 
ON public.posts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Restrict post images to authenticated users only (no more public access to business strategies)
DROP POLICY IF EXISTS "Post images are viewable by everyone" ON public.post_images;

CREATE POLICY "Authenticated users can view post images" 
ON public.post_images 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    -- Post author can always see their images
    auth.uid() IN (SELECT author_id FROM posts WHERE id = post_images.post_id) OR
    -- Users who commented on the post can see images
    auth.uid() IN (SELECT user_id FROM comments WHERE post_id = post_images.post_id) OR
    -- Admins can see all images for moderation
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Add admin activity logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when admins modify prize pools or contest status
  IF (TG_OP = 'UPDATE' AND has_role(auth.uid(), 'admin'::app_role)) THEN
    IF (OLD.prize_pool != NEW.prize_pool OR OLD.status != NEW.status OR OLD.contest_completed != NEW.contest_completed) THEN
      PERFORM log_admin_activity(
        'sensitive_post_modification',
        'posts',
        NEW.id,
        jsonb_build_object(
          'old_prize_pool', OLD.prize_pool,
          'new_prize_pool', NEW.prize_pool,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'old_contest_completed', OLD.contest_completed,
          'new_contest_completed', NEW.contest_completed
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for sensitive admin actions
DROP TRIGGER IF EXISTS log_sensitive_admin_actions ON public.posts;
CREATE TRIGGER log_sensitive_admin_actions
  AFTER UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION log_sensitive_admin_action();