"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { authService } from '@/lib/supabase/auth-v2'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signUp: typeof authService.signUp
  signIn: typeof authService.signIn
  signOut: typeof authService.signOut
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      setProfile(currentUser.profile)
    }
  }

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        authService.getCurrentUser().then((data) => {
          if (data) {
            setProfile(data.profile)
          }
        })
      }
      setLoading(false)
    })

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setProfile(currentUser.profile)
        }
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    profile,
    session,
    loading,
    signUp: authService.signUp,
    signIn: async (data: any) => {
      const result = await authService.signIn(data)
      if (result.user && result.profile) {
        setUser(result.user)
        setProfile(result.profile)
        setSession(result.session)
      }
      return result
    },
    signOut: async () => {
      const result = await authService.signOut()
      if (!result.error) {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
      return result
    },
    refreshProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}