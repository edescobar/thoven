export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'parent' | 'teacher' | 'student' | 'admin'
          phone: string | null
          street_address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          profile_picture_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'parent' | 'teacher' | 'student' | 'admin'
          phone?: string | null
          street_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          profile_picture_url?: string | null
          bio?: string | null
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          role?: 'parent' | 'teacher' | 'student' | 'admin'
          phone?: string | null
          street_address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          profile_picture_url?: string | null
          bio?: string | null
        }
      }
      teachers: {
        Row: {
          id: string
          instruments_taught: string[]
          age_groups_taught: string[]
          years_experience: number
          hourly_rate: number | null
          online_lessons: boolean
          in_person_lessons: boolean
          teaching_method: string | null
          introduction: string | null
          availability: any
          is_active: boolean
          verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          instruments_taught?: string[]
          age_groups_taught?: string[]
          years_experience?: number
          hourly_rate?: number | null
          online_lessons?: boolean
          in_person_lessons?: boolean
          teaching_method?: string | null
          introduction?: string | null
          availability?: any
          is_active?: boolean
          verified?: boolean
        }
        Update: {
          instruments_taught?: string[]
          age_groups_taught?: string[]
          years_experience?: number
          hourly_rate?: number | null
          online_lessons?: boolean
          in_person_lessons?: boolean
          teaching_method?: string | null
          introduction?: string | null
          availability?: any
          is_active?: boolean
          verified?: boolean
        }
      }
      students: {
        Row: {
          id: string
          parent_id: string
          first_name: string
          last_name: string
          email: string | null
          date_of_birth: string
          instruments_of_interest: string[]
          playing_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          learning_goals: string | null
          preferred_class_times: any
          time_zone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          parent_id: string
          first_name: string
          last_name: string
          email?: string | null
          date_of_birth: string
          instruments_of_interest?: string[]
          playing_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          learning_goals?: string | null
          preferred_class_times?: any
          time_zone?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          email?: string | null
          date_of_birth?: string
          instruments_of_interest?: string[]
          playing_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional'
          learning_goals?: string | null
          preferred_class_times?: any
          time_zone?: string
        }
      }
      bundles: {
        Row: {
          id: string
          teacher_id: string
          name: string
          description: string | null
          duration_minutes: number
          credits: number
          price: number
          instruments: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          teacher_id: string
          name: string
          description?: string | null
          duration_minutes: number
          credits?: number
          price: number
          instruments?: string[] | null
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          duration_minutes?: number
          credits?: number
          price?: number
          instruments?: string[] | null
          is_active?: boolean
        }
      }
      bundle_purchases: {
        Row: {
          id: string
          bundle_id: string
          parent_id: string
          student_id: string
          credits_remaining: number
          purchased_at: string
          expires_at: string | null
          status: string
        }
        Insert: {
          bundle_id: string
          parent_id: string
          student_id: string
          credits_remaining: number
          expires_at?: string | null
          status?: string
        }
        Update: {
          credits_remaining?: number
          expires_at?: string | null
          status?: string
        }
      }
      teacher_availability: {
        Row: {
          id: string
          teacher_id: string
          start_time: string
          end_time: string
          is_recurring: boolean
          recurrence_pattern: any | null
          max_bookings: number
          current_bookings: number
          is_available: boolean
          created_at: string
        }
        Insert: {
          teacher_id: string
          start_time: string
          end_time: string
          is_recurring?: boolean
          recurrence_pattern?: any | null
          max_bookings?: number
          current_bookings?: number
          is_available?: boolean
        }
        Update: {
          start_time?: string
          end_time?: string
          is_recurring?: boolean
          recurrence_pattern?: any | null
          max_bookings?: number
          current_bookings?: number
          is_available?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          student_id: string
          teacher_id: string
          bundle_purchase_id: string | null
          availability_slot_id: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
          notes: string | null
          meeting_link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          teacher_id: string
          bundle_purchase_id?: string | null
          availability_slot_id?: string | null
          scheduled_at: string
          duration_minutes: number
          status?: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
          notes?: string | null
          meeting_link?: string | null
        }
        Update: {
          scheduled_at?: string
          duration_minutes?: number
          status?: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
          notes?: string | null
          meeting_link?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          booking_id: string | null
          subject: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          sender_id: string
          recipient_id: string
          booking_id?: string | null
          subject?: string | null
          content: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          teacher_id: string
          parent_id: string
          student_id: string | null
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          teacher_id: string
          parent_id: string
          student_id?: string | null
          booking_id?: string | null
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
    }
  }
}