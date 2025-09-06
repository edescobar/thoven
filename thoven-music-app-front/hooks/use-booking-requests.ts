import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export interface BookingRequest {
  id: string
  teacher_id: string
  parent_id: string
  student_id?: string
  instrument: string
  lesson_type: string
  frequency: string
  duration_minutes: number
  preferred_dates: string[]
  preferred_time: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  hourly_rate: number
  teacher_response?: string
  confirmed_start_date?: string
  confirmed_time?: string
  confirmed_day_of_week?: string
  created_at: string
  updated_at: string
  parent: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  student?: {
    id: string
    name: string
    birthdate: string
  }
}

export function useBookingRequests() {
  const { user } = useAuth()
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchBookingRequests()
    }
  }, [user])

  const fetchBookingRequests = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('booking_requests')
        .select(`
          *,
          parent:parent_id(id, first_name, last_name, email),
          student:student_id(id, name, birthdate)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookingRequests(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching booking requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (
    requestId: string, 
    status: 'accepted' | 'rejected',
    response?: string,
    confirmedDetails?: {
      start_date: string
      time: string
      day_of_week: string
    }
  ) => {
    try {
      const updateData: any = {
        status,
        teacher_response: response,
        updated_at: new Date().toISOString()
      }

      if (status === 'accepted' && confirmedDetails) {
        updateData.confirmed_start_date = confirmedDetails.start_date
        updateData.confirmed_time = confirmedDetails.time
        updateData.confirmed_day_of_week = confirmedDetails.day_of_week
      }

      const { error } = await supabase
        .from('booking_requests')
        .update(updateData)
        .eq('id', requestId)
        .eq('teacher_id', user?.id)

      if (error) throw error

      // If accepted, create enrollment
      if (status === 'accepted') {
        const request = bookingRequests.find(r => r.id === requestId)
        if (request && request.student_id) {
          const { error: enrollError } = await supabase
            .from('enrollments')
            .insert({
              teacher_id: user?.id,
              student_id: request.student_id,
              instrument: request.instrument,
              status: 'active',
              lesson_frequency: request.frequency,
              lesson_duration: request.duration_minutes,
              hourly_rate: request.hourly_rate
            })

          if (enrollError) console.error('Error creating enrollment:', enrollError)
        }
      }

      await fetchBookingRequests()
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    bookingRequests,
    loading,
    error,
    updateRequestStatus,
    refetch: fetchBookingRequests
  }
}