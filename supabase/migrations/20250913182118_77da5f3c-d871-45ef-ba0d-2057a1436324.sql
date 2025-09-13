-- Add date_of_birth column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN date_of_birth DATE;

-- Update the handle_new_user function to include date_of_birth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, date_of_birth)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'date_of_birth')::DATE
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;