import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export interface Student {
  id: string
  parent_id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
}

export function useStudents() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
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
        .from('students')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setStudents(data || [])
    } catch (err: any) {
      console.error('Error fetching students:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addStudent = async (studentData: {
    first_name: string
    last_name: string
    date_of_birth?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          parent_id: user?.id,
          ...studentData
        })
        .select()
        .single()

      if (error) throw error

      setStudents([data, ...students])
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding student:', err)
      return { data: null, error: err.message }
    }
  }

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .eq('parent_id', user?.id)
        .select()
        .single()

      if (error) throw error

      setStudents(students.map(s => s.id === studentId ? data : s))
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating student:', err)
      return { data: null, error: err.message }
    }
  }

  const deleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('parent_id', user?.id)

      if (error) throw error

      setStudents(students.filter(s => s.id !== studentId))
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting student:', err)
      return { error: err.message }
    }
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refresh: fetchStudents
  }
}