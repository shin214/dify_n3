import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // 認証なしでアクセス可能なパブリックルート
  publicRoutes: ["/", "/api(.*)"],

  // 認証が必要なルート
  ignoredRoutes: ["/_next", "/favicon.ico"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
