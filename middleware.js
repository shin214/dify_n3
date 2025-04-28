import { authMiddleware } from "@clerk/nextjs"

// 認証ミドルウェアをエクスポート
export default authMiddleware({
  // 認証なしでアクセス可能なパブリックルート
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/conversation",
    "/api/conversations",
    "/api/chat",
    "/api/conversation-messages",
    "/api/debug/test-dify-api",
    "/debug",
    "/debug/direct-api-test",
  ],

  // デバッグモードを有効化
  debug: true,
})

// ミドルウェアの適用範囲を設定
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
