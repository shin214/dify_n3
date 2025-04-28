import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Difyチャットアプリへようこそ</h1>
      <div className="flex flex-col items-center gap-4">
        <Link href="/sign-in" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          サインイン
        </Link>
        <Link href="/sign-up" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          アカウント作成
        </Link>
        <Link href="/chat" className="text-blue-500 hover:underline mt-4">
          チャットページに直接アクセス
        </Link>
      </div>
    </div>
  )
}
