import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <header className="w-full max-w-3xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Difyチャット</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <div className="w-full max-w-3xl p-4 border rounded-lg">
        <p className="text-center mb-4">チャットが正常に表示されています</p>
        <div className="flex justify-center">
          <Link href="/" className="text-blue-500 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
