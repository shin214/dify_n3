"use client"

import { UserButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-interface"
import ConversationSidebar from "@/components/conversation-sidebar"
import { useConversations } from "@/utils/use-conversations"
import { useConversationMessages } from "@/utils/use-conversation-messages"
import { MessageSquarePlus, Menu, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [error, setError] = useState(null)

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
    const initializeConversation = async () => {
      try {
        if (!isLoadingConversations && conversations.length === 0 && !conversationsError) {
          console.log("No conversations found, creating a new one...")
          const newConversationId = await createNewConversation()
          if (newConversationId) {
            console.log(`Created new conversation: ${newConversationId}`)
            setSelectedConversationId(newConversationId)
          } else {
            console.error("Failed to create new conversation")
            setError("新しい会話の作成に失敗しました")
          }
        } else if (conversations.length > 0 && !selectedConversationId) {
          console.log(`Setting selected conversation to first one: ${conversations[0].id}`)
          setSelectedConversationId(conversations[0].id)
        }
      } catch (err) {
        console.error("Error initializing conversation:", err)
        setError(`会話の初期化に失敗しました: ${err.message}`)
      }
    }

    initializeConversation()
  }, [isLoadingConversations, conversations, conversationsError, createNewConversation])

  // 新しい会話を作成
  const handleNewConversation = async () => {
    try {
      setError(null)
      const newConversationId = await createNewConversation()
      if (newConversationId) {
        setSelectedConversationId(newConversationId)
      } else {
        setError("新しい会話の作成に失敗しました")
      }
    } catch (err) {
      console.error("Error creating new conversation:", err)
      setError(`新しい会話の作成に失敗しました: ${err.message}`)
    }
  }

  // 会話を選択
  const handleSelectConversation = (conversationId) => {
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

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4 flex items-center"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

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
