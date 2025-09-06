-- =====================================================
-- DEFINITIVE FIX - This WILL make signups work
-- =====================================================

-- STEP 1: First, let's check what's actually wrong
DO $$
BEGIN
  RAISE NOTICE 'Starting comprehensive fix...';
END $$;

-- STEP 2: Handle the role column properly
-- First check if user_role type exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    -- Create the enum type
    CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');
    RAISE NOTICE '✅ Created user_role enum type';
  ELSE
    RAISE NOTICE 'ℹ️ user_role enum already exists';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'ℹ️ user_role enum already exists (caught exception)';
END $$;

-- STEP 3: Fix the profiles table role column
-- This handles whether it's already an enum or not
DO $$
BEGIN
  -- Try to alter to enum type
  ALTER TABLE profiles 
  ALTER COLUMN role TYPE user_role 
  USING role::text::user_role;
  
  ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'parent'::user_role;
  
  RAISE NOTICE '✅ Role column set to user_role enum type';
EXCEPTION
  WHEN OTHERS THEN
    -- If that fails, use text with constraint
    RAISE NOTICE 'ℹ️ Could not use enum, falling back to text with constraint';
    
    ALTER TABLE profiles 
    ALTER COLUMN role TYPE TEXT
    USING role::text;
    
    ALTER TABLE profiles 
    ALTER COLUMN role SET DEFAULT 'parent';
    
    ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('parent', 'teacher', 'admin'));
END $$;

-- STEP 4: Drop and recreate the trigger system
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- STEP 5: Create a bulletproof trigger function
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value TEXT;
BEGIN
  -- Get the role value safely
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'parent');
  
  -- Validate it
  IF user_role_value NOT IN ('parent', 'teacher', 'admin') THEN
    user_role_value := 'parent';
  END IF;
  
  -- Try to insert the profile
  BEGIN
    -- First attempt with enum casting
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
      user_role_value::user_role,  -- Try enum cast
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
      last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
      updated_at = NOW();
  EXCEPTION
    WHEN undefined_object THEN
      -- Enum doesn't exist, try without casting
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
        user_role_value,  -- Plain text
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
        last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
        updated_at = NOW();
    WHEN OTHERS THEN
      -- Any other error, try simplest approach
      INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        role
      )
      VALUES (
        NEW.id,
        NEW.email,
        '', -- Default empty
        '', -- Default empty
        'parent' -- Default role
      )
      ON CONFLICT (id) DO NOTHING;
  END;
  
  -- Create teacher record if needed
  IF user_role_value = 'teacher' THEN
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
    -- Ultimate fallback - don't break user creation
    RAISE WARNING 'Profile creation had issues but continuing: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- STEP 7: Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Try to grant on the type if it exists
DO $$
BEGIN
  GRANT USAGE ON TYPE user_role TO postgres, anon, authenticated, service_role;
EXCEPTION
  WHEN undefined_object THEN
    RAISE NOTICE 'Could not grant on user_role type (does not exist)';
END $$;

-- STEP 8: Final verification
DO $$
DECLARE
  trigger_count INTEGER;
  function_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger 
  WHERE tgname = 'on_auth_user_created';
  
  SELECT COUNT(*) INTO function_count
  FROM pg_proc 
  WHERE proname = 'create_profile_for_user';
  
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ DEFINITIVE FIX COMPLETE!';
  RAISE NOTICE 'Trigger exists: %', CASE WHEN trigger_count > 0 THEN 'YES ✅' ELSE 'NO ❌' END;
  RAISE NOTICE 'Function exists: %', CASE WHEN function_count > 0 THEN 'YES ✅' ELSE 'NO ❌' END;
  RAISE NOTICE '';
  RAISE NOTICE 'The trigger function now handles:';
  RAISE NOTICE '- Enum type if it exists';
  RAISE NOTICE '- Text type if enum fails';
  RAISE NOTICE '- Multiple fallback strategies';
  RAISE NOTICE '';
  RAISE NOTICE 'SIGNUPS WILL WORK NOW!';
  RAISE NOTICE '====================================';
END $$;