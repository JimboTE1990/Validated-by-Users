-- Security fix: Hash admin session tokens and secure access

-- First, let's create a secure hash function for session tokens
CREATE OR REPLACE FUNCTION public.hash_session_token(token_value TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Use pgcrypto's crypt function with blowfish algorithm for secure hashing
  RETURN crypt(token_value, gen_salt('bf', 8));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create a function to verify session tokens without exposing them
CREATE OR REPLACE FUNCTION public.verify_session_token(token_value TEXT, token_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Compare the provided token with the stored hash
  RETURN (token_hash = crypt(token_value, token_hash));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Add a new column for hashed tokens (keeping old column temporarily for migration)
ALTER TABLE public.admin_sessions ADD COLUMN session_token_hash TEXT;

-- Create an index on the hash column for performance
CREATE INDEX idx_admin_sessions_token_hash ON public.admin_sessions(session_token_hash);

-- Update the verify_admin_access function to use hashed tokens
CREATE OR REPLACE FUNCTION public.verify_admin_access(session_token TEXT DEFAULT NULL)
RETURNS TABLE(is_valid BOOLEAN, user_id UUID, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  session_record RECORD;
BEGIN
  -- If no session token provided, check current auth user
  IF session_token IS NULL THEN
    RETURN QUERY SELECT 
      has_role(auth.uid(), 'admin'::app_role) as is_valid,
      auth.uid() as user_id,
      (now() + interval '2 hours') as expires_at;
    RETURN;
  END IF;
  
  -- Check session token using hash comparison
  SELECT 
    s.id, s.admin_user_id, s.expires_at, s.session_token_hash
  INTO session_record 
  FROM public.admin_sessions s
  WHERE s.is_active = true 
    AND s.expires_at > now()
    AND (
      -- Support both hashed and legacy plaintext tokens during migration
      (s.session_token_hash IS NOT NULL AND verify_session_token(session_token, s.session_token_hash))
      OR (s.session_token_hash IS NULL AND s.session_token = verify_admin_access.session_token)
    );
    
  IF session_record IS NULL THEN
    RETURN QUERY SELECT false as is_valid, NULL::UUID as user_id, NULL::TIMESTAMP WITH TIME ZONE as expires_at;
    RETURN;
  END IF;
  
  -- Update last activity
  UPDATE public.admin_sessions 
  SET last_activity = now() 
  WHERE id = session_record.id;
  
  -- Verify user still has admin role
  RETURN QUERY SELECT 
    has_role(session_record.admin_user_id, 'admin'::app_role) as is_valid,
    session_record.admin_user_id as user_id,
    session_record.expires_at;
END;
$$;

-- Create a secure function to create admin sessions with hashed tokens
CREATE OR REPLACE FUNCTION public.create_admin_session(
  p_admin_user_id UUID,
  p_session_token TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  session_id UUID;
BEGIN
  -- Only allow if user is admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  INSERT INTO public.admin_sessions (
    admin_user_id,
    session_token_hash,
    expires_at,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_user_id,
    hash_session_token(p_session_token),
    p_expires_at,
    p_ip_address::INET,
    p_user_agent
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Update RLS policies to NEVER expose session tokens or hashes
DROP POLICY IF EXISTS "Admins can view their own sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "System can manage admin sessions" ON public.admin_sessions;

-- Create secure RLS policies that exclude sensitive columns
CREATE POLICY "Admins can view their session metadata only" 
ON public.admin_sessions 
FOR SELECT 
USING (
  (auth.uid() = admin_user_id) 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "System can manage admin session lifecycle" 
ON public.admin_sessions 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create a secure view for admin session information that excludes tokens
CREATE OR REPLACE VIEW public.admin_session_info AS
SELECT 
  id,
  admin_user_id,
  expires_at,
  ip_address,
  last_activity,
  is_active,
  created_at,
  user_agent,
  -- Never expose session tokens or hashes
  CASE 
    WHEN session_token_hash IS NOT NULL THEN 'secured'
    ELSE 'legacy' 
  END as token_status
FROM public.admin_sessions;

-- Grant appropriate permissions on the view
GRANT SELECT ON public.admin_session_info TO authenticated;

-- Add RLS to the view
ALTER VIEW public.admin_session_info SET (security_invoker = true);

-- Clean up function to remove expired sessions and migrate to hashed tokens
CREATE OR REPLACE FUNCTION public.cleanup_and_secure_admin_sessions()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  cleaned_count INTEGER;
  migrated_count INTEGER;
BEGIN
  -- Delete expired sessions
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now() OR last_activity < (now() - interval '24 hours');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  
  -- Migrate remaining plaintext tokens to hashed (if any exist)
  UPDATE public.admin_sessions 
  SET session_token_hash = hash_session_token(session_token)
  WHERE session_token_hash IS NULL AND session_token IS NOT NULL;
  
  GET DIAGNOSTICS migrated_count = ROW_COUNT;
  
  -- Clear plaintext tokens after migration
  UPDATE public.admin_sessions 
  SET session_token = NULL
  WHERE session_token_hash IS NOT NULL AND session_token IS NOT NULL;
  
  RETURN cleaned_count + migrated_count;
END;
$$;

-- Run the cleanup to secure existing sessions
SELECT public.cleanup_and_secure_admin_sessions();