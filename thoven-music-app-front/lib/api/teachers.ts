import { apiRequest } from './config'

export interface Teacher {
  id: string
  first_name: string
  last_name: string
  email: string
  profile_picture?: string
  intro_paragraph?: string
  instruments_taught: string[]
  age_groups_taught: string[]
  online_lessons: boolean
  teaching_method?: string
  introduction?: string
  discovery: 'available' | 'waitlist' | 'hidden'
  city?: string
  state?: string
}

export interface TeacherSearchParams {
  instrument?: string
  location?: string
  online?: boolean
  age_group?: string
  page?: number
  per_page?: number
}

export interface Bundle {
  id: string
  name: string
  duration_value: number
  duration_unit: string
  price: string
  credits: number
  instruments?: string[]
  teacher_profile_id: string
}

export interface TeacherAvailability {
  id: string
  start_time: string
  end_time: string
  status: 'active' | 'paused' | 'booked' | 'cancelled'
  max_bookings: number
  remaining_capacity: number
}

export const teacherService = {
  async searchTeachers(params: TeacherSearchParams = {}): Promise<Teacher[]> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
    
    return apiRequest(`/teacher_finder?${queryParams}`)
  },

  async getTeacher(id: string): Promise<Teacher> {
    return apiRequest(`/teacher_finder/${id}`)
  },

  async getTeacherBundles(teacherId: string): Promise<Bundle[]> {
    return apiRequest(`/teachers/bundles?teacher_profile_id=${teacherId}`)
  },

  async getTeacherAvailability(teacherId: string, date?: string): Promise<TeacherAvailability[]> {
    const params = date ? `?date=${date}` : ''
    return apiRequest(`/teachers/teacher_availabilities?teacher_profile_id=${teacherId}${params}`)
  },

  // Teacher-specific methods (for teachers managing their own data)
  async createBundle(bundle: Partial<Bundle>): Promise<Bundle> {
    return apiRequest('/teachers/bundles', {
      method: 'POST',
      body: JSON.stringify({ bundle }),
    })
  },

  async updateBundle(id: string, bundle: Partial<Bundle>): Promise<Bundle> {
    return apiRequest(`/teachers/bundles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ bundle }),
    })
  },

  async deleteBundle(id: string): Promise<void> {
    return apiRequest(`/teachers/bundles/${id}`, {
      method: 'DELETE',
    })
  },

  async createAvailability(availability: Partial<TeacherAvailability>): Promise<TeacherAvailability> {
    return apiRequest('/teachers/teacher_availabilities', {
      method: 'POST',
      body: JSON.stringify({ teacher_availability: availability }),
    })
  },

  async updateAvailability(id: string, availability: Partial<TeacherAvailability>): Promise<TeacherAvailability> {
    return apiRequest(`/teachers/teacher_availabilities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ teacher_availability: availability }),
    })
  },

  async deleteAvailability(id: string): Promise<void> {
    return apiRequest(`/teachers/teacher_availabilities/${id}`, {
      method: 'DELETE',
    })
  },

  async getTeacherDashboard(): Promise<any> {
    return apiRequest('/teachers/dashboard')
  },
}