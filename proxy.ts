// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = !!session?.user;
  const isEmailVerified = session?.user?.emailVerified === true;

  console.log(
    "PROXY HIT:",
    pathname,
    "Logged in:",
    isLoggedIn,
    "Email verified:",
    isEmailVerified
  );

  // 🔒 Dashboard sans être connecté → login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Dashboard connecté mais email non vérifié → verify-email
  if (pathname.startsWith("/dashboard") && isLoggedIn && !isEmailVerified) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  // 🚫 Login/register quand déjà connecté ET email vérifié
  if (
    (pathname === "/login" || pathname === "/register") &&
    isLoggedIn &&
    isEmailVerified
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🏠 Racine
  if (pathname === "/") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!isEmailVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
