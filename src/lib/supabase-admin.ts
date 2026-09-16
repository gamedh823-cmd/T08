import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// service role key는 서버(Route Handler)에서만 쓰고, 클라이언트로는 절대 내려보내지 않는다.
let cached: SupabaseClient<Database> | null = null;

export function supabaseAdmin(): SupabaseClient<Database> {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다."
    );
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}
