"use client"

import { useState, useEffect, useCallback } from "react"

export const useConversations = () => {
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 会話一覧を取得
  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching conversations...")
      const response = await fetch("/api/conversations")

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Error fetching conversations:", errorData)
        throw new Error(errorData.error || "会話一覧の取得に失敗しました")
      }

      const data = await response.json()
      console.log("Conversations fetched:", data)

      // 会話一覧を日付の新しい順にソート
      const sortedConversations = data.data
        ? data.data.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
        : []

      setConversations(sortedConversations)
    } catch (err) {
      console.error("Error fetching conversations:", err)
      setError(err.message || "会話一覧の取得に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 初回レンダリング時に会話一覧を取得
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // 新しい会話を作成
  const createNewConversation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
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
        console.error("Error creating new conversation:", errorData)
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("New conversation created:", data)

      // 会話一覧を更新
      await fetchConversations()

      return data.conversation_id
    } catch (err) {
      console.error("Error creating new conversation:", err)
      setError(err.message || "新しい会話の作成に失敗しました")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [fetchConversations])

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    createNewConversation,
  }
}
