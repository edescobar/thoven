-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_user();

-- Create function to automatically create profile
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
    NOW(),
    NOW()
  );
  
  -- If the user is a teacher, also create a teacher record
  IF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
    INSERT INTO public.teachers (
      id,
      is_active,
      verified,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      true,
      false,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- Test the trigger by checking existing users without profiles
-- and creating profiles for them
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT 
      u.id,
      u.email,
      u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    INSERT INTO public.profiles (
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      updated_at
    )
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
      COALESCE(user_record.raw_user_meta_data->>'last_name', ''),
      COALESCE(user_record.raw_user_meta_data->>'role', 'parent'),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Created profile for user %', user_record.email;
  END LOOP;
END $$;
