import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export interface TeacherStudent {
  id: string
  enrollment_id: string
  student_id: string
  instrument: string
  lesson_type: 'online' | 'in_person' | 'hybrid'
  status: 'active' | 'inactive' | 'pending'
  start_date: string
  student: {
    first_name: string
    last_name: string
    profile_picture_url: string | null
    parent_id: string
  }
  parent: {
    first_name: string
    last_name: string
    email: string
  }
}

export function useTeacherStudents() {
  const { user } = useAuth()
  const [students, setStudents] = useState<TeacherStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setStudents([])
      setLoading(false)
      return
    }

    fetchStudents()
  }, [user])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          instrument,
          lesson_type,
          status,
          start_date,
          students!inner (
            id,
            first_name,
            last_name,
            profile_picture_url,
            parent_id,
            profiles!students_parent_id_fkey (
              first_name,
              last_name,
              email
            )
          )
        `)
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedStudents = (data || []).map(enrollment => ({
        id: enrollment.id,
        enrollment_id: enrollment.id,
        student_id: enrollment.student_id,
        instrument: enrollment.instrument,
        lesson_type: enrollment.lesson_type,
        status: enrollment.status,
        start_date: enrollment.start_date,
        student: {
          first_name: enrollment.students.first_name,
          last_name: enrollment.students.last_name,
          profile_picture_url: enrollment.students.profile_picture_url,
          parent_id: enrollment.students.parent_id
        },
        parent: enrollment.students.profiles ? {
          first_name: enrollment.students.profiles.first_name,
          last_name: enrollment.students.profiles.last_name,
          email: enrollment.students.profiles.email
        } : {
          first_name: '',
          last_name: '',
          email: ''
        }
      }))

      setStudents(formattedStudents)
    } catch (err: any) {
      console.error('Error fetching teacher students:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateEnrollmentStatus = async (enrollmentId: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status })
        .eq('id', enrollmentId)
        .eq('teacher_id', user?.id)

      if (error) throw error

      await fetchStudents()
      return { error: null }
    } catch (err: any) {
      console.error('Error updating enrollment status:', err)
      return { error: err.message }
    }
  }

  return {
    students,
    loading,
    error,
    updateEnrollmentStatus,
    refresh: fetchStudents
  }
}