import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // 認証なしでアクセス可能なパブリックルート
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api(.*)"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
