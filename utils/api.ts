"use client"

import { useState, useEffect, useCallback } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
const APP_ID = process.env.NEXT_PUBLIC_APP_ID

// チャットメッセージを送信する関数
export const sendChatMessage = async (
  message: string,
  conversationId: string | null = null,
  onMessageUpdate?: (message: string) => void,
) => {
  try {
    const endpoint = conversationId
      ? `${API_URL}/chat-messages?conversation_id=${conversationId}`
      : `${API_URL}/chat-messages`

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-ID": APP_ID || "",
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: "streaming",
        user: "user",
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("Response body is not readable")
    }

    let partialResponse = ""
    let conversationIdFromResponse = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split("\n").filter(Boolean)

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.substring(6))

            if (data.event === "message") {
              partialResponse += data.answer || ""
              if (onMessageUpdate) {
                onMessageUpdate(partialResponse)
              }
            } else if (data.event === "error") {
              throw new Error(data.error || "Unknown error")
            } else if (data.conversation_id && !conversationIdFromResponse) {
              conversationIdFromResponse = data.conversation_id
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e)
          }
        }
      }
    }

    return {
      answer: partialResponse,
      conversation_id: conversationIdFromResponse || conversationId,
    }
  } catch (error) {
    console.error("Error sending chat message:", error)
    throw error
  }
}

// 新しい会話を作成する関数
export const createConversation = async () => {
  try {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-ID": APP_ID || "",
      },
      body: JSON.stringify({
        user: "user",
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.conversation_id
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

// チャットフックを作成
export const useChat = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // 会話の初期化
  useEffect(() => {
    const initConversation = async () => {
      try {
        const id = await createConversation()
        setConversationId(id)
      } catch (err) {
        setError("会話の初期化に失敗しました")
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

      // ユーザーメッセージを追加
      setMessages((prev) => [...prev, { role: "user", content }])

      try {
        // AIの応答を空で追加（ストリーミング用）
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        // メッセージ更新用のコールバック
        const updateAssistantMessage = (newContent: string) => {
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: "assistant", content: newContent }
            return updated
          })
        }

        // メッセージを送信
        const result = await sendChatMessage(content, conversationId, updateAssistantMessage)

        // 会話IDを更新
        if (result.conversation_id) {
          setConversationId(result.conversation_id)
        }
      } catch (err) {
        setError("メッセージの送信に失敗しました")
        // エラーメッセージを表示
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: "エラーが発生しました。もう一度お試しください。",
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
