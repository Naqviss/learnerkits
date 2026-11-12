// Minimal PostgREST access with the server key, shared by the classroom and admin APIs.
// Filters use PostgREST operators, e.g. { teacher_id: `eq.${id}`, order: "created_at.desc" }.
import type { Admin } from "./supabase";

export class DbError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === "string" && uuidPattern.test(value);
/** `in.(…)` filter for ids that were already validated or came from the database. */
export const inList = (ids: string[]) => `in.(${ids.filter(isUuid).join(",")})`;

async function call(admin: Admin, method: string, table: string, query: Record<string, string>, body?: unknown, prefer?: string) {
  const url = new URL(`/rest/v1/${table}`, admin.base);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const response = await fetch(url, {
    method,
    headers: { ...admin.headers, ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(prefer ? { Prefer: prefer } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({})) as { code?: string; message?: string };
    // A HEAD request has no body: a bare 404 from PostgREST means the table does not exist (PGRST205).
    throw new DbError(response.status, detail.code ?? (response.status === 404 ? "PGRST205" : ""), detail.message ?? `Supabase ${method} ${table} failed: ${response.status}`);
  }
  return response;
}

export async function selectRows<T>(admin: Admin, table: string, query: Record<string, string> = {}): Promise<T[]> {
  return await (await call(admin, "GET", table, { select: "*", ...query })).json() as T[];
}

export async function insertRow<T>(admin: Admin, table: string, row: Record<string, unknown>): Promise<T> {
  return (await (await call(admin, "POST", table, {}, row, "return=representation")).json() as T[])[0];
}

export async function upsertRow<T>(admin: Admin, table: string, conflict: string, row: Record<string, unknown>): Promise<T> {
  return (await (await call(admin, "POST", table, { on_conflict: conflict }, row, "resolution=merge-duplicates,return=representation")).json() as T[])[0];
}

export async function updateRows<T>(admin: Admin, table: string, query: Record<string, string>, patch: Record<string, unknown>): Promise<T[]> {
  return await (await call(admin, "PATCH", table, query, patch, "return=representation")).json() as T[];
}

/** Deletes matching rows and returns how many were removed. A filter is required. */
export async function deleteRows(admin: Admin, table: string, query: Record<string, string>): Promise<number> {
  if (!Object.keys(query).length) throw new DbError(400, "", "Refusing to delete without a filter.");
  return (await (await call(admin, "DELETE", table, query, undefined, "return=representation")).json() as unknown[]).length;
}

export async function countRows(admin: Admin, table: string, query: Record<string, string> = {}): Promise<number> {
  const response = await call(admin, "HEAD", table, { select: "*", ...query }, undefined, "count=exact");
  const total = Number(response.headers.get("content-range")?.split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}

export const isUniqueViolation = (error: unknown) => error instanceof DbError && (error.code === "23505" || error.status === 409);
