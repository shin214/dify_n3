import { NextResponse } from "next/server"

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID
    const APP_KEY = process.env.APP_KEY

    if (!APP_ID || !APP_KEY) {
      console.error("API credentials not configured")
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    console.log("Fetching conversations from Dify API")
    console.log(`API_URL: ${API_URL}`)
    console.log(`APP_ID: ${APP_ID}`)
    console.log(`APP_KEY: ${APP_KEY ? "設定済み" : "未設定"}`)

    const response = await fetch(`${API_URL}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APP_KEY}`,
        "X-App-ID": APP_ID,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Dify API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `API error: ${response.status} - ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("Conversations fetched successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in conversations API route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ message: "POST method not supported" }, { status: 405 })
}
