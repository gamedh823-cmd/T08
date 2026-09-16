import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 2; // 2시간

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 설정되어 있지 않습니다.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  accountId: string;
};

// middleware(엣지 런타임)에서도 쓸 수 있도록 cookies()에 의존하지 않는 순수 함수로 분리
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.accountId !== "string") return null;
    return { accountId: payload.accountId };
  } catch {
    return null;
  }
}

export async function issueSessionToken(accountId: string): Promise<string> {
  return new SignJWT({ accountId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_TTL = SESSION_TTL_SECONDS;

// 아래 세 함수는 Route Handler / Server Component 등 next/headers를 쓸 수 있는 곳 전용
export async function createSession(accountId: string) {
  const token = await issueSessionToken(accountId);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
