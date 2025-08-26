-- Create user_strikes table to track moderation violations
CREATE TABLE public.user_strikes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strike_count INTEGER NOT NULL DEFAULT 0,
  last_strike_at TIMESTAMP WITH TIME ZONE,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  suspended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create moderated_content table to log all moderation actions
CREATE TABLE public.moderated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('valid', 'spam')),
  reason TEXT NOT NULL,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('keep', 'remove', 'suspend')),
  strike_level INTEGER NOT NULL,
  related_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderated_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_strikes
CREATE POLICY "Users can view their own strikes" 
ON public.user_strikes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all strikes" 
ON public.user_strikes 
FOR ALL 
USING (auth.role() = 'service_role');

-- RLS policies for moderated_content  
CREATE POLICY "Users can view their own moderation history" 
ON public.moderated_content 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all moderation content" 
ON public.moderated_content 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add trigger for updating timestamps
CREATE TRIGGER update_user_strikes_updated_at
BEFORE UPDATE ON public.user_strikes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment user strikes
CREATE OR REPLACE FUNCTION public.increment_user_strike(target_user_id UUID)
RETURNS TABLE(new_strike_count INTEGER, is_suspended BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_strikes INTEGER;
  should_suspend BOOLEAN := FALSE;
BEGIN
  -- Insert or update user strikes
  INSERT INTO public.user_strikes (user_id, strike_count, last_strike_at)
  VALUES (target_user_id, 1, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    strike_count = user_strikes.strike_count + 1,
    last_strike_at = now(),
    updated_at = now();
  
  -- Get the current strike count
  SELECT strike_count INTO current_strikes
  FROM public.user_strikes
  WHERE user_id = target_user_id;
  
  -- Suspend user if they reach 3 strikes
  IF current_strikes >= 3 THEN
    should_suspend := TRUE;
    UPDATE public.user_strikes 
    SET is_suspended = TRUE, suspended_at = now()
    WHERE user_id = target_user_id;
  END IF;
  
  RETURN QUERY SELECT current_strikes, should_suspend;
END;
$$;