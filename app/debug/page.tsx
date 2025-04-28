"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [publicEnvVars, setPublicEnvVars] = useState<Record<string, string>>({})
  const [apiStatus, setApiStatus] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 公開環境変数を収集
    const vars: Record<string, string> = {}
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        vars[key] = process.env[key] || ""
      }
    })
    setPublicEnvVars(vars)
  }, [])

  const checkApiEndpoint = async (endpoint: string, method = "GET") => {
    setIsLoading(true)
    try {
      const response = await fetch(endpoint, { method })
      const status = response.status
      let data = null
      try {
        data = await response.json()
      } catch (e) {
        // JSONでない場合はテキストとして取得
        data = await response.text()
      }
      setApiStatus((prev) => ({
        ...prev,
        [endpoint]: { status, data },
      }))
    } catch (error: any) {
      setApiStatus((prev) => ({
        ...prev,
        [endpoint]: { status: "Error", error: error.message },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">デバッグページ</h1>

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
          <div>
            <Button onClick={() => checkApiEndpoint("/api/conversations")} disabled={isLoading} className="mr-2">
              GET /api/conversations
            </Button>
            <Button onClick={() => checkApiEndpoint("/api/conversation", "POST")} disabled={isLoading} className="mr-2">
              POST /api/conversation
            </Button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">結果:</h3>
            <pre className="whitespace-pre-wrap">{JSON.stringify(apiStatus, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
