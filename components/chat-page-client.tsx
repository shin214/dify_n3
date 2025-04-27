"use client"

import { UserButton } from "@clerk/nextjs"
import ChatInterface from "@/components/chat-interface"

interface ChatPageClientProps {
  userId: string
}

export default function ChatPageClient({ userId }: ChatPageClientProps) {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Difyチャット</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface userId={userId} />
      </main>
    </div>
  )
}
