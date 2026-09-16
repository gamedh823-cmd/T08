"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { registerPasskey, describeWebAuthnError } from "@/lib/webauthn-client";
import LogoutButton from "@/components/LogoutButton";

type PasskeyItem = {
  id: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export default function PasskeySettingsPage() {
  const [passkeys, setPasskeys] = useState<PasskeyItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [addLabel, setAddLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/passkeys");
    if (!res.ok) {
      setError("패스키 목록을 불러오지 못했습니다. 다시 로그인해 주세요.");
      return;
    }
    const data = await res.json();
    setPasskeys(data.passkeys);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    setError(null);
    setNotice(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/passkeys/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "삭제에 실패했습니다.");
      await load();
      if (data.remaining === 0) {
        setNotice(
          "이 계정에는 이제 등록된 패스키가 없습니다. 다음부터는 이 계정으로 로그인할 수 없습니다."
        );
      } else {
        setNotice(`패스키를 지웠습니다. 남은 패스키 ${data.remaining}개.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setAdding(true);
    try {
      await registerPasskey({ label: addLabel.trim() || "새 패스키" });
      setAddLabel("");
      await load();
      setNotice("새 패스키를 등록했습니다.");
    } catch (err) {
      setError(describeWebAuthnError(err));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
              설정
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              패스키 관리
            </h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/private" className="text-slate-600 hover:text-slate-900">
              비공개 영역
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {notice}
          </p>
        )}

        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            등록된 패스키
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            비밀번호는 없습니다. 마지막 하나를 지우면 이 계정에는 더 이상
            들어갈 방법이 남지 않습니다.
          </p>
          <ul className="mt-4 space-y-3">
            {(passkeys ?? []).map((pk) => (
              <li
                key={pk.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {pk.label}
                  </p>
                  <p className="text-xs text-slate-400">
                    등록일 {new Date(pk.createdAt).toLocaleString("ko-KR")}
                    {pk.lastUsedAt &&
                      ` · 마지막 사용 ${new Date(pk.lastUsedAt).toLocaleString("ko-KR")}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(pk.id)}
                  disabled={busyId === pk.id}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                >
                  {busyId === pk.id ? "삭제 중..." : "삭제"}
                </button>
              </li>
            ))}
            {passkeys && passkeys.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
                등록된 패스키가 없습니다.
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            새 패스키 추가
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            기기를 잃어버렸을 때를 대비해, 다른 기기나 다른 인증 수단으로
            하나 더 등록해 두세요.
          </p>
          <form onSubmit={handleAdd} className="mt-3 flex gap-2">
            <input
              type="text"
              value={addLabel}
              onChange={(e) => setAddLabel(e.target.value)}
              placeholder="예: 휴대폰 지문"
              maxLength={40}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={adding}
            />
            <button
              type="submit"
              disabled={adding}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {adding ? "등록 중..." : "추가"}
            </button>
          </form>
        </section>

        <p className="text-center text-xs text-slate-400">
          <Link href="/">공개 소개 페이지로 돌아가기</Link>
        </p>
      </main>
    </div>
  );
}
