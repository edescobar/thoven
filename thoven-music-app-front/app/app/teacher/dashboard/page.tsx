"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function TeacherDashboard() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.first_name || 'Teacher'}!</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600">Role: {profile?.role}</p>
            <p className="text-gray-600">Account created: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Actions</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Set up your teaching profile</li>
              <li>• Configure lesson bundles and pricing</li>
              <li>• Manage your availability</li>
              <li>• View student bookings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}