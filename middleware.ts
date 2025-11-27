export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/accounts/:path*",
    "/teachers/:path*",
    "/management/:path*",
    "/api/halaqas/:path*",
  ],
};

