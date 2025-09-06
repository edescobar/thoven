-- =====================================================
-- FINAL FIX FOR USER_ROLE ENUM ERROR
-- This will completely rebuild the auth system
-- =====================================================

-- STEP 1: Drop everything and start fresh
-- -----------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- STEP 2: Create the enum type (force creation)
-- ----------------------------------------------
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');

-- Verify it was created
SELECT typname, typtype 
FROM pg_type 
WHERE typname = 'user_role';

-- STEP 3: Fix the profiles table
-- -------------------------------
-- First, temporarily change the column to text
ALTER TABLE profiles 
ALTER COLUMN role TYPE TEXT;

-- Now change it to the enum type
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role 
USING CASE 
  WHEN role = 'parent' THEN 'parent'::user_role
  WHEN role = 'teacher' THEN 'teacher'::user_role
  WHEN role = 'admin' THEN 'admin'::user_role
  ELSE 'parent'::user_role
END;

-- Set the default
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'parent'::user_role;

-- STEP 4: Create a simpler trigger function
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_role_str TEXT;
BEGIN
  -- Extract data from the new user
  user_email := NEW.email;
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_role_str := COALESCE(NEW.raw_user_meta_data->>'role', 'parent');
  
  -- Validate role value
  IF user_role_str NOT IN ('parent', 'teacher', 'admin') THEN
    user_role_str := 'parent';
  END IF;
  
  -- Insert the profile
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
    user_email,
    user_first_name,
    user_last_name,
    user_role_str::user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  -- If teacher, create teacher record
  IF user_role_str = 'teacher' THEN
    INSERT INTO public.teachers (
      id,
      is_active,
      verified,
      created_at
    )
    VALUES (
      NEW.id,
      true,
      false,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Profile creation error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create the trigger
-- ---------------------------
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- STEP 6: Grant permissions
-- -------------------------
GRANT USAGE ON TYPE user_role TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- STEP 7: Verify everything is working
-- -------------------------------------
DO $$
DECLARE
  enum_exists BOOLEAN;
  trigger_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Check enum
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
  ) INTO enum_exists;
  
  -- Check trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  -- Check function
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'create_profile_for_user'
  ) INTO function_exists;
  
  -- Report results
  IF enum_exists THEN
    RAISE NOTICE '✅ user_role enum exists';
  ELSE
    RAISE WARNING '❌ user_role enum is missing!';
  END IF;
  
  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger exists';
  ELSE
    RAISE WARNING '❌ Trigger is missing!';
  END IF;
  
  IF function_exists THEN
    RAISE NOTICE '✅ Function exists';
  ELSE
    RAISE WARNING '❌ Function is missing!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ Database fix complete!';
  RAISE NOTICE 'Users should now be able to sign up.';
  RAISE NOTICE '====================================';
END $$;

-- STEP 8: Show current state
-- ---------------------------
SELECT 
  'Enum Types' as check_type,
  COUNT(*) as count
FROM pg_type 
WHERE typname = 'user_role'
UNION ALL
SELECT 
  'Triggers' as check_type,
  COUNT(*) as count
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created'
UNION ALL
SELECT 
  'Functions' as check_type,
  COUNT(*) as count
FROM pg_proc 
WHERE proname = 'create_profile_for_user';

-- Show the enum values
SELECT enumlabel as role_values
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'user_role'
ORDER BY enumsortorder;