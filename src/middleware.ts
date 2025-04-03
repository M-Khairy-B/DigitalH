import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const isAuthenticated = req.cookies.get("next-auth.session-token");

    if (
      isAuthenticated &&
      (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/auth/login")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/login",
    },
  }
);
export const config = {
  matcher: ["/dashboard", "/"],
};
