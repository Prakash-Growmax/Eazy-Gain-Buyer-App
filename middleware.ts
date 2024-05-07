import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const LangcookieName = "i18next";

export const locales = ["ta", "en"];

export function middleware(request: NextRequest) {
  
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login";

  const token =
    request.cookies.get(
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token"
    )?.value || "";

  const response = NextResponse.next();
  
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (!request.cookies.get(LangcookieName)) {
    response.cookies.set(LangcookieName, locales[0], {
      maxAge: 365 * 24 * 60 * 60,
    });
    return response;
  }
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|assets/*|manifest/*|.well-known/*).*)",
    },
  ],
};
