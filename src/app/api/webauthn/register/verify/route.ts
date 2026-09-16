import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { createSession } from "@/lib/session";
import { readCeremony, clearCeremony } from "@/lib/ceremony";
import { origin, rpID } from "@/lib/webauthn-config";
import { insertPasskey } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | ({ label?: string } & RegistrationResponseJSON)
    | null;
  if (!body) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const ceremony = await readCeremony();
  if (!ceremony || ceremony.type !== "register") {
    return NextResponse.json(
      { error: "등록 요청이 만료되었거나 이미 사용되었습니다. 처음부터 다시 시도하세요." },
      { status: 400 }
    );
  }

  const { label, ...response } = body;

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: ceremony.challenge,
      expectedOrigin: origin(),
      expectedRPID: rpID(),
    });
  } catch {
    return NextResponse.json({ error: "패스키 검증에 실패했습니다." }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "패스키 검증에 실패했습니다." }, { status: 400 });
  }

  const { credential } = verification.registrationInfo;
  const publicKeyB64 = Buffer.from(credential.publicKey).toString("base64url");

  await insertPasskey({
    accountId: ceremony.accountId,
    credentialId: credential.id,
    publicKey: publicKeyB64,
    counter: credential.counter,
    label: label && label.trim() ? label.trim().slice(0, 40) : "패스키",
  });

  await clearCeremony();
  await createSession(ceremony.accountId);

  return NextResponse.json({ ok: true });
}
