import { apiRequest } from './config'

export interface Student {
  id: string
  email: string
  first_name: string
  last_name: string
  date_of_birth: string
  instruments_of_interest: string[]
  playing_level: number
  learning_goals?: string
  time_zone: string
  preferred_class_times?: any
}

export interface BundlePurchase {
  id: string
  bundle_id: string
  profile_id: string
  credits_remaining: number
  purchased_at: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  bundle: {
    name: string
    duration_value: number
    duration_unit: string
    price: string
    teacher_profile: {
      first_name: string
      last_name: string
    }
  }
}

export interface Booking {
  id: string
  student_id: string
  teacher_profile_id: string
  teacher_availability_id: string
  bundle_purchase_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'completed'
  notes?: string
  google_calendar_event_id?: string
  teacher?: {
    first_name: string
    last_name: string
  }
  student?: Student
}

export interface BookingRequest {
  student_id: string
  teacher_availability_id: string
  notes?: string
}

export const parentService = {
  // Student management
  async getStudents(): Promise<Student[]> {
    return apiRequest('/parents/students')
  },

  async createStudent(student: Partial<Student>): Promise<Student> {
    return apiRequest('/parents/students', {
      method: 'POST',
      body: JSON.stringify({ student }),
    })
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    return apiRequest(`/parents/students/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ student }),
    })
  },

  // Bundle purchases
  async getPurchasedBundles(): Promise<BundlePurchase[]> {
    return apiRequest('/parents/bundles/purchased')
  },

  async purchaseBundle(bundleId: string): Promise<BundlePurchase> {
    return apiRequest(`/parents/bundles/${bundleId}/purchase`, {
      method: 'POST',
    })
  },

  // Bookings
  async getBookings(studentId?: string): Promise<Booking[]> {
    const params = studentId ? `?student_id=${studentId}` : ''
    return apiRequest(`/parents/bookings${params}`)
  },

  async createBooking(booking: BookingRequest): Promise<Booking> {
    return apiRequest(`/parents/students/${booking.student_id}/bookings`, {
      method: 'POST',
      body: JSON.stringify({ booking }),
    })
  },

  async cancelBooking(studentId: string, bookingId: string): Promise<Booking> {
    return apiRequest(`/parents/students/${studentId}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    })
  },

  async getAvailableTimes(studentId: string, teacherId: string, date: string): Promise<any> {
    const params = new URLSearchParams({
      teacher_profile_id: teacherId,
      date: date,
    })
    return apiRequest(`/parents/students/${studentId}/bookings/available_times?${params}`)
  },

  async getParentDashboard(): Promise<any> {
    return apiRequest('/parents/dashboard')
  },

  // Browse bundles
  async browseBundles(params: {
    instrument?: string
    min_price?: number
    max_price?: number
    teacher_id?: string
  } = {}): Promise<any> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
    
    return apiRequest(`/parents/bundles?${queryParams}`)
  },
}