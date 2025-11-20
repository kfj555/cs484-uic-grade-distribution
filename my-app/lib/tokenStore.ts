type TokenRecord = {
  token: string;
  expiresAt: number; // epoch ms
};

const store = new Map<string, TokenRecord>();

export function setToken(email: string, token: string, ttlMs: number) {
  const key = email.toLowerCase();
  store.set(key, { token, expiresAt: Date.now() + ttlMs });
}

export function getToken(email: string): TokenRecord | undefined {
  const key = email.toLowerCase();
  const rec = store.get(key);
  if (!rec) return undefined;
  if (Date.now() > rec.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return rec;
}

export function deleteToken(email: string) {
  const key = email.toLowerCase();
  store.delete(key);
}
