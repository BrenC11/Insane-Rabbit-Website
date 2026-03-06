import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieConfig
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/admin/login", url), 303);

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieConfig(),
    maxAge: 0
  });

  return response;
}
