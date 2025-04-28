import { NextResponse } from "next/server"

// デバッグ用の詳細なログ
function logDetails(message, details) {
  console.log(`[DEBUG] ${message}:`, details)
}

export async function POST(request) {
  try {
    logDetails("POST /api/conversation - Request received", { url: request.url })

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dify.ai/v1"
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID
    const APP_KEY = process.env.APP_KEY

    logDetails("Environment variables", {
      API_URL,
      APP_ID,
      APP_KEY: APP_KEY ? "設定済み" : "未設定",
    })

    if (!APP_ID || !APP_KEY) {
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    // リクエストURLとヘッダーをログに記録
    const difyUrl = `${API_URL}/conversations`
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APP_KEY}`,
      "X-App-ID": APP_ID,
    }

    logDetails("Dify API request", { url: difyUrl, headers: { ...headers, Authorization: "Bearer ***" } })

    // Dify APIに直接リクエスト
    const response = await fetch(difyUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ user: "user" }),
    })

    logDetails("Dify API response status", { status: response.status })

    // レスポンスの詳細をログに記録
    const responseText = await response.text()
    logDetails("Dify API response text", { text: responseText })

    // JSONとして解析を試みる
    let data
    try {
      data = JSON.parse(responseText)
      logDetails("Dify API response parsed", { data })
    } catch (e) {
      logDetails("Failed to parse response as JSON", { error: e.message })
      return NextResponse.json({ error: `Failed to parse response: ${responseText}` }, { status: 500 })
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status} - ${responseText}` },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logDetails("Error in conversation API route", { error: error.message, stack: error.stack })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "GET method not supported" }, { status: 405 })
}
