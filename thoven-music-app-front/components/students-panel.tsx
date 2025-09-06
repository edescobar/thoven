"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddStudentModal } from "@/components/add-student-modal"
import Image from "next/image"

interface Student {
  id: string
  name: string
  avatar: string
  interests: string[]
  activeClasses: number
  modes: string[]
}

interface StudentsPanelProps {
  students: Student[]
  onAddStudent: (studentData: any) => void
}

export function StudentsPanel({ students, onAddStudent }: StudentsPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false)

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_him_be_waving_just_waving_1756835489299-viUDIU3Cm4Qdw9BcXS2twEJbeFd7Zt.png"
          alt="Thovie waving"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h3 className="font-sans text-lg font-bold text-gray-900 mb-2">Add your first student to get started.</h3>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-semibold"
        >
          + Add Student
        </Button>
        <AddStudentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={onAddStudent} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Students</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
        >
          + Add Student
        </Button>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <Image
                src={student.avatar || "/placeholder.svg"}
                alt={student.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h3 className="font-sans font-bold text-gray-900">{student.name}</h3>
                <div className="flex gap-2 mt-1">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        interest === "Piano" ? "bg-pink-100 text-pink-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">📚 Active Classes: {student.activeClasses}</span>
            </div>

            <div className="flex gap-2 mb-4">
              {student.modes.map((mode) => (
                <span
                  key={mode}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    mode === "In-Person" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {mode}
                </span>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl bg-transparent"
            >
              View Full Profile
            </Button>
          </div>
        ))}
      </div>

      <AddStudentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={onAddStudent} />
    </div>
  )
}
