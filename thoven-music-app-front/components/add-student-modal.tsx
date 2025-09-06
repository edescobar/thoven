"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (studentData: {
    first_name: string
    last_name: string
    date_of_birth?: string
  }) => Promise<{ data: any; error: string | null }>
}

export function AddStudentModal({ isOpen, onClose, onSubmit }: AddStudentModalProps) {
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the student's first and last name",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    const studentData = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : undefined
    }

    const { error } = await onSubmit(studentData)

    if (error) {
      toast({
        title: "Error adding student",
        description: error,
        variant: "destructive"
      })
      setIsLoading(false)
    } else {
      toast({
        title: "Student added",
        description: `${firstName} ${lastName} has been added successfully`,
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setFirstName("")
    setLastName("")
    setDateOfBirth(undefined)
    setIsLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-gray-900">Add Student</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isLoading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal p-3 border-gray-200 rounded-xl",
                    !dateOfBirth && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}