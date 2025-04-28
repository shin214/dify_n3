"use client"

import { UserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-interface"
import ConversationSidebar from "@/components/conversation-sidebar"
import { useConversations } from "@/utils/use-conversations"
import { useConversationMessages } from "@/utils/use-conversation-messages"
import { MessageSquarePlus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
    createNewConversation,
    fetchConversations,
  } = useConversations()

  const {
    messages: conversationMessages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useConversationMessages(selectedConversationId)

  // 認証チェック
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/")
    }
  }, [isLoaded, userId, router])

  // 初回レンダリング時に会話がなければ新しい会話を作成
  useEffect(() => {
    if (!isLoadingConversations && conversations.length === 0 && !conversationsError) {
      handleNewConversation()
    } else if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [isLoadingConversations, conversations, conversationsError])

  // 新しい会話を作成
  const handleNewConversation = async () => {
    const newConversationId = await createNewConversation()
    if (newConversationId) {
      setSelectedConversationId(newConversationId)
    }
  }

  // 会話を選択
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
  }

  // サイドバーの表示/非表示を切り替え
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!isLoaded || !userId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <div
        className={`bg-gray-100 ${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {isSidebarOpen && (
          <ConversationSidebar
            conversations={conversations}
            isLoading={isLoadingConversations}
            error={conversationsError}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold">Difyチャット</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleNewConversation} title="新しい会話">
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <ChatInterface
            key={selectedConversationId || "new"}
            conversationId={selectedConversationId}
            initialMessages={conversationMessages}
            onConversationCreated={(newId) => {
              setSelectedConversationId(newId)
              fetchConversations()
            }}
          />
        </main>
      </div>
    </div>
  )
}
