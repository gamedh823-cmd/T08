-- 패스키(WebAuthn)로 잠근 비공개 영역용 스키마.
-- 서버는 항상 service role key로 접근하고(RLS를 켜지 않음), 대신
-- API 라우트가 세션의 account_id로만 조회/수정하도록 코드로 강제한다.

create extension if not exists pgcrypto;

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists passkeys (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null, -- base64url로 인코딩한 공개키. 개인키는 절대 서버에 오지 않는다.
  counter bigint not null default 0,
  device_label text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table if not exists private_notes (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- 로그인 challenge 재사용(재전송) 방지: 검증에 쓴 challenge를 여기 기록해 두고
-- 같은 challenge가 두 번째로 들어오면 unique 제약 위반으로 거절한다.
create table if not exists used_challenges (
  challenge text primary key,
  created_at timestamptz not null default now()
);

create index if not exists passkeys_account_id_idx on passkeys (account_id);
create index if not exists private_notes_account_id_idx on private_notes (account_id);
