-- Security Improvements: Admin Protection and Privacy Policies

-- 1. Create admin activity logging table
CREATE TABLE public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin logs
CREATE POLICY "Admins can view all admin logs" ON public.admin_activity_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert admin logs
CREATE POLICY "System can insert admin logs" ON public.admin_activity_logs
FOR INSERT WITH CHECK (true);

-- 2. Create admin session tracking table
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can only view their own sessions
CREATE POLICY "Admins can view their own sessions" ON public.admin_sessions
FOR SELECT USING (auth.uid() = admin_user_id AND has_role(auth.uid(), 'admin'::app_role));

-- System can manage admin sessions
CREATE POLICY "System can manage admin sessions" ON public.admin_sessions
FOR ALL USING (auth.role() = 'service_role');

-- 3. Enhance user_roles table security - prevent admin role removal
CREATE POLICY "Prevent admin role removal" ON public.user_roles
FOR DELETE USING (
  CASE 
    WHEN role = 'admin'::app_role THEN false 
    ELSE has_role(auth.uid(), 'admin'::app_role)
  END
);

-- 4. Create secure admin verification function
CREATE OR REPLACE FUNCTION public.verify_admin_access(session_token TEXT DEFAULT NULL)
RETURNS TABLE(is_valid BOOLEAN, user_id UUID, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
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
  
  -- Check session token
  SELECT * INTO session_record 
  FROM public.admin_sessions 
  WHERE session_token = verify_admin_access.session_token 
    AND is_active = true 
    AND expires_at > now();
    
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

-- 5. Create admin activity logging function
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action_type TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  -- Only allow if user is admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  INSERT INTO public.admin_activity_logs (
    admin_user_id,
    action_type,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address::INET,
    p_user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 6. Create function to clean up expired admin sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now() OR last_activity < (now() - interval '24 hours');
  
  GET DIAGNOSTICS cleaned_count = ROW_COUNT;
  RETURN cleaned_count;
END;
$$;