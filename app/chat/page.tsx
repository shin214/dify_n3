import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ChatInterface from "@/components/chat-interface"

export default async function ChatPage() {
  const { userId } = auth()

  // 未認証の場合はホームページにリダイレクト
  if (!userId) {
    redirect("/")
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Difyチャット</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  )
}
