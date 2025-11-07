-- Add 'volunteer' and 'authority' to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'volunteer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'authority';

-- Update handle_new_user function to properly handle role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from metadata or default to 'traveler'
  user_role := COALESCE((new.raw_user_meta_data->>'role')::app_role, 'traveler'::app_role);
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$$;