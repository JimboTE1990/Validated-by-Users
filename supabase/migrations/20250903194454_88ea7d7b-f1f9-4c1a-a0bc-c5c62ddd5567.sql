-- Fix critical security issues identified in security scan

-- 1. CRITICAL: Enhance financial data protection for orders table
-- Add additional security checks and audit logging for financial data access

-- Drop existing policies to recreate with enhanced security
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "select_own_orders" ON public.orders;

-- Enhanced RLS policies for orders table with stricter financial data protection
CREATE POLICY "Users can create own orders only with valid auth" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can view own orders only with strict validation" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Service role can manage orders for payment processing" 
ON public.orders 
FOR ALL 
USING (auth.role() = 'service_role');

-- 2. CRITICAL: Restrict public access to comments - require authentication
-- Drop existing public access policy
DROP POLICY IF EXISTS "Users can view active comments" ON public.comments;

-- Create new policy requiring authentication for comment access
CREATE POLICY "Authenticated users can view active comments" 
ON public.comments 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  auth.role() = 'authenticated' AND
  (report_status = 'active' OR auth.uid() = user_id)
);

-- 3. Create audit logging function for financial data access
CREATE OR REPLACE FUNCTION public.log_financial_access(
  p_table_name TEXT,
  p_operation TEXT,
  p_record_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.admin_activity_logs (
      admin_user_id,
      action_type,
      resource_type,
      resource_id,
      details,
      ip_address
    ) VALUES (
      auth.uid(),
      p_operation || '_financial_data',
      p_table_name,
      p_record_id,
      jsonb_build_object(
        'table', p_table_name,
        'operation', p_operation,
        'timestamp', now(),
        'security_level', 'financial'
      ),
      inet_client_addr()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Enhanced profiles table security - ensure proper user data access
-- Add policy to prevent user enumeration
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view limited profile data" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  auth.role() = 'authenticated' AND
  (
    auth.uid() = id OR  -- Own profile (full access)
    id IN (  -- Profiles of users who have interacted with current user
      SELECT DISTINCT user_id FROM public.comments 
      WHERE post_id IN (
        SELECT id FROM public.posts WHERE author_id = auth.uid()
      )
    )
  )
);

-- 5. Add constraint to ensure orders always have valid user_id (prevent NULL injection)
ALTER TABLE public.orders 
ALTER COLUMN user_id SET NOT NULL;

-- 6. Add constraint to ensure comments always have valid user_id
ALTER TABLE public.comments 
ALTER COLUMN user_id SET NOT NULL;

-- 7. Create function to validate financial operations
CREATE OR REPLACE FUNCTION public.validate_financial_operation(
  p_user_id UUID,
  p_amount INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  -- Ensure user is authenticated and amount is reasonable
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Basic amount validation (adjust limits as needed)
  IF p_amount IS NULL OR p_amount < 0 OR p_amount > 100000 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;