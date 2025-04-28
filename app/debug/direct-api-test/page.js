"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DirectApiTestPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiUrl, setApiUrl] = useState("https://api.dify.ai/v1")
  const [appId, setAppId] = useState(process.env.NEXT_PUBLIC_APP_ID || "")
  const [appKey, setAppKey] = useState("")

  const testDirectApi = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug/test-dify-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiUrl,
          appId,
          appKey,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dify API直接テスト</h1>

      <div className="mb-4">
        <label className="block mb-2">API URL</label>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">App ID</label>
        <input
          type="text"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">App Key</label>
        <input
          type="password"
          value={appKey}
          onChange={(e) => setAppKey(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="App Keyを入力（必要な場合のみ）"
        />
      </div>

      <Button onClick={testDirectApi} disabled={isLoading}>
        {isLoading ? "テスト中..." : "Dify APIを直接テスト"}
      </Button>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">結果:</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
