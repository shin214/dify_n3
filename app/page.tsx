import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const user = await currentUser()

  // 認証済みの場合はチャットページにリダイレクト
  if (user) {
    redirect("/chat")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Difyチャットアプリへようこそ</h1>
      <p className="text-xl mb-8 max-w-md">AIを活用したチャットアプリケーションで、新しい会話体験を始めましょう。</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">サインイン</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">アカウント作成</Link>
        </Button>
      </div>
    </div>
  )
}
