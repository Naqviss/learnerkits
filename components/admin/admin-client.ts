export async function adminCall<T>(token: string, action: string, payload: Record<string, unknown> = {}): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const response = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ action, ...payload }) });
    const data = await response.json().catch(() => ({})) as T & { error?: string };
    return response.ok ? { ok: true, data } : { ok: false, status: response.status, error: data.error || "The request failed." };
  } catch { return { ok: false, status: 0, error: "Could not reach the server." }; }
}

export function formatPaddleAmount(minorAmount: number, currency: string) {
  const digits = new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: digits }).format(minorAmount / (10 ** digits));
}
