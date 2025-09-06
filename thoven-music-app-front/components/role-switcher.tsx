"use client"

import { useState, useEffect } from "react"

interface RoleSwitcherProps {
  onRoleChange: (role: "learner" | "teacher") => void
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [role, setRole] = useState<"learner" | "teacher">("learner")

  useEffect(() => {
    // Rehydrate from localStorage on mount
    const savedRole = localStorage.getItem("thovenRoleChoice") as "learner" | "teacher" | null
    if (savedRole) {
      setRole(savedRole)
      onRoleChange(savedRole)
    }
  }, [onRoleChange])

  const handleRoleChange = (newRole: "learner" | "teacher") => {
    setRole(newRole)
    localStorage.setItem("thovenRoleChoice", newRole)

    // Analytics tracking
    window.dataLayer?.push({ event: "lp_role_switch", role: newRole })
    if (window.mixpanel) {
      window.mixpanel.track("lp_role_switch", { role: newRole })
    }

    onRoleChange(newRole)
  }

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-2xl bg-amber-50 p-1.5 border border-amber-200 shadow-sm">
        <button
          className={`font-sans px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            role === "learner" ? "bg-white text-amber-600 shadow-md" : "text-amber-500 hover:text-amber-600"
          }`}
          onClick={() => handleRoleChange("learner")}
        >
          I'm a Learner
        </button>
        <button
          className={`font-sans px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            role === "teacher" ? "bg-white text-amber-600 shadow-md" : "text-amber-500 hover:text-amber-600"
          }`}
          onClick={() => handleRoleChange("teacher")}
        >
          I'm a Teacher
        </button>
      </div>
    </div>
  )
}
