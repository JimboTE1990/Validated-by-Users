-- Fix RLS policies for comments table - currently too permissive
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;

-- Create more restrictive comment viewing policies
CREATE POLICY "Users can view active comments" 
ON public.comments 
FOR SELECT 
USING (report_status = 'active' OR auth.uid() = user_id);

-- Add policy for post authors to view reported comments on their posts
CREATE POLICY "Post authors can view reported comments on their posts" 
ON public.comments 
FOR SELECT 
USING (
  is_reported_by_author = true 
  AND EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = comments.post_id 
    AND posts.author_id = auth.uid()
  )
);

-- Create winners table to track contest results
CREATE TABLE public.winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  comment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  prize_amount NUMERIC NOT NULL,
  position INTEGER NOT NULL, -- 1st, 2nd, 3rd place etc
  payout_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on winners table
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Winners can view their own results
CREATE POLICY "Winners can view their own results" 
ON public.winners 
FOR SELECT 
USING (user_id = auth.uid());

-- Post authors can view winners of their posts
CREATE POLICY "Post authors can view winners of their posts" 
ON public.winners 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = winners.post_id 
    AND posts.author_id = auth.uid()
  )
);

-- Service role can manage all winner records
CREATE POLICY "Service role can manage winners" 
ON public.winners 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add updated_at trigger for winners
CREATE TRIGGER update_winners_updated_at
  BEFORE UPDATE ON public.winners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update posts table to track contest completion
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS contest_completed BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS winners_selected_at TIMESTAMPTZ;