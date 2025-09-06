"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, Eye, EyeOff } from "lucide-react"
import { authService } from "@/lib/supabase/auth-v2"
import { useRouter } from "next/navigation"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSignInClick: () => void
}

export function SignUpModal({ isOpen, onClose, onSignInClick }: SignUpModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
    userType: "parent" as "parent" | "teacher"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isFormValid = 
    formData.email.trim() !== "" && 
    formData.password.trim() !== "" &&
    formData.passwordConfirmation.trim() !== "" &&
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.password === formData.passwordConfirmation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      console.log('📝 Submitting signup form...')
      
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.userType
      })
      
      if (result.error) {
        console.error('Signup error:', result.error)
        throw new Error(result.error)
      }

      if (result.user && result.session) {
        console.log('✅ Signup successful, redirecting...')
        onClose()
        
        // Small delay to ensure state updates
        setTimeout(() => {
          if (formData.userType === "parent") {
            router.push("/app/parent/dashboard")
          } else {
            router.push("/app/teacher/dashboard")
          }
        }, 100)
      } else {
        throw new Error('Signup completed but no session created')
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          type="button"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              🎵 Join Thoven Today!
            </h2>
            <p className="text-sm text-gray-600">
              Start your musical journey with personalized lessons
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                I want to:
              </Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => setFormData({...formData, userType: value as "parent" | "teacher"})}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent" className="font-normal cursor-pointer">
                    Find lessons for myself or my child
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher" className="font-normal cursor-pointer">
                    Teach music lessons
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1 block">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="John"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1 block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 pr-10 border rounded-lg"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Confirmation Field */}
            <div>
              <Label htmlFor="passwordConfirmation" className="text-sm font-medium text-gray-700 mb-1 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={formData.passwordConfirmation}
                  onChange={(e) => setFormData({...formData, passwordConfirmation: e.target.value})}
                  className="w-full px-3 py-2 pr-10 border rounded-lg"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && formData.passwordConfirmation && formData.password !== formData.passwordConfirmation && (
                <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-amber-500 hover:bg-amber-600 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Creating your account..." : "Sign Up"}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <button
              type="button"
              className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
              onClick={onSignInClick}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}