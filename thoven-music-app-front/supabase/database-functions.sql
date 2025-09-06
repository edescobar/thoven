-- Database functions for Thoven music app
-- Run this after IMPORTANT-RUN-THIS.sql

-- Function to get teacher profile with additional info
CREATE OR REPLACE FUNCTION get_teacher_details(teacher_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  instruments TEXT[],
  specialties TEXT[],
  hourly_rate DECIMAL,
  is_active BOOLEAN,
  verified BOOLEAN,
  years_experience INTEGER,
  profile_image_url TEXT,
  total_students BIGINT,
  total_lessons BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    p.email,
    p.first_name,
    p.last_name,
    t.bio,
    t.instruments,
    t.specialties,
    t.hourly_rate,
    t.is_active,
    t.verified,
    t.years_experience,
    t.profile_image_url,
    (SELECT COUNT(*) FROM students s WHERE s.teacher_id = t.id) as total_students,
    (SELECT COUNT(*) FROM bookings b WHERE b.teacher_id = t.id) as total_lessons
  FROM teachers t
  JOIN profiles p ON t.id = p.id
  WHERE t.id = teacher_id;
END;
$$ LANGUAGE plpgsql;

-- Function to search teachers by instrument
CREATE OR REPLACE FUNCTION search_teachers_by_instrument(search_instrument TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  instruments TEXT[],
  specialties TEXT[],
  hourly_rate DECIMAL,
  years_experience INTEGER,
  profile_image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    p.email,
    p.first_name,
    p.last_name,
    t.bio,
    t.instruments,
    t.specialties,
    t.hourly_rate,
    t.years_experience,
    t.profile_image_url
  FROM teachers t
  JOIN profiles p ON t.id = p.id
  WHERE t.is_active = true
    AND t.verified = true
    AND (
      search_instrument IS NULL 
      OR search_instrument = '' 
      OR search_instrument = ANY(t.instruments)
      OR LOWER(search_instrument) = ANY(SELECT LOWER(unnest(t.instruments)))
    )
  ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to create a booking
CREATE OR REPLACE FUNCTION create_booking(
  p_student_id UUID,
  p_teacher_id UUID,
  p_lesson_date TIMESTAMPTZ,
  p_duration_minutes INTEGER,
  p_notes TEXT
)
RETURNS UUID AS $$
DECLARE
  v_booking_id UUID;
  v_teacher_rate DECIMAL;
BEGIN
  -- Get teacher's hourly rate
  SELECT hourly_rate INTO v_teacher_rate
  FROM teachers
  WHERE id = p_teacher_id;
  
  -- Calculate price
  DECLARE
    v_price DECIMAL := (v_teacher_rate / 60) * p_duration_minutes;
  BEGIN
    -- Insert booking
    INSERT INTO bookings (
      student_id,
      teacher_id,
      lesson_date,
      duration_minutes,
      price,
      status,
      notes
    ) VALUES (
      p_student_id,
      p_teacher_id,
      p_lesson_date,
      p_duration_minutes,
      v_price,
      'scheduled',
      p_notes
    ) RETURNING id INTO v_booking_id;
    
    RETURN v_booking_id;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to get student's upcoming bookings
CREATE OR REPLACE FUNCTION get_student_bookings(p_student_id UUID)
RETURNS TABLE (
  id UUID,
  teacher_id UUID,
  teacher_first_name TEXT,
  teacher_last_name TEXT,
  lesson_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  price DECIMAL,
  status booking_status,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.teacher_id,
    p.first_name as teacher_first_name,
    p.last_name as teacher_last_name,
    b.lesson_date,
    b.duration_minutes,
    b.price,
    b.status,
    b.notes
  FROM bookings b
  JOIN profiles p ON b.teacher_id = p.id
  WHERE b.student_id = p_student_id
    AND b.lesson_date >= NOW()
  ORDER BY b.lesson_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get teacher's upcoming bookings
CREATE OR REPLACE FUNCTION get_teacher_bookings(p_teacher_id UUID)
RETURNS TABLE (
  id UUID,
  student_id UUID,
  student_first_name TEXT,
  student_last_name TEXT,
  lesson_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  price DECIMAL,
  status booking_status,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.student_id,
    p.first_name as student_first_name,
    p.last_name as student_last_name,
    b.lesson_date,
    b.duration_minutes,
    b.price,
    b.status,
    b.notes
  FROM bookings b
  JOIN students s ON b.student_id = s.id
  JOIN profiles p ON s.parent_id = p.id
  WHERE b.teacher_id = p_teacher_id
    AND b.lesson_date >= NOW()
  ORDER BY b.lesson_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_teacher_details TO authenticated;
GRANT EXECUTE ON FUNCTION search_teachers_by_instrument TO authenticated;
GRANT EXECUTE ON FUNCTION create_booking TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_bookings TO authenticated;
GRANT EXECUTE ON FUNCTION get_teacher_bookings TO authenticated;