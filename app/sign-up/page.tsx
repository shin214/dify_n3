import { SignUp } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

export default async function SignUpPage() {
  const user = await currentUser()

  // すでに認証済みの場合はチャットページにリダイレクト
  if (user) {
    redirect("/chat")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-center">Difyアプリに登録</h1>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-black hover:bg-gray-800 text-sm normal-case",
            },
          }}
          redirectUrl="/chat"
          routing="path"
        />
      </div>
    </div>
  )
}
