function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되어 있지 않습니다.`);
  }
  return value;
}

export function rpID(): string {
  return required("RP_ID");
}

export function rpName(): string {
  return process.env.RP_NAME ?? "Secure Access";
}

export function origin(): string {
  return required("ORIGIN");
}
