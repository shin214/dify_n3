import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ChatPageClient from "@/components/chat-page-client"

export default async function ChatPage() {
  const { userId } = auth()

  // 未認証の場合はホームページにリダイレクト
  if (!userId) {
    redirect("/")
  }

  return <ChatPageClient userId={userId} />
}
