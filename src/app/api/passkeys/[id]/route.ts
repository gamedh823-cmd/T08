import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deletePasskey, listPasskeys } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  // account_id가 세션 계정과 같은 행만 지운다 — 남의 패스키 id를 넣어도 지워지지 않는다.
  const deletedCount = await deletePasskey(id, session.accountId);
  if (deletedCount === 0) {
    return NextResponse.json({ error: "해당 패스키를 찾을 수 없습니다." }, { status: 404 });
  }

  const remaining = await listPasskeys(session.accountId);
  return NextResponse.json({ ok: true, remaining: remaining.length });
}
