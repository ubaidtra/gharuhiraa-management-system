import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: { authorized: ({ token }) => !!token },
});

export const config = {
  matcher: [
    "/accounts/:path*",
    "/teachers/:path*",
    "/management/:path*",
    "/api/students/:path*",
    "/api/teachers/:path*",
    "/api/halaqas/:path*",
    "/api/transactions/:path*",
    "/api/learning-records/:path*",
    "/api/reports/:path*",
    "/api/statistics/:path*",
    "/api/financial-reports/:path*",
    "/api/users/:path*",
    "/api/upload/:path*",
    "/api/change-password",
  ],
};
