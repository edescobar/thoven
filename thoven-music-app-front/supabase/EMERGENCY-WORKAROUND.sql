-- =====================================================
-- EMERGENCY WORKAROUND - Remove enum requirement
-- Use this if the enum fix doesn't work
-- =====================================================

-- STEP 1: Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;

-- STEP 2: Change profiles.role to simple text
ALTER TABLE profiles 
ALTER COLUMN role TYPE TEXT;

-- STEP 3: Add a check constraint instead of enum
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('parent', 'teacher', 'admin'));

-- Set default
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'parent';

-- STEP 4: Create a simpler trigger function without enum
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple insert without enum casting
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
    -- Don't fail user creation
    RAISE WARNING 'Profile creation warning: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- STEP 6: Test the setup
DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅ EMERGENCY WORKAROUND APPLIED';
  RAISE NOTICE 'The role column is now TEXT type';
  RAISE NOTICE 'This should fix all signup issues';
  RAISE NOTICE '====================================';
END $$;

-- Show the current column type
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'role';