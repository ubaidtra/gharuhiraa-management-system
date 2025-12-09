import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/accounts/:path*",
    "/teachers/:path*",
    "/management/:path*",
    "/api/halaqas/:path*",
  ],
};

