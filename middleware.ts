import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const STAFF_ROLES = new Set(["ADMIN", "SEO_MANAGER", "SOCIAL_MEDIA_MANAGER", "DEVELOPER"]);

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && !STAFF_ROLES.has(token?.role as string)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
