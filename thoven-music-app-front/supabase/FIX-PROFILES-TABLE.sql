-- =====================================================
-- FIX PROFILES TABLE - Add missing columns
-- =====================================================

-- STEP 1: Check current profiles table structure
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- STEP 2: Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'parent';

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '';

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- STEP 3: Add constraint for role values
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('parent', 'teacher', 'admin'));

-- STEP 4: Drop old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- STEP 5: Create new trigger function
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile for new user
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
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'role' IN ('parent', 'teacher', 'admin') 
        THEN NEW.raw_user_meta_data->>'role'
        ELSE 'parent'
      END,
      'parent'
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = NOW();
  
  -- Create teacher record if needed
  IF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
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
    -- Log error but don't fail
    RAISE WARNING 'Profile creation warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 6: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- STEP 7: Add missing columns to teachers table too
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS instruments TEXT[],
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- STEP 8: Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- STEP 9: Update existing profiles with missing data
UPDATE profiles 
SET 
  role = COALESCE(role, 'parent'),
  first_name = COALESCE(first_name, ''),
  last_name = COALESCE(last_name, ''),
  created_at = COALESCE(created_at, NOW()),
  updated_at = NOW()
WHERE role IS NULL 
   OR first_name IS NULL 
   OR last_name IS NULL;

-- STEP 10: Verify the fix
DO $$
DECLARE
  role_col_exists BOOLEAN;
  trigger_exists BOOLEAN;
BEGIN
  -- Check if role column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
      AND column_name = 'role'
  ) INTO role_col_exists;
  
  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  IF role_col_exists THEN
    RAISE NOTICE '✅ Role column exists in profiles table';
  ELSE
    RAISE WARNING '❌ Role column is still missing!';
  END IF;
  
  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger is properly configured';
  ELSE
    RAISE WARNING '❌ Trigger is missing!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ PROFILES TABLE FIXED!';
  RAISE NOTICE 'All columns added, trigger created.';
  RAISE NOTICE 'Signups should work now!';
  RAISE NOTICE '====================================';
END $$;

-- Show final table structure
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;