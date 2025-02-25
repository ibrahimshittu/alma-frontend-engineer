import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function isTokenValid(
  req: NextRequest,
  baseUrl: string
): Promise<boolean> {
  const verifyUrl = `${baseUrl}/api/login`;
  const response = await fetch(verifyUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.headers.get("cookie")?.split("=")[1]}`,
    },
  });

  return response.ok;
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origin;
  const token = req.cookies.get("token")?.value;

  if (pathname === "/admin/login") {
    if (token && (await isTokenValid(req, baseUrl))) {
      const leadsUrl = req.nextUrl.clone();
      leadsUrl.pathname = "/admin/leads";
      return NextResponse.redirect(leadsUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!token || !(await isTokenValid(req, baseUrl))) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
