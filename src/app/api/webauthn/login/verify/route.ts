import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { createSession } from "@/lib/session";
import { readCeremony, clearCeremony } from "@/lib/ceremony";
import { origin, rpID } from "@/lib/webauthn-config";
import { findPasskeyByCredentialId, markChallengeUsed, updatePasskeyCounter } from "@/lib/db";

export async function POST(req: NextRequest) {
  const response = (await req.json().catch(() => null)) as AuthenticationResponseJSON | null;
  if (!response || !response.id) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const ceremony = await readCeremony();
  if (!ceremony || ceremony.type !== "login") {
    return NextResponse.json(
      { error: "로그인 요청이 만료되었거나 이미 사용되었습니다. 다시 시도하세요." },
      { status: 400 }
    );
  }

  // 등록되지 않았거나(=처음 보는 패스키) 이미 삭제된 패스키는 여기서 걸러진다.
  const passkey = await findPasskeyByCredentialId(response.id);
  if (!passkey) {
    return NextResponse.json({ error: "등록되지 않았거나 삭제된 패스키입니다." }, { status: 401 });
  }

  // 같은 challenge로 두 번째 로그인 시도 → 거절 (재전송/재사용 공격 방지)
  const stillFresh = await markChallengeUsed(ceremony.challenge);
  if (!stillFresh) {
    return NextResponse.json({ error: "이미 사용된 로그인 요청입니다." }, { status: 400 });
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: ceremony.challenge,
      expectedOrigin: origin(),
      expectedRPID: rpID(),
      credential: {
        id: passkey.credential_id,
        publicKey: new Uint8Array(Buffer.from(passkey.public_key, "base64url")),
        counter: passkey.counter,
      },
    });
  } catch {
    return NextResponse.json({ error: "패스키 검증에 실패했습니다." }, { status: 401 });
  }

  if (!verification.verified) {
    return NextResponse.json({ error: "패스키 검증에 실패했습니다." }, { status: 401 });
  }

  await updatePasskeyCounter(passkey.credential_id, verification.authenticationInfo.newCounter);
  await clearCeremony();
  await createSession(passkey.account_id);

  return NextResponse.json({ ok: true });
}
