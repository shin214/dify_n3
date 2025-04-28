"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DebugPage() {
  const [publicEnvVars, setPublicEnvVars] = useState({})
  const [apiStatus, setApiStatus] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [requestDetails, setRequestDetails] = useState({})

  useEffect(() => {
    // 公開環境変数を収集
    const vars = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        vars[key] = process.env[key] || ""
      }
    })
    setPublicEnvVars(vars)
  }, [])

  const checkApiEndpoint = async (endpoint, method = "GET", body = null) => {
    setIsLoading(true)
    const startTime = Date.now()

    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      // POSTリクエストの場合はボディを追加
      if (method === "POST" && body) {
        options.body = JSON.stringify(body)
      } else if (method === "POST") {
        options.body = JSON.stringify({})
      }

      // リクエスト詳細を記録
      setRequestDetails((prev) => ({
        ...prev,
        [endpoint]: {
          method,
          url: endpoint,
          headers: options.headers,
          body: options.body,
          timestamp: new Date().toISOString(),
        },
      }))

      const response = await fetch(endpoint, options)
      const status = response.status
      const headers = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      let data = null
      let responseText = null
      try {
        responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (e) {
        // JSONでない場合はテキストとして保存
        data = { text: responseText, parseError: e.message }
      }

      const duration = Date.now() - startTime

      setApiStatus((prev) => ({
        ...prev,
        [endpoint]: {
          status,
          headers,
          data,
          responseText,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      }))
    } catch (error) {
      const duration = Date.now() - startTime

      setApiStatus((prev) => ({
        ...prev,
        [endpoint]: {
          status: "Error",
          error: error.message,
          stack: error.stack,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">デバッグページ</h1>

      <div className="mb-4">
        <Link href="/debug/direct-api-test" className="text-blue-500 underline">
          Dify API直接テストページへ
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">公開環境変数</h2>
        <div className="bg-gray-100 p-4 rounded">
          {Object.entries(publicEnvVars).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong> {value || "(空)"}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">APIエンドポイントテスト</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => checkApiEndpoint("/api/conversations")} disabled={isLoading}>
              GET /api/conversations
            </Button>
            <Button
              onClick={() => checkApiEndpoint("/api/conversation", "POST", { user: "user" })}
              disabled={isLoading}
            >
              POST /api/conversation
            </Button>
            <Button
              onClick={() => checkApiEndpoint("/api/conversation-messages", "GET", null, { conversation_id: "test" })}
              disabled={isLoading}
            >
              GET /api/conversation-messages
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">リクエスト詳細:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(requestDetails, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">レスポンス詳細:</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(apiStatus, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
