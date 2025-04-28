import { authMiddleware } from "@clerk/nextjs"

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
    "/debug",
  ],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
