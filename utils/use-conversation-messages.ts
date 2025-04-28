"use client"

import { useState, useEffect, useCallback } from "react"

export type Message = {
  id: string
  conversation_id: string
  query: string
  answer: string
  created_at: string
}

export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 会話のメッセージを取得
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/conversation-messages?conversation_id=${conversationId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "メッセージの取得に失敗しました")
      }

      const data = await response.json()

      // メッセージを日付順にソート
      const sortedMessages = data.data
        ? data.data.sort((a: any, b: any) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          })
        : []

      setMessages(sortedMessages)
    } catch (err: any) {
      console.error("Error fetching messages:", err)
      setError(err.message || "メッセージの取得に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  // 会話IDが変更されたらメッセージを取得
  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    } else {
      setMessages([])
    }
  }, [conversationId, fetchMessages])

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
  }
}
