import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Loading component for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
  </div>
)

// Lazy load heavy components
export const LazyChart = dynamic(
  () => import('@/components/ui/chart').then(mod => ({ default: mod.Chart })),
  { loading: () => <LoadingSpinner />, ssr: false }
)

export const LazyCalendar = dynamic(
  () => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })),
  { loading: () => <LoadingSpinner />, ssr: false }
)

export const LazyTeacherApplication = dynamic(
  () => import('@/components/teacher-application'),
  { loading: () => <LoadingSpinner />, ssr: false }
)

export const LazyTeacherLanding = dynamic(
  () => import('@/components/teacher-landing').then(mod => ({ default: mod.TeacherLanding })),
  { loading: () => <LoadingSpinner />, ssr: false }
)

export const LazyLearnerLanding = dynamic(
  () => import('@/components/learner-landing'),
  { loading: () => <LoadingSpinner />, ssr: false }
)

// Lazy load heavy page sections
export const LazyTeacherDashboardTabs = dynamic(
  () => import('@/components/teacher-dashboard-tabs'),
  { loading: () => <LoadingSpinner />, ssr: false }
)

// Lazy load authentication components
export const LazyAuthForm = dynamic(
  () => import('@/components/auth-form').then(mod => ({ default: mod.AuthForm })),
  { loading: () => <LoadingSpinner />, ssr: false }
)

// Lazy load dashboard components
export const LazyDashboard = dynamic(
  () => import('@/components/dashboard'),
  { loading: () => <LoadingSpinner />, ssr: false }
)

// Lazy load find teachers page
export const LazyFindTeachers = dynamic(
  () => import('@/app/app/find-teachers/page'),
  { loading: () => <LoadingSpinner />, ssr: false }
)