import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { apiUrl, appId, appKey } = await request.json()

    // 必要なパラメータの検証
    if (!apiUrl || !appId) {
      return NextResponse.json({ error: "API URL and App ID are required" }, { status: 400 })
    }

    // 使用するキー
    const key = appKey || process.env.APP_KEY

    if (!key) {
      return NextResponse.json({ error: "App Key is required" }, { status: 400 })
    }

    console.log("Testing Dify API directly")
    console.log(`API URL: ${apiUrl}`)
    console.log(`App ID: ${appId}`)
    console.log(`App Key: ${key ? "設定済み" : "未設定"}`)

    // 1. 会話一覧の取得テスト
    console.log("Testing GET conversations...")
    const conversationsResponse = await fetch(`${apiUrl}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "X-App-ID": appId,
      },
    })

    const conversationsData = await conversationsResponse.json()
    console.log(`GET conversations status: ${conversationsResponse.status}`)

    // 2. 新しい会話の作成テスト
    console.log("Testing POST conversation...")
    const conversationResponse = await fetch(`${apiUrl}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "X-App-ID": appId,
      },
      body: JSON.stringify({
        user: "user",
      }),
    })

    let conversationData
    try {
      conversationData = await conversationResponse.json()
    } catch (e) {
      conversationData = { error: "Failed to parse JSON response", text: await conversationResponse.text() }
    }
    console.log(`POST conversation status: ${conversationResponse.status}`)

    // 結果を返す
    return NextResponse.json({
      conversations: {
        status: conversationsResponse.status,
        data: conversationsData,
      },
      conversation: {
        status: conversationResponse.status,
        data: conversationData,
      },
    })
  } catch (error) {
    console.error("Error in test-dify-api:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST method" }, { status: 405 })
}
