import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // すべてのルートを公開ルートとして設定（初期テスト用）
  publicRoutes: ["/(.*)", "/api(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
