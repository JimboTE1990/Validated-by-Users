-- Add reporting functionality to comments table
ALTER TABLE public.comments 
ADD COLUMN is_reported_by_author BOOLEAN DEFAULT FALSE,
ADD COLUMN report_status TEXT DEFAULT 'active' CHECK (report_status IN ('active', 'reported_for_review', 'reviewed_approved', 'reviewed_removed')),
ADD COLUMN reported_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN report_reason TEXT;

-- Create a table to track feedback reports by post authors
CREATE TABLE public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    report_reason TEXT NOT NULL,
    report_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(comment_id, reporter_id) -- Prevent duplicate reports from same user
);

-- Enable RLS on feedback_reports
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for feedback_reports
CREATE POLICY "Post authors can create reports for their posts"
ON public.feedback_reports
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.posts p 
        WHERE p.id = post_id AND p.author_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own reports"
ON public.feedback_reports
FOR SELECT
TO authenticated
USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
ON public.feedback_reports
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle feedback reporting by post authors
CREATE OR REPLACE FUNCTION public.report_feedback_as_author(
    p_comment_id UUID,
    p_report_reason TEXT,
    p_report_details TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_post_id UUID;
    v_post_author_id UUID;
    v_result JSON;
BEGIN
    -- Get post info and verify the reporter is the post author
    SELECT c.post_id, p.author_id
    INTO v_post_id, v_post_author_id
    FROM public.comments c
    JOIN public.posts p ON p.id = c.post_id
    WHERE c.id = p_comment_id;
    
    -- Check if user is the post author
    IF v_post_author_id != auth.uid() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only post authors can report feedback on their posts'
        );
    END IF;
    
    -- Insert the report
    INSERT INTO public.feedback_reports (comment_id, post_id, reporter_id, report_reason, report_details)
    VALUES (p_comment_id, v_post_id, auth.uid(), p_report_reason, p_report_details)
    ON CONFLICT (comment_id, reporter_id) DO UPDATE SET
        report_reason = EXCLUDED.report_reason,
        report_details = EXCLUDED.report_details,
        created_at = now();
    
    -- Update the comment status
    UPDATE public.comments 
    SET 
        is_reported_by_author = TRUE,
        report_status = 'reported_for_review',
        reported_at = now(),
        report_reason = p_report_reason
    WHERE id = p_comment_id;
    
    -- Return success response
    RETURN json_build_object(
        'success', true,
        'action', 'hide',
        'status', 'reported_for_review',
        'note', 'Feedback hidden from requestor pending moderation review.'
    );
END;
$$;

-- Function to get visible comments for post author (excludes reported ones)
CREATE OR REPLACE FUNCTION public.get_comments_for_author(p_post_id UUID)
RETURNS TABLE (
    id UUID,
    content TEXT,
    user_id UUID,
    post_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    likes INTEGER,
    is_boosted BOOLEAN,
    is_reported_by_author BOOLEAN,
    report_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the requesting user is the post author
    IF NOT EXISTS (
        SELECT 1 FROM public.posts 
        WHERE posts.id = p_post_id AND posts.author_id = auth.uid()
    ) THEN
        -- If not the post author, return all non-reported comments
        RETURN QUERY
        SELECT 
            c.id, c.content, c.user_id, c.post_id, c.created_at, c.updated_at, 
            c.likes, c.is_boosted, c.is_reported_by_author, c.report_status
        FROM public.comments c
        WHERE c.post_id = p_post_id 
        AND c.report_status = 'active'
        ORDER BY c.created_at DESC;
    ELSE
        -- If post author, exclude comments they've reported
        RETURN QUERY
        SELECT 
            c.id, c.content, c.user_id, c.post_id, c.created_at, c.updated_at, 
            c.likes, c.is_boosted, c.is_reported_by_author, c.report_status
        FROM public.comments c
        WHERE c.post_id = p_post_id 
        AND NOT c.is_reported_by_author
        ORDER BY c.created_at DESC;
    END IF;
END;
$$;