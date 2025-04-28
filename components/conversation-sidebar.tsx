"use client"

import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Conversation } from "@/utils/use-conversations"

interface ConversationSidebarProps {
  conversations: Conversation[]
  isLoading: boolean
  error: string | null
  selectedConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  onNewConversation: () => void
}

export default function ConversationSidebar({
  conversations,
  isLoading,
  error,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  // 会話名を生成（日付を整形）
  const formatConversationName = (conversation: Conversation) => {
    const date = new Date(conversation.created_at)
    return `会話 ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button onClick={onNewConversation} className="w-full flex items-center gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          <span>新しい会話</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">会話がありません</div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <div className="truncate">{formatConversationName(conversation)}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
