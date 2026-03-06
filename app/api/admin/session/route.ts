import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminSessionCookieConfig,
  isAdminPasswordConfigured
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD before using the admin area." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { password?: string };
  const submittedPassword = body.password?.trim() ?? "";
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim() ?? "";

  if (!submittedPassword || submittedPassword !== configuredPassword) {
    return NextResponse.json(
      { error: "That password did not match the configured admin password." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionValue(),
    getAdminSessionCookieConfig()
  );

  return response;
}
