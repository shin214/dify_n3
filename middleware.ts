import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // 認証なしでアクセス可能なパブリックルート
  publicRoutes: ["/", "/sign-in", "/sign-up"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
