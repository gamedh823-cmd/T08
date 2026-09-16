import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listPasskeys } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const keys = await listPasskeys(session.accountId);
  return NextResponse.json({
    passkeys: keys.map((k) => ({
      id: k.id,
      label: k.device_label,
      createdAt: k.created_at,
      lastUsedAt: k.last_used_at,
    })),
  });
}
