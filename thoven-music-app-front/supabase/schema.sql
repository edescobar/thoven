-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('parent', 'teacher', 'student', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'declined', 'cancelled', 'completed');
CREATE TYPE playing_level AS ENUM ('beginner', 'intermediate', 'advanced', 'professional');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teachers table (extends profiles for teachers)
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  instruments_taught TEXT[] DEFAULT '{}',
  age_groups_taught TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10, 2),
  online_lessons BOOLEAN DEFAULT false,
  in_person_lessons BOOLEAN DEFAULT true,
  teaching_method TEXT,
  introduction TEXT,
  availability JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  date_of_birth DATE NOT NULL,
  instruments_of_interest TEXT[] DEFAULT '{}',
  playing_level playing_level DEFAULT 'beginner',
  learning_goals TEXT,
  preferred_class_times JSONB DEFAULT '{}',
  time_zone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bundles table (lesson packages)
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  credits INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  instruments TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bundle purchases table
CREATE TABLE bundle_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  credits_remaining INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active'
);

-- Create teacher availability table
CREATE TABLE teacher_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  bundle_purchase_id UUID REFERENCES bundle_purchases(id),
  availability_slot_id UUID REFERENCES teacher_availability(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for communication
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_teachers_instruments ON teachers USING GIN(instruments_taught);
CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_teacher ON bookings(teacher_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_teacher_availability_teacher ON teacher_availability(teacher_id);
CREATE INDEX idx_bundle_purchases_parent ON bundle_purchases(parent_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Teachers policies
CREATE POLICY "Teachers are viewable by everyone" ON teachers
  FOR SELECT USING (true);

CREATE POLICY "Teachers can update their own info" ON teachers
  FOR UPDATE USING (auth.uid() = id);

-- Students policies
CREATE POLICY "Parents can view their own students" ON students
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create students" ON students
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own students" ON students
  FOR UPDATE USING (auth.uid() = parent_id);

-- Bundles policies
CREATE POLICY "Bundles are viewable by everyone" ON bundles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can manage their own bundles" ON bundles
  FOR ALL USING (auth.uid() = teacher_id);

-- Bundle purchases policies
CREATE POLICY "Parents can view their own purchases" ON bundle_purchases
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create purchases" ON bundle_purchases
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Teacher availability policies
CREATE POLICY "Availability is viewable by everyone" ON teacher_availability
  FOR SELECT USING (is_available = true);

CREATE POLICY "Teachers can manage their own availability" ON teacher_availability
  FOR ALL USING (auth.uid() = teacher_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT parent_id FROM students WHERE id = bookings.student_id
      UNION
      SELECT teacher_id FROM bookings WHERE id = bookings.id
    )
  );

CREATE POLICY "Parents can create bookings for their students" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT parent_id FROM students WHERE id = student_id
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Parents can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- Functions and triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'parent')
  );
  
  -- If the user is a teacher, create teacher record
  IF NEW.raw_user_meta_data->>'role' = 'teacher' THEN
    INSERT INTO teachers (id) VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();