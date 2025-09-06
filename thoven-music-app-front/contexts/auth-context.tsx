"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
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
  signIn: (data: any) => Promise<any>
  signOut: () => Promise<any>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      setProfile(currentUser.profile)
    }
  }, [])

  const signIn = useCallback(async (data: any) => {
    const result = await authService.signIn(data)
    if (result.user && result.profile) {
      setUser(result.user)
      setProfile(result.profile)
      setSession(result.session)
    }
    return result
  }, [])

  const signOut = useCallback(async () => {
    const result = await authService.signOut()
    if (!result.error) {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
    return result
  }, [])

  useEffect(() => {
    // Check initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const data = await authService.getCurrentUser()
        if (data) {
          setProfile(data.profile)
        }
      }
      setLoading(false)
    }

    initializeAuth()

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

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signUp: authService.signUp,
    signIn,
    signOut,
    refreshProfile
  }), [user, profile, session, loading, signIn, signOut, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}