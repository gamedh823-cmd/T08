import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAccount, listPrivateNotes } from "@/lib/db";
import LogoutButton from "@/components/LogoutButton";

export default async function PrivatePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [account, notes] = await Promise.all([
    getAccount(session.accountId),
    listPrivateNotes(session.accountId),
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
              비공개 영역
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              {account?.display_name ?? "알 수 없는 계정"}
            </h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/settings/passkeys" className="text-slate-600 hover:text-slate-900">
              패스키 관리
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <p className="mb-6 text-sm text-slate-500">
          패스키로 본인임을 증명한 사람만 이 화면을 볼 수 있습니다. 아래 내용은
          전부 만들어 넣은 예시이며 실제 개인정보가 아닙니다.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-sm font-semibold text-slate-900">
                {note.title}
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {note.body}
              </p>
            </article>
          ))}
        </div>
        {notes.length === 0 && (
          <p className="text-sm text-slate-400">아직 저장된 내용이 없습니다.</p>
        )}
      </main>
    </div>
  );
}
