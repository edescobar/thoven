"use client"

import { Users, BookOpen, MessageSquare, Calendar, CreditCard, Settings } from "lucide-react"
import Link from "next/link"

const navItems = [
  {
    icon: Users,
    title: "My Students",
    hint: "View and manage students profile",
    href: "/parent/students",
  },
  {
    icon: BookOpen,
    title: "Classes",
    hint: "Track ongoing lessons and progress",
    href: "/parent/classes",
  },
  {
    icon: MessageSquare,
    title: "Messages",
    hint: "Communicate with teachers",
    href: "/parent/messages",
  },
  {
    icon: Calendar,
    title: "Calendar",
    hint: "View and manage lessons and others",
    href: "/parent/calendar",
  },
  {
    icon: CreditCard,
    title: "Billing",
    hint: "Manage payments and billing history",
    href: "/parent/billing",
  },
  {
    icon: Settings,
    title: "Settings",
    hint: "Customize account preferences",
    href: "/parent/settings",
  },
]

export function LeftNavRail() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 pt-24">
      <div className="space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Icon className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.hint}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
