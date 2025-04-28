"use client"

import { useState, useEffect, useCallback } from "react"

export const useConversationMessages = (conversationId) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 会話のメッセージを取得
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Fetching messages for conversation: ${conversationId}`)
      const response = await fetch(`/api/conversation-messages?conversation_id=${conversationId}`)

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error fetching messages:", errorData)
        throw new Error(errorData.error || "メッセージの取得に失敗しました")
      }

      const data = await response.json()
      console.log("Messages fetched:", data)

      // メッセージを日付順にソート
      const sortedMessages = data.data
        ? data.data.sort((a, b) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          })
        : []

      setMessages(sortedMessages)
    } catch (err) {
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
