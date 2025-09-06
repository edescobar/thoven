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
    console.log('🔐 Starting signup process for:', data.email)
    
    try {
      // Step 1: Create the user account
      const { data: signUpResult, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
          },
          emailRedirectTo: undefined // No email confirmation needed
        }
      })

      if (signUpError) {
        console.error('❌ Signup error:', signUpError)
        throw signUpError
      }

      if (!signUpResult.user) {
        throw new Error('No user returned from signup')
      }

      console.log('✅ User created:', signUpResult.user.id)

      // Step 2: Wait a moment for the database trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 3: Sign in the user immediately
      const { data: signInResult, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        console.error('❌ Auto-signin error:', signInError)
        throw signInError
      }

      console.log('✅ User signed in:', signInResult.session?.user.id)

      // Step 4: Get the profile (with retry logic and fallback creation)
      let profile = null
      let retries = 3
      
      while (retries > 0 && !profile) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signUpResult.user.id)
          .single()
        
        if (profileData) {
          profile = profileData
          console.log('✅ Profile found:', profile)
        } else {
          console.log(`⏳ Profile not ready, retrying... (${retries} attempts left)`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          retries--
        }
      }
      
      // If profile still doesn't exist, create it manually
      if (!profile && signUpResult.user) {
        console.log('📝 Creating profile manually...')
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: signUpResult.user.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Manual profile creation failed:', createError)
        } else {
          profile = newProfile
          console.log('✅ Profile created manually:', profile)
        }
      }

      // Step 5: Create teacher record if needed
      if (data.role === 'teacher' && signUpResult.user.id) {
        const { error: teacherError } = await supabase
          .from('teachers')
          .insert({
            id: signUpResult.user.id,
            is_active: true,
            verified: false
          })
        
        if (teacherError && !teacherError.message.includes('duplicate')) {
          console.error('⚠️ Teacher record creation issue:', teacherError)
        } else {
          console.log('✅ Teacher record created')
        }
      }

      return { 
        user: signInResult.user, 
        profile,
        session: signInResult.session,
        error: null 
      }
    } catch (error: any) {
      console.error('❌ Signup process failed:', error)
      return { 
        user: null, 
        profile: null,
        session: null,
        error: error.message || 'Signup failed' 
      }
    }
  },

  async signIn(data: SignInData) {
    console.log('🔐 Starting signin for:', data.email)
    
    try {
      // Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        console.error('❌ Signin error:', authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user returned from signin')
      }

      console.log('✅ User authenticated:', authData.user.id)

      // Get the user's profile (with fallback creation if missing)
      let profile = null
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it from auth metadata
        console.log('📝 Profile missing, creating from auth metadata...')
        const { data: userData } = await supabase.auth.getUser()
        const metadata = userData?.user?.user_metadata || {}
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email || data.email,
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
            role: metadata.role || 'parent'
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Profile creation failed:', createError)
        } else {
          profile = newProfile
          console.log('✅ Profile created:', profile)
        }
      } else if (profileData) {
        profile = profileData
        console.log('✅ Profile loaded:', profile)
      } else {
        console.error('⚠️ Profile fetch error:', profileError)
      }

      return { 
        user: authData.user, 
        profile,
        session: authData.session,
        error: null 
      }
    } catch (error: any) {
      console.error('❌ Signin failed:', error)
      return { 
        user: null, 
        profile: null, 
        session: null, 
        error: error.message || 'Signin failed' 
      }
    }
  },

  async signOut() {
    console.log('🔐 Signing out...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('❌ Signout error:', error)
    } else {
      console.log('✅ Signed out successfully')
    }
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('ℹ️ No authenticated user')
      return null
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('ℹ️ Current user:', user.email, 'Profile:', profile?.role)
    return { user, profile }
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('❌ Session error:', error)
      return null
    }
    return session
  },

  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      callback(event, session)
    })
  }
}