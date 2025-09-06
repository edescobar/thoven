-- Insert sample teacher profiles
-- Note: These use random UUIDs - in production, these would be created via auth.users first

-- Teacher 1: Sarah Johnson - Piano Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'sarah.johnson@example.com',
  'Sarah',
  'Johnson',
  'teacher',
  'New York',
  'NY',
  'Experienced piano teacher with a passion for classical music and over 10 years of teaching experience.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  ARRAY['Piano', 'Music Theory'],
  ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  10,
  75,
  true,
  true,
  'I focus on building strong fundamentals while keeping lessons engaging and fun. Each lesson is tailored to the student''s individual goals and learning style.',
  'I have been teaching piano for over 10 years and love helping students discover their musical potential. Whether you''re a complete beginner or looking to refine your skills, I''m here to guide you on your musical journey.',
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Teacher 2: Michael Chen - Guitar Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'michael.chen@example.com',
  'Michael',
  'Chen',
  'teacher',
  'Los Angeles',
  'CA',
  'Guitar instructor specializing in rock, blues, and jazz with 8 years of teaching experience.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  ARRAY['Guitar', 'Bass', 'Ukulele'],
  ARRAY['Teens (13-17)', 'Adults (18+)'],
  8,
  60,
  true,
  false,
  'I believe in learning by playing songs you love. We''ll cover technique, theory, and improvisation through practical application.',
  'Rock, blues, and jazz guitarist with experience teaching all levels. I''ll help you develop your own style while building solid technical skills.',
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Teacher 3: Emily Rodriguez - Violin Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'emily.rodriguez@example.com',
  'Emily',
  'Rodriguez',
  'teacher',
  'Chicago',
  'IL',
  'Professional violinist with the Chicago Symphony, teaching students of all ages for 15 years.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  ARRAY['Violin', 'Viola'],
  ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  15,
  85,
  true,
  true,
  'Classical training with emphasis on proper posture, bow technique, and musical expression. I incorporate Suzuki method for younger students.',
  'Professional violinist with extensive performance and teaching experience. I''m passionate about sharing the joy of string instruments with students of all ages.',
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Teacher 4: David Williams - Drums Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'david.williams@example.com',
  'David',
  'Williams',
  'teacher',
  'Austin',
  'TX',
  'Professional drummer and percussionist with 12 years of teaching experience.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  ARRAY['Drums', 'Percussion'],
  ARRAY['Children (5-12)', 'Teens (13-17)', 'Adults (18+)'],
  12,
  65,
  true,
  true,
  'From basic beats to complex rhythms, I teach drumming through a combination of technique exercises and playing along to your favorite songs.',
  'Let''s make some noise! I specialize in rock, pop, and jazz drumming, helping students develop solid timing and creative expression.',
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Teacher 5: Maria Gonzalez - Voice Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'maria.gonzalez@example.com',
  'Maria',
  'Gonzalez',
  'teacher',
  'Miami',
  'FL',
  'Vocal coach specializing in contemporary styles with 7 years of teaching experience.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  ARRAY['Voice', 'Music Theory'],
  ARRAY['Teens (13-17)', 'Adults (18+)'],
  7,
  70,
  true,
  true,
  'I focus on healthy vocal technique, breath support, and performance confidence. We''ll work on repertoire from various genres.',
  'Professional vocalist and coach helping students find their unique voice. From pop to musical theater, I''ll help you achieve your singing goals.',
  true,
  false
) ON CONFLICT (id) DO NOTHING;

-- Teacher 6: James Taylor - Saxophone Teacher
INSERT INTO profiles (id, email, first_name, last_name, role, city, state, bio, created_at, updated_at)
VALUES (
  'f6a7b8c9-d0e1-2345-fabc-678901234567',
  'james.taylor@example.com',
  'James',
  'Taylor',
  'teacher',
  'Boston',
  'MA',
  'Jazz saxophonist with 20 years of performance and teaching experience.',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO teachers (id, instruments_taught, age_groups_taught, years_experience, hourly_rate, online_lessons, in_person_lessons, teaching_method, introduction, is_active, verified)
VALUES (
  'f6a7b8c9-d0e1-2345-fabc-678901234567',
  ARRAY['Saxophone', 'Clarinet', 'Flute'],
  ARRAY['Teens (13-17)', 'Adults (18+)'],
  20,
  90,
  true,
  true,
  'Jazz improvisation, classical technique, and music theory integrated into every lesson. I help students develop their own musical voice.',
  'Berklee College of Music graduate with extensive jazz and classical background. Let''s explore the world of woodwinds together!',
  true,
  true
) ON CONFLICT (id) DO NOTHING;