"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerPasskey, describeWebAuthnError } from "@/lib/webauthn-client";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setError("표시 이름을 입력하세요.");
      return;
    }

    setBusy(true);
    try {
      await registerPasskey({
        displayName: trimmedName,
        label: label.trim() || "첫 번째 패스키",
      });
      router.push("/private");
    } catch (err) {
      setError(describeWebAuthnError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          새 계정 만들기
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          비밀번호는 만들지 않습니다. 이 기기가 만든 패스키 하나로 계정을
          엽니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-slate-700"
            >
              표시 이름
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={40}
              placeholder="예: jiwon-test-a"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={busy}
            />
          </div>

          <div>
            <label
              htmlFor="label"
              className="block text-sm font-medium text-slate-700"
            >
              이 패스키의 이름 (선택)
            </label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={40}
              placeholder="예: 노트북 Windows Hello"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              disabled={busy}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {busy ? "기기에서 패스키 만드는 중..." : "패스키로 계정 만들기"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-medium text-indigo-600">
            패스키로 로그인
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          <Link href="/">공개 소개 페이지로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
