"use client"

import { useState, useEffect, useCallback } from "react"

// チャットフックを作成（サーバーサイドAPIを使用）
export const useChat = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // 会話の初期化
  useEffect(() => {
    const initConversation = async () => {
      try {
        console.log("Initializing conversation via server API")
        const response = await fetch("/api/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "会話の初期化に失敗しました")
        }

        const data = await response.json()
        setConversationId(data.conversation_id)
        console.log(`Conversation initialized with ID: ${data.conversation_id}`)
      } catch (err: any) {
        const errorMessage = err?.message || "会話の初期化に失敗しました"
        console.error(`Error initializing conversation: ${errorMessage}`)
        setError(errorMessage)
      }
    }

    initConversation()
  }, [])

  // メッセージの送信
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setIsLoading(true)
      setError(null)
      console.log(`Sending message via server API: ${content}`)
      console.log(`Current conversation ID: ${conversationId}`)

      // ユーザーメッセージを追加
      setMessages((prev) => [...prev, { role: "user", content }])

      try {
        // AIの応答を空で追加
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

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

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "メッセージの送信に失敗しました")
        }

        const data = await response.json()

        // AIの応答を更新
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: data.answer || "応答がありませんでした",
          }
          return updated
        })

        // 会話IDを更新
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
          console.log(`Updated conversation ID: ${data.conversation_id}`)
        }
      } catch (err: any) {
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

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    conversationId,
  }
}
