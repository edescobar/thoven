import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export interface Enrollment {
  id: string
  student_id: string
  teacher_id: string
  instrument: string
  lesson_type: 'online' | 'in_person' | 'hybrid'
  status: 'active' | 'inactive' | 'pending'
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
  students?: {
    first_name: string
    last_name: string
    profile_picture_url: string | null
  }
  teachers?: {
    profiles: {
      first_name: string
      last_name: string
      profile_picture_url: string | null
    }
  }
}

export function useEnrollments(studentId?: string) {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setEnrollments([])
      setLoading(false)
      return
    }

    fetchEnrollments()
  }, [user, studentId])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('enrollments')
        .select(`
          *,
          students (
            first_name,
            last_name,
            profile_picture_url
          ),
          teachers (
            profiles (
              first_name,
              last_name,
              profile_picture_url
            )
          )
        `)
      
      if (studentId) {
        query = query.eq('student_id', studentId)
      } else {
        // Get all enrollments for parent's students
        const { data: studentsData } = await supabase
          .from('students')
          .select('id')
          .eq('parent_id', user?.id)
        
        if (studentsData && studentsData.length > 0) {
          const studentIds = studentsData.map(s => s.id)
          query = query.in('student_id', studentIds)
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      setEnrollments(data || [])
    } catch (err: any) {
      console.error('Error fetching enrollments:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createEnrollment = async (enrollmentData: {
    student_id: string
    teacher_id: string
    instrument: string
    lesson_type: 'online' | 'in_person' | 'hybrid'
    start_date?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          ...enrollmentData,
          status: 'pending',
          start_date: enrollmentData.start_date || new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      await fetchEnrollments()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating enrollment:', err)
      return { data: null, error: err.message }
    }
  }

  const updateEnrollment = async (enrollmentId: string, updates: Partial<Enrollment>) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', enrollmentId)
        .select()
        .single()

      if (error) throw error

      setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...e, ...data } : e))
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating enrollment:', err)
      return { data: null, error: err.message }
    }
  }

  const cancelEnrollment = async (enrollmentId: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ 
          status: 'inactive',
          end_date: new Date().toISOString()
        })
        .eq('id', enrollmentId)

      if (error) throw error

      await fetchEnrollments()
      return { error: null }
    } catch (err: any) {
      console.error('Error canceling enrollment:', err)
      return { error: err.message }
    }
  }

  return {
    enrollments,
    loading,
    error,
    createEnrollment,
    updateEnrollment,
    cancelEnrollment,
    refresh: fetchEnrollments
  }
}