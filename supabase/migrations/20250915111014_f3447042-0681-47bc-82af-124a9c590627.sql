-- Phase 1: Critical Security Fixes

-- 1. Enable RLS on admin_session_info table (currently exposed)
ALTER TABLE public.admin_session_info ENABLE ROW LEVEL SECURITY;

-- 2. Create secure policies for admin_session_info
CREATE POLICY "Admins can view their own session info" 
ON public.admin_session_info 
FOR SELECT 
USING (
  admin_user_id = auth.uid() 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "System can manage admin session info" 
ON public.admin_session_info 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- 3. Clean up any remaining plaintext session tokens
UPDATE public.admin_sessions 
SET session_token = NULL 
WHERE session_token_hash IS NOT NULL AND session_token IS NOT NULL;

-- 4. Add index for better performance on security-sensitive queries
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active_user 
ON public.admin_sessions (admin_user_id, is_active, expires_at) 
WHERE is_active = true;

-- 5. Add rate limiting table for waitlist signups
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user identifier
  action TEXT NOT NULL, -- 'waitlist_signup', 'login_attempt', etc.
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy for rate_limits - only system can manage
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- 6. Create function for rate limiting checks
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_attempts INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean up old rate limit records (older than 24 hours)
  DELETE FROM public.rate_limits 
  WHERE window_start < (now() - interval '24 hours');
  
  -- Get current attempts within the time window
  SELECT attempts, window_start INTO current_attempts, window_start_time
  FROM public.rate_limits 
  WHERE identifier = p_identifier 
    AND action = p_action 
    AND window_start > (now() - interval '1 hour' * p_window_minutes / 60);
  
  -- If no record exists or window has expired, create new record
  IF current_attempts IS NULL OR window_start_time < (now() - interval '1 hour' * p_window_minutes / 60) THEN
    INSERT INTO public.rate_limits (identifier, action, attempts, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT ON CONSTRAINT rate_limits_pkey DO NOTHING;
    RETURN TRUE;
  END IF;
  
  -- If within limits, increment and allow
  IF current_attempts < p_max_attempts THEN
    UPDATE public.rate_limits 
    SET attempts = attempts + 1, updated_at = now()
    WHERE identifier = p_identifier AND action = p_action;
    RETURN TRUE;
  END IF;
  
  -- Rate limit exceeded
  RETURN FALSE;
END;
$$;

-- 7. Add trigger for automatic cleanup of expired admin sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Deactivate expired sessions
  UPDATE public.admin_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  -- Delete old inactive sessions (older than 7 days)
  DELETE FROM public.admin_sessions 
  WHERE is_active = false 
    AND last_activity < (now() - interval '7 days');
END;
$$;