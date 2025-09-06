"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff } from "lucide-react"
import { authService } from "@/lib/supabase/auth-v2"
import { useRouter } from "next/navigation"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUpClick?: () => void
}

export function SignInModal({ isOpen, onClose, onSignUpClick }: SignInModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError("")

    try {
      console.log('🔑 Attempting sign in...')
      
      const result = await authService.signIn({
        email,
        password
      })
      
      if (result.error) {
        console.error('Sign in error:', result.error)
        throw new Error(result.error)
      }

      if (result.user && result.session) {
        console.log('✅ Sign in successful, redirecting...')
        onClose()
        
        // Small delay to ensure state updates
        setTimeout(() => {
          if (result.profile?.role === 'parent') {
            router.push("/app/parent/dashboard")
          } else if (result.profile?.role === 'teacher') {
            router.push("/app/teacher/dashboard")
          } else {
            router.push("/app/dashboard")
          }
        }, 100)
      } else {
        throw new Error('Sign in completed but no session created')
      }
    } catch (err: any) {
      if (err.message.includes("Invalid") || err.message.includes("credentials")) {
        setError("Invalid email or password")
      } else if (err.message.includes("not found") || err.message.includes("No user")) {
        setError("No account found. Want to sign up?")
      } else {
        setError(err.message || "Sign in failed. Please try again.")
      }
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

        <div className="p-8 text-center">
          {/* Thovie Character */}
          <div className="mb-6">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_him_be_waving_just_waving_1756835489299-viUDIU3Cm4Qdw9BcXS2twEJbeFd7Zt.png"
              alt="Thovie waving"
              className="w-32 h-32 mx-auto"
            />
          </div>

          {/* Header */}
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">🎉 Welcome back to Thoven!</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="text-left">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block font-sans">
                Enter your email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl font-sans focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  error && error.includes("No account found") ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="text-left">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block font-sans">
                Enter your password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl font-sans focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    error && error.includes("Wrong password") ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-sans">
                {error.includes("sign up") ? (
                  <span>
                    {error.split("Want to sign up?")[0]}
                    <button
                      type="button"
                      className="text-amber-600 hover:text-amber-700 underline font-medium"
                      onClick={onSignUpClick}
                    >
                      Want to sign up?
                    </button>
                  </span>
                ) : (
                  error
                )}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                type="button"
                className="text-sm text-amber-600 hover:text-amber-700 hover:underline font-sans"
                onClick={() => console.log("[v0] Open forgot password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 px-6 rounded-xl font-semibold font-sans text-white transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_0_#d97706] hover:shadow-[0_6px_0_0_#b45309] active:shadow-[0_2px_0_0_#d97706] active:translate-y-1 hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? "🎵 Tuning up your account…" : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-sm text-gray-600 font-sans">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
