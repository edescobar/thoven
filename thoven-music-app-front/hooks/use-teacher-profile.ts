import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export interface TeacherProfile {
  id: string
  instruments_taught: string[]
  hourly_rate: number
  years_experience: number
  online_lessons: boolean
  in_person_lessons: boolean
  introduction: string
  verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useTeacherProfile() {
  const { user } = useAuth()
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTeacherProfile(null)
      setLoading(false)
      return
    }

    fetchTeacherProfile()
  }, [user])

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (!data) {
        // Create teacher profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('teachers')
          .insert({
            id: user?.id,
            instruments_taught: [],
            hourly_rate: 50,
            years_experience: 0,
            online_lessons: true,
            in_person_lessons: false,
            introduction: '',
            verified: false,
            is_active: true
          })
          .select()
          .single()

        if (createError) throw createError
        setTeacherProfile(newProfile)
      } else {
        setTeacherProfile(data)
      }
    } catch (err: any) {
      console.error('Error fetching teacher profile:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<TeacherProfile>) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single()

      if (error) throw error

      setTeacherProfile(data)
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating teacher profile:', err)
      return { data: null, error: err.message }
    }
  }

  return {
    teacherProfile,
    loading,
    error,
    updateProfile,
    refresh: fetchTeacherProfile
  }
}