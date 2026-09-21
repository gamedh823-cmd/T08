"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginWithPasskey, describeWebAuthnError } from "@/lib/webauthn-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    setBusy(true);
    try {
      await loginWithPasskey();
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/private");
    } catch (err) {
      setError(describeWebAuthnError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-semibold text-slate-900">
          비공개 영역 로그인
        </h1>
        <p className="mt-1 text-sm text-slate-500 break-keep">
          아이디도 비밀번호도 입력하지 않습니다. 이 기기에 등록된 패스키로
          바로 증명합니다.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={busy}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {busy ? "패스키 확인 중..." : "패스키로 로그인"}
        </button>

        <p className="mt-6 text-sm text-slate-500">
          계정이 없나요?{" "}
          <Link href="/register" className="font-medium text-indigo-600">
            새로 만들기
          </Link>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          <Link href="/">공개 소개 페이지로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
