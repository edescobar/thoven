"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/supabase/auth-v2"

interface TeacherApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TeacherApplicationModal({ isOpen, onClose }: TeacherApplicationModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    instruments: "",
    experience: "",
    bio: "",
    hourlyRate: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sign up as a teacher
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'teacher'
      })

      if (result.error) {
        alert(`Error: ${result.error}`)
        return
      }

      // Success - redirect to teacher dashboard
      onClose()
      router.push('/app/teacher/dashboard')
    } catch (error: any) {
      alert(`Application failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Become a Music Teacher
              </h2>
              <p className="text-gray-600 mt-1">
                Join our community of passionate music educators
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a secure password"
              />
            </div>

            {/* Instruments */}
            <div>
              <Label htmlFor="instruments">Instruments You Teach</Label>
              <Input
                id="instruments"
                required
                value={formData.instruments}
                onChange={(e) => setFormData({...formData, instruments: e.target.value})}
                placeholder="e.g., Piano, Guitar, Violin"
              />
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience">Years of Teaching Experience</Label>
              <Input
                id="experience"
                type="number"
                required
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                placeholder="5"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                required
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                placeholder="75"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Tell Us About Yourself</Label>
              <Textarea
                id="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Share your teaching philosophy, experience, and what makes you unique..."
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
            >
              {isLoading ? "Submitting Application..." : "Submit Application"}
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
              By applying, you agree to our terms of service and privacy policy.
              We'll review your application and get back to you within 48 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}