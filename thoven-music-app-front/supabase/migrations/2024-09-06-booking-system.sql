-- Create booking_requests table for lesson booking system
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    instrument TEXT NOT NULL,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('online', 'in-person')),
    frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'bi-weekly', 'monthly', 'as-needed')),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 45, 60, 90)),
    preferred_dates TEXT[], -- Array of preferred start dates
    preferred_time TEXT CHECK (preferred_time IN ('morning', 'afternoon', 'evening', 'flexible')),
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    hourly_rate DECIMAL(10,2) NOT NULL,
    teacher_response TEXT,
    confirmed_start_date DATE,
    confirmed_time TIME,
    confirmed_day_of_week TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table for scheduled lessons
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    booking_request_id UUID REFERENCES public.booking_requests(id) ON DELETE SET NULL,
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('online', 'in-person')),
    meeting_link TEXT, -- For online lessons
    location TEXT, -- For in-person lessons
    teacher_notes TEXT,
    student_notes TEXT,
    homework_assigned TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table for communication
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    thread_id UUID,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    parent_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create availability table for teachers
CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, day_of_week, start_time)
);

-- Add indexes for performance
CREATE INDEX idx_booking_requests_teacher ON booking_requests(teacher_id);
CREATE INDEX idx_booking_requests_parent ON booking_requests(parent_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_lessons_teacher ON lessons(teacher_id);
CREATE INDEX idx_lessons_student ON lessons(student_id);
CREATE INDEX idx_lessons_date ON lessons(lesson_date);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);

-- Add RLS policies
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;

-- Booking requests policies
CREATE POLICY "Parents can create booking requests" ON booking_requests
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Teachers can view their booking requests" ON booking_requests
    FOR SELECT TO authenticated
    USING (auth.uid() = teacher_id OR auth.uid() = parent_id);

CREATE POLICY "Teachers can update their booking requests" ON booking_requests
    FOR UPDATE TO authenticated
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Lessons policies
CREATE POLICY "Users can view their lessons" ON lessons
    FOR SELECT TO authenticated
    USING (
        auth.uid() = teacher_id OR 
        auth.uid() IN (SELECT parent_id FROM students WHERE id = student_id)
    );

CREATE POLICY "Teachers can manage lessons" ON lessons
    FOR ALL TO authenticated
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update message read status" ON messages
    FOR UPDATE TO authenticated
    USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);

-- Teacher availability policies
CREATE POLICY "Teachers can manage their availability" ON teacher_availability
    FOR ALL TO authenticated
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Everyone can view teacher availability" ON teacher_availability
    FOR SELECT TO authenticated
    USING (TRUE);