import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getSession } from "@/lib/session";
import { setCeremony } from "@/lib/ceremony";
import { rpID, rpName } from "@/lib/webauthn-config";
import { createAccount, getAccount, listCredentialIdsForAccount } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const session = await getSession();

  let accountId: string;
  let userName: string;
  let excludeCredentials: { id: string }[] = [];

  if (session) {
    // 이미 로그인한 상태 → 같은 계정에 패스키를 하나 더 등록하는 흐름
    const account = await getAccount(session.accountId);
    if (!account) {
      return NextResponse.json({ error: "계정을 찾을 수 없습니다." }, { status: 401 });
    }
    accountId = account.id;
    userName = account.display_name;
    excludeCredentials = (await listCredentialIdsForAccount(accountId)).map((id) => ({ id }));
  } else {
    // 로그인 전 → 새 계정을 만들면서 첫 패스키를 등록하는 흐름
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (!displayName || displayName.length > 40) {
      return NextResponse.json({ error: "표시 이름을 1~40자로 입력하세요." }, { status: 400 });
    }
    accountId = await createAccount(displayName);
    userName = displayName;
  }

  const options = await generateRegistrationOptions({
    rpName: rpName(),
    rpID: rpID(),
    userName,
    userID: new TextEncoder().encode(accountId),
    userDisplayName: userName,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  });

  await setCeremony({ type: "register", challenge: options.challenge, accountId });

  return NextResponse.json(options);
}
