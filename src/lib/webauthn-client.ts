import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

async function postJSON<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? `요청이 실패했습니다 (${res.status})`);
  }
  return data as T;
}

export async function registerPasskey(input: {
  displayName?: string;
  label: string;
}): Promise<void> {
  const options = await postJSON<PublicKeyCredentialCreationOptionsJSON>(
    "/api/webauthn/register/options",
    input.displayName ? { displayName: input.displayName } : {}
  );
  const attestation = await startRegistration({ optionsJSON: options });
  await postJSON("/api/webauthn/register/verify", {
    ...attestation,
    label: input.label,
  });
}

export async function loginWithPasskey(): Promise<void> {
  const options = await postJSON<PublicKeyCredentialRequestOptionsJSON>(
    "/api/webauthn/login/options"
  );
  const assertion = await startAuthentication({ optionsJSON: options });
  await postJSON("/api/webauthn/login/verify", assertion);
}

export function describeWebAuthnError(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "NotAllowedError") {
      return "취소되었거나 시간이 초과되었습니다. 다시 시도해 주세요.";
    }
    if (err.name === "InvalidStateError") {
      return "이미 이 기기에 등록된 패스키입니다.";
    }
    return err.message || "패스키 작업 중 오류가 발생했습니다.";
  }
  return "패스키 작업 중 오류가 발생했습니다.";
}
