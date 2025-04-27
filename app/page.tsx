import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Difyチャットアプリへようこそ</h1>
      <div className="flex flex-col items-center gap-4">
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          サインイン
        </Link>
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          アカウント作成
        </Link>
        <div className="mt-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
