import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { auth } from "@/utils/lib/auth" // your auth.ts setup

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Proper session lookup
	const session = await auth.api.getSession({ headers: request.headers })

	// Not authenticated → redirect to signin
	if (!session && pathname !== "/signin" && pathname !== "/signup") {
		return NextResponse.redirect(new URL("/signin", request.url))
	}

	// Authenticated → prevent access to signin/signup
	if (session && (pathname === "/signin" || pathname === "/signup")) {
		return NextResponse.redirect(new URL("/dashboard", request.url))
	}

	// Redirect root to dashboard if logged in
	if (pathname === "/" && session) {
		return NextResponse.redirect(new URL("/dashboard", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
