import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import en from "@/messages/en.json";

// authEnabled is read when the module loads, so each case imports a fresh copy.
async function render() {
  vi.resetModules();
  const { AuthButton } = await import("@/components/navigation/AuthButton");
  return renderToStaticMarkup(<AuthButton labels={en.auth}/>);
}

describe("Google sign-in button", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is hidden until Supabase is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(await render()).toBe("");
  });

  it("renders a stable loading state until the browser session is checked", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    const html = await render();
    expect(html).toContain('aria-label="Checking sign-in…"');
    expect(html).toContain("authSpinner");
    expect(html).not.toContain(">Sign in</span>");
  });
});
