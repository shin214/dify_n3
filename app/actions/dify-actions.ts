"use server"

import { auth } from "@clerk/nextjs/server"

// Dify APIとの通信を行うサーバーアクション
export async function sendMessageToDifyAction(message: string, conversationId?: string) {
  try {
    const { userId } = auth()
    if (!userId) {
      throw new Error("認証されていません")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
    const appId = process.env.NEXT_PUBLIC_APP_ID
    const apiKey = process.env.APP_KEY

    if (!appId || !apiKey) {
      throw new Error("Dify API credentials are not configured")
    }

    const endpoint = conversationId
      ? `${apiUrl}/chat-messages?conversation_id=${conversationId}`
      : `${apiUrl}/chat-messages`

    console.log("Sending message to Dify API:", endpoint)

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-App-ID": appId,
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: "blocking",
        user: userId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Dify API error response:", errorData)
      throw new Error(`Dify API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending message to Dify:", error)
    throw error
  }
}

export async function createConversationAction() {
  try {
    const { userId } = auth()
    if (!userId) {
      throw new Error("認証されていません")
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
    const appId = process.env.NEXT_PUBLIC_APP_ID
    const apiKey = process.env.APP_KEY

    if (!appId || !apiKey) {
      throw new Error("Dify API credentials are not configured")
    }

    console.log("Creating conversation with Dify API")

    const response = await fetch(`${apiUrl}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-App-ID": appId,
      },
      body: JSON.stringify({
        user: userId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Dify API error response:", errorData)
      throw new Error(`Dify API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return data.conversation_id
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}
