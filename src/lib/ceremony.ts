import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// 등록/로그인 "의식(ceremony)" 진행 중에만 쓰는 1회용 challenge 저장소.
// 서버가 방금 발급한 challenge를 브라우저가 응답할 때까지 짧게(2분) 들고 있는다.
const CEREMONY_COOKIE = "wa_ceremony";
const CEREMONY_TTL_SECONDS = 60 * 2;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 설정되어 있지 않습니다.");
  }
  return new TextEncoder().encode(secret);
}

type RegisterCeremony = {
  type: "register";
  challenge: string;
  accountId: string;
};

type LoginCeremony = {
  type: "login";
  challenge: string;
};

export type Ceremony = RegisterCeremony | LoginCeremony;

export async function setCeremony(payload: Ceremony) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CEREMONY_TTL_SECONDS}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(CEREMONY_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CEREMONY_TTL_SECONDS,
  });
}

export async function readCeremony(): Promise<Ceremony | null> {
  const store = await cookies();
  const token = store.get(CEREMONY_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      payload.type === "register" &&
      typeof payload.challenge === "string" &&
      typeof payload.accountId === "string"
    ) {
      return {
        type: "register",
        challenge: payload.challenge,
        accountId: payload.accountId,
      };
    }
    if (payload.type === "login" && typeof payload.challenge === "string") {
      return { type: "login", challenge: payload.challenge };
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearCeremony() {
  const store = await cookies();
  store.delete(CEREMONY_COOKIE);
}
