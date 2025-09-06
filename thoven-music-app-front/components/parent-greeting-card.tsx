"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

interface ParentGreetingCardProps {
  parent: {
    name: string
    email: string
    role: string
    avatar: string
  }
}

export function ParentGreetingCard({ parent }: ParentGreetingCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={parent.avatar || "/placeholder.svg"}
            alt={parent.name}
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-gray-900">Hello, {parent.name.split(" ")[0]}!</h2>
          <p className="text-gray-600 text-sm">{parent.email}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            {parent.role}
          </span>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Edit Profile</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
