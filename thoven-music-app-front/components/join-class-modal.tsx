"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JoinClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (classCode: string) => void
}

export function JoinClassModal({ isOpen, onClose, onSubmit }: JoinClassModalProps) {
  const [classCode, setClassCode] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(classCode)
    setClassCode("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-gray-900">Join Class</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Code</label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter class code from your teacher"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!classCode.trim()}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white rounded-xl font-semibold"
            >
              Join
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
