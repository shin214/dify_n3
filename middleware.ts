import { authMiddleware } from "@clerk/nextjs"

// すべてのルートを公開ルートとして設定（デバッグ用）
export default authMiddleware({
  publicRoutes: ["/(.*)", "/api(.*)"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
