-- ============================================
-- URGENT FIX: Create user_role enum type
-- Run this IMMEDIATELY in Supabase SQL Editor
-- ============================================

-- Create the enum type if it doesn't exist
DO $$ 
BEGIN
  -- Check if user_role type exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'admin');
    RAISE NOTICE '✅ Created user_role enum type';
  ELSE
    RAISE NOTICE 'ℹ️ user_role enum already exists';
  END IF;
END $$;

-- Now update the profiles table to use this enum
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role 
USING role::text::user_role;

-- Set default value
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'parent'::user_role;

-- Verify the enum was created
SELECT 
  t.typname as type_name,
  e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- Check if profiles table has correct column type
SELECT 
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'role';

-- Now recreate the trigger function with the enum
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_user();

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
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')::user_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
    last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
    updated_at = NOW();
  
  -- Create teacher record if role is teacher
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
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- Final verification
DO $$
BEGIN
  RAISE NOTICE '✅ Setup complete!';
  RAISE NOTICE 'The user_role enum and trigger have been properly configured.';
  RAISE NOTICE 'Users should now be able to sign up successfully!';
END $$;