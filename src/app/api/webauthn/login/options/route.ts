import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { setCeremony } from "@/lib/ceremony";
import { rpID } from "@/lib/webauthn-config";

export async function POST() {
  // allowCredentials를 비워두면 브라우저가 "어느 계정인지" 먼저 묻지 않고,
  // 이 기기에 저장된 패스키 중 이 사이트용인 것을 직접 찾아 보여준다(디스커버러블 자격 증명).
  const options = await generateAuthenticationOptions({
    rpID: rpID(),
    userVerification: "preferred",
  });

  await setCeremony({ type: "login", challenge: options.challenge });

  return NextResponse.json(options);
}
