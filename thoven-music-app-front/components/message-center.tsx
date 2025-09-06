"use client"

import { Trash2 } from "lucide-react"

interface Message {
  id: string
  isNew: boolean
  sender: string
  subject: string
  date: string
}

interface MessageCenterProps {
  messages: Message[]
  onDeleteMessage: (messageId: string) => void
}

export function MessageCenter({ messages, onDeleteMessage }: MessageCenterProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Message</h2>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {message.isNew && <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0"></div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {message.isNew && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">New!</span>
                )}
                <span className="font-medium text-gray-900">{message.sender}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1 truncate">{message.subject}</p>
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">{message.date}</span>
            <button
              onClick={() => onDeleteMessage(message.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
