import { supabase } from './client'

export interface SignUpData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'parent' | 'teacher'
}

export interface SignInData {
  email: string
  password: string
}

export const authService = {
  async signUp(data: SignUpData) {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
          }
        }
      })

      if (authError) throw authError

      // Since email confirmation is disabled, automatically sign in the user
      if (authData.user) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (signInError) throw signInError

        // Get the user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        return { 
          user: authData.user, 
          profile,
          session: signInData.session,
          error: null 
        }
      }

      return { user: authData.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  },

  async signIn(data: SignInData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError

      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      return { 
        user: authData.user, 
        profile,
        session: authData.session,
        error: null 
      }
    } catch (error: any) {
      return { user: null, profile: null, session: null, error: error.message }
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { user, profile }
  },

  async updateProfile(updates: any) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    return { data, error }
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}