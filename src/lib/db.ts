import { randomUUID } from "crypto";
import { supabaseAdmin } from "./supabase-admin";

export type Account = {
  id: string;
  display_name: string;
  created_at: string;
};

export type Passkey = {
  id: string;
  account_id: string;
  credential_id: string;
  public_key: string; // base64url
  counter: number;
  device_label: string;
  created_at: string;
  last_used_at: string | null;
};

export type PrivateNote = {
  id: string;
  account_id: string;
  title: string;
  body: string;
  created_at: string;
};

// 비공개 영역에 넣는 내용은 전부 만들어 넣은 예시이고, 실제 개인정보가 아니다.
// 계정마다 이 풀에서 몇 개를 무작위로 골라 넣기 때문에, 계정 두 개를 만들면
// 서로 다른 조합(그리고 서로 다른 표시 이름이 섞인 문구)이 들어가게 된다.
const NOTE_POOL: { title: string; body: (name: string) => string }[] = [
  {
    title: "2026 하반기 지원 후보 기업 메모",
    body: (name) =>
      `${name} 개인 메모 — 아직 공개 페이지에는 안 올린 지원 후보 목록.\n1순위: 다온데이터 - 데이터 엔지니어 포지션, 자소서 초안 70% 완성.\n2순위: 브릿지AI - MLOps 인턴, 코딩테스트 일정 확인 필요.\n3순위: 청람시스템즈 - 백엔드 신입, 최종 지원 여부 고민 중.\n(전부 만들어 넣은 예시 회사명이며 실제 지원 현황이 아님)`,
  },
  {
    title: "자기소개서 초안 — '실패 경험' 문항",
    body: (name) =>
      `${name}의 초안, 아직 다듬는 중.\n"1학년 때 참여한 학회 프로젝트에서 일정을 지나치게 낙관적으로 잡았다가 발표 전날 밤을 새운 적이 있다. 그 뒤로는 항상 일정의 30%를 여유로 남겨두는 습관이 생겼다..." (이어서 작성 예정, 예시 문장)`,
  },
  {
    title: "포트폴리오에 아직 안 올린 사이드 프로젝트",
    body: (name) =>
      `${name} 개인 백로그.\n- 개인 일정 관리 챗봇: 초기 프로토타입만 있음, 공개하기엔 코드가 지저분해서 정리 후 공개 예정.\n- 논문 요약 파이프라인: 스터디용으로만 쓰던 것, 아직 정리가 안 됨.`,
  },
  {
    title: "주간 회고",
    body: (name) =>
      `${name}의 이번 주 회고(예시 기록).\n잘한 점: 계획했던 만큼 진행함.\n아쉬운 점: 문서화를 미루다가 막판에 몰아서 함.\n다음 주 목표: 회고를 매일 짧게라도 남기기.`,
  },
  {
    title: "면접 후기 초안 — 모의면접 기록",
    body: (name) =>
      `${name} 개인 기록, 아직 다듬지 않음.\nQ. 가장 어려웠던 문제 해결 경험은?\nA(초안): "~~ 상황에서 ~~를 시도했고, 결과적으로 ~~" — 두괄식으로 다시 정리할 것.\n피드백: 결론을 먼저 말하는 연습이 더 필요함.`,
  },
  {
    title: "지원 체크리스트",
    body: (name) =>
      `${name}의 개인 체크리스트(예시).\n[ ] 포트폴리오 링크 최신화\n[x] 이력서 오탈자 검토\n[ ] 추천서 요청 이메일 발송\n[ ] 코딩테스트 연습 3회`,
  },
  {
    title: "아직 다듬는 프로젝트 아이디어",
    body: (name) =>
      `${name}의 구상 메모(공개 전).\n대규모 로그에서 이상 패턴을 실시간으로 잡아내는 작은 도구를 만들어보고 싶음. 아직 설계 단계라 공개 페이지에는 올리지 않음.`,
  },
  {
    title: "할 일 메모",
    body: (name) =>
      `${name}의 개인 메모(예시).\n스터디 팀 단체방 공지 갱신 필요. 다음 모임 전까지 발표 자료 초안 만들기.`,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function createAccount(displayName: string): Promise<string> {
  const db = supabaseAdmin();
  const id = randomUUID();
  const { error } = await db
    .from("accounts")
    .insert({ id, display_name: displayName });
  if (error) throw error;

  const picked = shuffle(NOTE_POOL).slice(0, 4);
  const notes = picked.map((n) => ({
    id: randomUUID(),
    account_id: id,
    title: n.title,
    body: n.body(displayName),
  }));
  const { error: noteError } = await db.from("private_notes").insert(notes);
  if (noteError) throw noteError;

  return id;
}

export async function getAccount(id: string): Promise<Account | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("accounts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Account | null;
}

export async function insertPasskey(input: {
  accountId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  label: string;
}): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("passkeys").insert({
    id: randomUUID(),
    account_id: input.accountId,
    credential_id: input.credentialId,
    public_key: input.publicKey,
    counter: input.counter,
    device_label: input.label,
  });
  if (error) throw error;
}

export async function findPasskeyByCredentialId(
  credentialId: string
): Promise<Passkey | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("passkeys")
    .select("*")
    .eq("credential_id", credentialId)
    .maybeSingle();
  if (error) throw error;
  return data as Passkey | null;
}

export async function listPasskeys(accountId: string): Promise<Passkey[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("passkeys")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Passkey[];
}

export async function listCredentialIdsForAccount(
  accountId: string
): Promise<string[]> {
  const keys = await listPasskeys(accountId);
  return keys.map((k) => k.credential_id);
}

export async function updatePasskeyCounter(
  credentialId: string,
  counter: number
): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from("passkeys")
    .update({ counter, last_used_at: new Date().toISOString() })
    .eq("credential_id", credentialId);
  if (error) throw error;
}

export async function deletePasskey(
  id: string,
  accountId: string
): Promise<number> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("passkeys")
    .delete()
    .eq("id", id)
    .eq("account_id", accountId)
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

export async function listPrivateNotes(
  accountId: string
): Promise<PrivateNote[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("private_notes")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PrivateNote[];
}

// challenge 재사용 방지: 검증에 성공적으로 쓰인 challenge를 기록해두고,
// 같은 challenge가 두 번째로 들어오면 DB unique 제약으로 걸러낸다.
export async function markChallengeUsed(challenge: string): Promise<boolean> {
  const db = supabaseAdmin();
  const { error } = await db.from("used_challenges").insert({ challenge });
  if (error) {
    if ((error as { code?: string }).code === "23505") return false; // 이미 쓴 challenge
    throw error;
  }
  return true;
}
