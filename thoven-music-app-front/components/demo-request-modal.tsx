"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface DemoRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setIsSubmitted(true)

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose()
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  const handleClose = () => {
    onClose()
    setIsSubmitted(false)
    setEmail("")
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-sans text-2xl font-bold text-gray-900 mb-2">Request a Demo</h3>
              <p className="font-sans text-gray-600">
                Enter your email and we'll reach out to schedule a personalized demo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="demo-email" className="font-sans block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="demo-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-semibold rounded-xl shadow-[0_4px_0_0_#d97706] hover:shadow-[0_4px_0_0_#b45309] active:shadow-[0_2px_0_0_#b45309] active:translate-y-[2px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Request Demo"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="font-sans text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="font-sans text-lg text-gray-600">We will be reaching out shortly</p>
          </div>
        )}
      </div>
    </div>
  )
}
