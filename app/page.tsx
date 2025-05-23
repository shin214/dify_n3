"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/chat")
    }
  }, [isLoaded, userId, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Difyチャットアプリへようこそ</h1>
      <div className="flex flex-col items-center gap-4">
        <SignInButton mode="modal" afterSignInUrl="/chat">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">サインイン</button>
        </SignInButton>
        <SignUpButton mode="modal" afterSignUpUrl="/chat">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">アカウント作成</button>
        </SignUpButton>
      </div>
    </div>
  )
}
