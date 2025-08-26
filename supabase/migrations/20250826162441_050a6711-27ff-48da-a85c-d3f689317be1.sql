-- Fix search path security issues for all functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_user_strike(target_user_id UUID)
RETURNS TABLE(new_strike_count INTEGER, is_suspended BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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