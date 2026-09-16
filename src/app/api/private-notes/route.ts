import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listPrivateNotes } from "@/lib/db";

export async function GET() {
  // middleware가 이미 세션을 검사하지만, API 하나만 떼어 직접 호출되는 경우를 대비해 한 번 더 확인한다.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 항상 세션에 담긴 계정 id로만 조회한다 — 요청 어디에도 "어느 계정 것을 보여줘" 파라미터가 없다.
  const notes = await listPrivateNotes(session.accountId);
  return NextResponse.json({ notes });
}
