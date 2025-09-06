"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ParentGreetingCard } from "@/components/parent-greeting-card"
import { StudentsPanel } from "@/components/students-panel"
import { ClassesPanel } from "@/components/classes-panel"
import { MessageCenter } from "@/components/message-center"
import { LeftNavRail } from "@/components/left-nav-rail"
import { useStudents } from "@/hooks/use-students"
import { useEnrollments } from "@/hooks/use-enrollments"

// Type definitions for fixtures
interface Student {
  id: string
  name: string
  avatar: string
  interests: string[]
  activeClasses: number
  modes: string[]
}

interface Class {
  id: string
  name: string
  teacher: string
  student: string
  lastUpdate: string
}

interface Message {
  id: string
  isNew: boolean
  sender: string
  subject: string
  date: string
}

// Initialize with empty arrays (typed)
const studentsFixture: Student[] = []
const classesFixture: Class[] = []
const messagesFixture: Message[] = []

export default function StudentDashboard() {
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()
  const { students, addStudent, loading: studentsLoading } = useStudents()
  const { enrollments, createEnrollment, loading: enrollmentsLoading } = useEnrollments()
  const [messages, setMessages] = useState(messagesFixture)
  const [showArchived, setShowArchived] = useState(false)

  // Memoize parent data calculation for performance
  const parentData = useMemo(() => 
    profile ? {
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      role: profile.role === 'parent' ? 'Parent' : profile.role,
      avatar: profile.profile_picture_url || "/woman-dark-hair.png",
    } : {
      name: "Keriman Erten",
      email: "kerimanerten@iCloud.com",
      role: "Mother",
      avatar: "/woman-dark-hair.png",
    }, [profile])

  // Transform enrollments to classes format
  const classes = useMemo(() => 
    enrollments.map(enrollment => ({
      id: enrollment.id,
      name: `${enrollment.instrument} Lessons`,
      teacher: enrollment.teachers?.profiles ? 
        `${enrollment.teachers.profiles.first_name} ${enrollment.teachers.profiles.last_name}` : 
        'Teacher',
      student: enrollment.students ? 
        `${enrollment.students.first_name} ${enrollment.students.last_name}` : 
        'Student',
      lastUpdate: new Date(enrollment.updated_at).toLocaleDateString()
    })), [enrollments])

  // Transform students data for StudentsPanel
  const studentsForPanel = useMemo(() => 
    students.map(student => ({
      id: student.id,
      name: `${student.first_name} ${student.last_name}`,
      avatar: student.profile_picture_url || 
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_him_be_waving_just_waving_1756835489299-viUDIU3Cm4Qdw9BcXS2twEJbeFd7Zt.png",
      interests: [],
      activeClasses: enrollments.filter(e => e.student_id === student.id && e.status === 'active').length,
      modes: []
    })), [students, enrollments])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleAddStudent = async (studentData: {
    first_name: string
    last_name: string
    date_of_birth?: string
  }) => {
    const result = await addStudent(studentData)
    return result
  }

  const handleJoinClass = async (teacherId: string, studentId: string, instrument: string) => {
    await createEnrollment({
      student_id: studentId,
      teacher_id: teacherId,
      instrument: instrument,
      lesson_type: 'online'
    })
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId))
  }

  const handleLogout = async () => {
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
        <div className="flex items-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-Ts5Qu9cYp28KPMWeyKi361H6sTD2Qc.png"
            alt="THOVEN - Music Education Platform"
            className="h-16 w-auto"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-gray-600">Welcome, {parentData.name}</span>
          <Button
            onClick={() => router.push('/app/find-teachers')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Navigate to find teachers page"
          >
            Find Teachers
          </Button>
          <Button
            variant="outline"
            className="border-orange-400 text-orange-600 hover:bg-orange-50 bg-transparent shadow-[0_4px_0_0_rgb(251,146,60)] hover:shadow-[0_2px_0_0_rgb(251,146,60)] active:shadow-[0_1px_0_0_rgb(251,146,60)] transition-all duration-150 active:translate-y-1 font-sans font-semibold"
            onClick={handleLogout}
            aria-label="Sign out of your account"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Authority Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
        <p className="text-sm text-amber-800 text-center">
          Parents manage payments, messaging, scheduling, and account settings. Students see homework, files, and
          progress.
        </p>
      </div>

      <div className="flex">
        {/* Left Navigation Rail */}
        <LeftNavRail />

        {/* Main Content - Responsive margins */}
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          {/* Teacher Discovery CTA */}

          {/* Row A - Top Panels */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <ParentGreetingCard parent={parentData} />
            <StudentsPanel students={studentsForPanel} onAddStudent={handleAddStudent} />
            <ClassesPanel
              classes={classes}
              showArchived={showArchived}
              onToggleArchived={() => setShowArchived(!showArchived)}
              onJoinClass={handleJoinClass}
            />
          </div>

          {/* Row B - Message Center */}
          <MessageCenter messages={messages} onDeleteMessage={handleDeleteMessage} />
        </main>
      </div>
    </div>
  )
}
