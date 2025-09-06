export * from './config'
export * from './auth'
export * from './teachers'
export * from './parents'

// Re-export services as a single object for convenience
import { authService } from './auth'
import { teacherService } from './teachers'
import { parentService } from './parents'

export const api = {
  auth: authService,
  teachers: teacherService,
  parents: parentService,
}