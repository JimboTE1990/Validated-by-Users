-- Fix security vulnerability in orders table RLS policies

-- Drop the overly permissive policies
DROP POLICY "insert_order" ON public.orders;
DROP POLICY "update_order" ON public.orders;

-- Create secure INSERT policy: users can only create their own orders, or service role can create any
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR auth.role() = 'service_role'::text
);

-- Create secure UPDATE policy: users can only update their own orders, or service role can update any
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  auth.uid() = user_id OR auth.role() = 'service_role'::text
);