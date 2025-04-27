import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // 認証なしでアクセス可能なパブリックルート
  publicRoutes: ["/", "/api(.*)"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
