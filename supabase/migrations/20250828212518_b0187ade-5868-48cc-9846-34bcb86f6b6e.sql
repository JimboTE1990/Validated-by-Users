-- Add parent_comment_id to comments table to support replies
ALTER TABLE public.comments 
ADD COLUMN parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- Add index for better performance when fetching replies
CREATE INDEX idx_comments_parent_comment_id ON public.comments(parent_comment_id);

-- Update RLS policies to allow post authors to reply to comments on their posts
CREATE POLICY "Post authors can reply to comments on their posts" 
ON public.comments 
FOR INSERT 
WITH CHECK (
  parent_comment_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.posts p
    JOIN public.comments parent_comment ON parent_comment.post_id = p.id
    WHERE p.author_id = auth.uid() 
    AND parent_comment.id = comments.parent_comment_id
  )
);