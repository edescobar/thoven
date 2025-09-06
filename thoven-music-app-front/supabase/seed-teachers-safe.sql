-- Safe Teacher Seeding Script
-- This script creates sample teacher data without requiring auth.users entries
-- Run this in Supabase SQL Editor after creating teacher accounts through the UI

-- First, let's check if we have any existing teachers
SELECT COUNT(*) as existing_teachers FROM profiles WHERE role = 'teacher';

-- Instructions:
-- 1. First create teacher accounts through the sign-up form at /app with these emails:
--    - sarah.johnson@example.com (Piano Teacher)
--    - michael.chen@example.com (Guitar Teacher)
--    - emily.rodriguez@example.com (Violin Teacher)
--    - david.williams@example.com (Drums Teacher)
--    - maria.gonzalez@example.com (Voice Teacher)
--    - james.taylor@example.com (Saxophone Teacher)
--
-- 2. After creating the accounts, run this query to get their IDs:

SELECT id, email, first_name, last_name 
FROM profiles 
WHERE email IN (
  'sarah.johnson@example.com',
  'michael.chen@example.com',
  'emily.rodriguez@example.com',
  'david.williams@example.com',
  'maria.gonzalez@example.com',
  'james.taylor@example.com'
);

-- 3. Then run these updates to enhance the teacher profiles:

-- Update Sarah Johnson (Piano Teacher)
UPDATE profiles 
SET 
  city = 'New York',
  state = 'NY',
  bio = 'Experienced piano teacher with a passion for classical music and over 10 years of teaching experience.'
WHERE email = 'sarah.johnson@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Piano', 'Music Theory'],
  age_groups_taught = ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  years_experience = 10,
  hourly_rate = 75,
  online_lessons = true,
  in_person_lessons = true,
  teaching_method = 'I focus on building strong fundamentals while keeping lessons engaging and fun.',
  introduction = 'I have been teaching piano for over 10 years and love helping students discover their musical potential.',
  is_active = true,
  verified = true
WHERE id = (SELECT id FROM profiles WHERE email = 'sarah.johnson@example.com');

-- Update Michael Chen (Guitar Teacher)
UPDATE profiles 
SET 
  city = 'Los Angeles',
  state = 'CA',
  bio = 'Guitar instructor specializing in rock, blues, and jazz with 8 years of teaching experience.'
WHERE email = 'michael.chen@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Guitar', 'Bass', 'Ukulele'],
  age_groups_taught = ARRAY['Teens (13-17)', 'Adults (18+)'],
  years_experience = 8,
  hourly_rate = 60,
  online_lessons = true,
  in_person_lessons = false,
  teaching_method = 'Learning by playing songs you love, covering technique, theory, and improvisation.',
  introduction = 'Rock, blues, and jazz guitarist helping students develop their own style.',
  is_active = true,
  verified = true
WHERE id = (SELECT id FROM profiles WHERE email = 'michael.chen@example.com');

-- Update Emily Rodriguez (Violin Teacher)
UPDATE profiles 
SET 
  city = 'Chicago',
  state = 'IL',
  bio = 'Professional violinist with the Chicago Symphony, teaching students of all ages for 15 years.'
WHERE email = 'emily.rodriguez@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Violin', 'Viola'],
  age_groups_taught = ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  years_experience = 15,
  hourly_rate = 85,
  online_lessons = true,
  in_person_lessons = true,
  teaching_method = 'Classical training with emphasis on proper posture and bow technique.',
  introduction = 'Professional violinist passionate about sharing the joy of string instruments.',
  is_active = true,
  verified = true
WHERE id = (SELECT id FROM profiles WHERE email = 'emily.rodriguez@example.com');

-- Update David Williams (Drums Teacher)
UPDATE profiles 
SET 
  city = 'Austin',
  state = 'TX',
  bio = 'Professional drummer and percussionist with 12 years of teaching experience.'
WHERE email = 'david.williams@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Drums', 'Percussion'],
  age_groups_taught = ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  years_experience = 12,
  hourly_rate = 65,
  online_lessons = true,
  in_person_lessons = true,
  teaching_method = 'From basic beats to complex rhythms through technique and playing along to songs.',
  introduction = 'Specializing in rock, pop, and jazz drumming with focus on timing and expression.',
  is_active = true,
  verified = true
WHERE id = (SELECT id FROM profiles WHERE email = 'david.williams@example.com');

-- Update Maria Gonzalez (Voice Teacher)
UPDATE profiles 
SET 
  city = 'Miami',
  state = 'FL',
  bio = 'Vocal coach specializing in contemporary styles with 7 years of teaching experience.'
WHERE email = 'maria.gonzalez@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Voice', 'Music Theory'],
  age_groups_taught = ARRAY['Teens (13-17)', 'Adults (18+)'],
  years_experience = 7,
  hourly_rate = 70,
  online_lessons = true,
  in_person_lessons = true,
  teaching_method = 'Healthy vocal technique, breath support, and performance confidence.',
  introduction = 'Professional vocalist helping students find their unique voice.',
  is_active = true,
  verified = false
WHERE id = (SELECT id FROM profiles WHERE email = 'maria.gonzalez@example.com');

-- Update James Taylor (Saxophone Teacher)
UPDATE profiles 
SET 
  city = 'Boston',
  state = 'MA',
  bio = 'Jazz saxophonist with 20 years of performance and teaching experience.'
WHERE email = 'james.taylor@example.com';

UPDATE teachers 
SET 
  instruments_taught = ARRAY['Saxophone', 'Clarinet', 'Flute'],
  age_groups_taught = ARRAY['Teens (13-17)', 'Adults (18+)'],
  years_experience = 20,
  hourly_rate = 90,
  online_lessons = true,
  in_person_lessons = true,
  teaching_method = 'Jazz improvisation, classical technique, and music theory integrated.',
  introduction = 'Berklee College of Music graduate exploring the world of woodwinds.',
  is_active = true,
  verified = true
WHERE id = (SELECT id FROM profiles WHERE email = 'james.taylor@example.com');

-- Verify the updates
SELECT 
  p.email,
  p.first_name || ' ' || p.last_name as name,
  p.city || ', ' || p.state as location,
  t.instruments_taught,
  t.hourly_rate,
  t.verified
FROM profiles p
JOIN teachers t ON p.id = t.id
WHERE p.role = 'teacher'
ORDER BY p.created_at DESC;