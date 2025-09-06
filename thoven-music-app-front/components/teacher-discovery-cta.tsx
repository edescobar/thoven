"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface TeacherDiscoveryCTAProps {
  hasStudents: boolean
}

/**
 * CTA component for teacher discovery
 * @example
 * <TeacherDiscoveryCTA hasStudents={false} />
 */
export const TeacherDiscoveryCTA: React.FC<TeacherDiscoveryCTAProps> = React.memo(({ hasStudents }) => {
  const router = useRouter()
  
  const handleBrowseTeachers = () => {
    router.push('/app/find-teachers')
  }

  return (
    <section 
      className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-6 md:p-8 mb-6 text-white"
      role="region"
      aria-label="Teacher discovery"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {!hasStudents ? "Start Your Musical Journey!" : "Find More Teachers"}
          </h2>
          <p className="text-amber-50 text-sm md:text-base">
            {!hasStudents 
              ? "Find qualified music teachers in your area and book your first lesson."
              : "Discover new teachers and expand your musical horizons."}
          </p>
        </div>
        <Button
          onClick={handleBrowseTeachers}
          className="w-full md:w-auto bg-white text-amber-600 hover:bg-amber-50 font-semibold px-4 md:px-6 py-2 md:py-3 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-500"
          aria-label={!hasStudents 
            ? "Browse available music teachers to start your journey" 
            : "Browse more music teachers"
          }
        >
          Browse Teachers <span aria-hidden="true">→</span>
        </Button>
      </div>
    </section>
  )
})

TeacherDiscoveryCTA.displayName = 'TeacherDiscoveryCTA'