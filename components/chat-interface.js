"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import LoadingDots from "@/components/loading-dots"

export default function ChatInterface({ conversationId, initialMessages = [], onConversationCreated }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const { user } = useUser()

  // 初期メッセージを設定
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const formattedMessages = initialMessages.flatMap((msg) => [
        { role: "user", content: msg.query },
        { role: "assistant", content: msg.answer },
      ])
      setMessages(formattedMessages)
    } else {
      setMessages([])
    }
  }, [initialMessages])

  // 会話IDがない場合は新しい会話を作成
  useEffect(() => {
    if (!conversationId) {
      createNewConversation()
    }
  }, [conversationId])

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 新しい会話を作成
  const createNewConversation = async () => {
    try {
      setError(null)
      console.log("Creating new conversation...")

      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // 空のボディを送信
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error creating conversation:", errorData)
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Conversation created:", data)

      if (onConversationCreated && data.conversation_id) {
        onConversationCreated(data.conversation_id)
      } else {
        console.error("No conversation ID returned")
        setError("会話IDが返されませんでした")
      }
    } catch (err) {
      console.error("Error creating conversation:", err)
      setError(`会話の作成に失敗しました: ${err.message}`)
    }
  }

  // メッセージを送信
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || isLoading || !conversationId) return

      setIsLoading(true)
      setError(null)

      // ユーザーメッセージを追加
      setMessages((prev) => [...prev, { role: "user", content }])

      try {
        // AIの応答を空で追加
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        console.log(`Sending message to conversation ${conversationId}: ${content}`)

        // サーバーサイドAPIを使用してメッセージを送信
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            conversationId,
          }),
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Error sending message:", errorData)
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        const data = await response.json()
        console.log("Message response:", data)

        // AIの応答を更新
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: data.answer || "応答がありませんでした",
          }
          return updated
        })
      } catch (err) {
        const errorMessage = err?.message || "メッセージの送信に失敗しました"
        console.error(`Error sending message: ${errorMessage}`)
        setError(errorMessage)

        // エラーメッセージを表示
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: `エラーが発生しました: ${errorMessage}`,
          }
          return updated
        })
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, isLoading],
  )

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input
    setInput("")
    await sendMessage(message)
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4 flex items-center"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {conversationId && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded m-4 flex items-center">
          <p>会話ID: {conversationId}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">こんにちは！どのようにお手伝いできますか？</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start gap-2.5 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {message.role === "assistant" ? (
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
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.content || (isLoading && index === messages.length - 1 ? "..." : "")}
                </p>
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
          placeholder={isLoading ? "AIが応答中..." : "メッセージを入力..."}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !conversationId}>
          {isLoading ? <LoadingDots /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
