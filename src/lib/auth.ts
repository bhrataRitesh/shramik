import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "shramik-super-secret-key-at-least-32-chars-long";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = "shramik_session";

export interface SessionPayload {
  userId: string;
  phone: string;
  role: "hirer" | "labourer" | "admin";
  name?: string;
  [key: string]: unknown;
}

/**
 * Signs a cryptographically secure JWT session token valid for 30 days
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the payload
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies session payload from NextRequest or cookies()
 */
export async function getSession(
  req?: NextRequest
): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return await verifySessionToken(token);
}
