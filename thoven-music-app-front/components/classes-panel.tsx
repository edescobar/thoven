"use client"

import { useState } from "react"
import { Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JoinClassModal } from "@/components/join-class-modal"

interface Class {
  id: string
  name: string
  teacher: string
  student: string
  lastUpdate: string
}

interface ClassesPanelProps {
  classes: Class[]
  showArchived: boolean
  onToggleArchived: () => void
  onJoinClass: (classCode: string) => void
}

export function ClassesPanel({ classes, showArchived, onToggleArchived, onJoinClass }: ClassesPanelProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">Classes</h2>
        <div className="flex gap-2">
          <Button
            onClick={onToggleArchived}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm bg-transparent"
          >
            <Archive className="w-4 h-4 mr-1" />
            Show Archived
          </Button>
          <Button
            onClick={() => setShowJoinModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm"
          >
            + Join Class
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <div key={classItem.id} className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-sans font-bold text-gray-900 mb-2">{classItem.name}</h3>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>
                Teacher: <span className="text-amber-600 font-medium">{classItem.teacher}</span>
              </p>
              <p>
                Student: <span className="text-amber-600 font-medium">{classItem.student}</span>
              </p>
              <p>Last Update: {classItem.lastUpdate}</p>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-xl text-sm">
                View Class
              </Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm">Message</Button>
            </div>
          </div>
        ))}
      </div>

      <JoinClassModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} onSubmit={onJoinClass} />
    </div>
  )
}
