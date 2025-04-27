"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { sendMessageToDifyAction, createConversationAction } from "@/app/actions/dify-actions"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  userId: string
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "こんにちは！どのようにお手伝いできますか？",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 初回レンダリング時に会話IDを作成
  useEffect(() => {
    async function initConversation() {
      try {
        setError(null)
        const newConversationId = await createConversationAction()
        setConversationId(newConversationId)
        console.log("New conversation created:", newConversationId)
      } catch (error) {
        console.error("Failed to create conversation:", error)
        setError("会話の初期化に失敗しました。ページを再読み込みしてください。")
      }
    }

    initConversation()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // サーバーアクションを使用してDify APIにメッセージを送信
      const response = await sendMessageToDifyAction(input, conversationId || undefined)

      // AIの応答を追加
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response.answer || "応答がありませんでした。",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // 会話IDが未設定の場合は設定
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // エラーメッセージを表示
      setError("メッセージの送信中にエラーが発生しました。もう一度お試しください。")
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "メッセージの送信中にエラーが発生しました。もう一度お試しください。",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start gap-2.5 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.sender === "ai" ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
