import { NextResponse } from "next/server"

export async function POST() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID
    const APP_KEY = process.env.APP_KEY

    if (!APP_ID || !APP_KEY) {
      console.error("API credentials not configured")
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    console.log("Creating new conversation with Dify API")
    console.log(`API_URL: ${API_URL}`)
    console.log(`APP_ID: ${APP_ID}`)
    console.log(`APP_KEY: ${APP_KEY ? "設定済み" : "未設定"}`)

    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APP_KEY}`,
        "X-App-ID": APP_ID,
      },
      body: JSON.stringify({
        user: "user",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Dify API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `API error: ${response.status} - ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("Conversation created successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in conversation API route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GETメソッドを追加（必要に応じて）
export async function GET() {
  return NextResponse.json({ message: "GET method not supported" }, { status: 405 })
}
