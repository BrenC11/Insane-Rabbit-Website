import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "ir_admin_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_NAMESPACE = "insane-rabbit-admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function hashSessionSecret(secret: string) {
  return createHash("sha256")
    .update(`${SESSION_NAMESPACE}:${secret}`)
    .digest();
}

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function createAdminSessionValue() {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return "";
  }

  return hashSessionSecret(adminPassword).toString("hex");
}

export function isValidAdminSessionValue(value?: string | null) {
  const adminPassword = getAdminPassword();

  if (!adminPassword || !value) {
    return false;
  }

  const expected = hashSessionSecret(adminPassword);
  const actual = Buffer.from(value, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function isAdminAuthenticated(cookiesStore: {
  get(name: string): { value: string } | undefined;
}) {
  return isValidAdminSessionValue(
    cookiesStore.get(ADMIN_SESSION_COOKIE)?.value ?? null
  );
}

export function isAdminAuthenticatedOnServer() {
  return isAdminAuthenticated(cookies());
}

export function getAdminSessionCookieConfig() {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}
