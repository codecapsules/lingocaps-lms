// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔐 Vérifie la session côté serveur
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = !!session?.user;
  console.log("PROXY HIT:", pathname, "Logged in:", isLoggedIn);

  // 🔒 Accès dashboard sans être connecté → login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Accès login/register quand déjà connecté → dashboard
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🏠 Accès racine → dashboard si connecté, login sinon
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/dashboard" : "/login", request.url)
    );
  }

  // ✅ Sinon, continue normalement
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
