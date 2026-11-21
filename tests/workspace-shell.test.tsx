import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { WorkspaceShell } from "@/components/navigation/WorkspaceShell";
import { useAuth } from "@/lib/auth/session";
import en from "@/messages/en.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/classroom",
  useRouter: () => ({}),
}));
vi.mock("@/lib/auth/session", () => ({ useAuth: vi.fn() }));

function render() {
  return renderToStaticMarkup(
    <WorkspaceShell locale="en" m={en} guestNav={<nav>Public navigation</nav>} guestFooter={<footer>Public footer</footer>}>
      <main>Classroom content</main>
    </WorkspaceShell>,
  );
}

describe("workspace layout", () => {
  it("keeps the public navigation and footer for guests", () => {
    vi.mocked(useAuth).mockReturnValue({ status: "signedOut", session: null, failed: false });
    const html = render();
    expect(html).toContain("<nav>Public navigation</nav>");
    expect(html).toContain("<footer>Public footer</footer>");
    expect(html).toContain("<main>Classroom content</main>");
  });

  it("renders the public footer while the session is loading, so the static HTML crawlers read includes it", () => {
    vi.mocked(useAuth).mockReturnValue({ status: "loading", session: null, failed: false });
    const html = render();
    expect(html).toContain("<nav>Public navigation</nav>");
    expect(html).toContain("<footer>Public footer</footer>");
  });

  it("uses the workspace sidebar and omits public chrome for signed-in users", () => {
    const session = { user: { id: "student-1" } } as Session;
    vi.mocked(useAuth).mockReturnValue({ status: "signedIn", session, failed: false });
    const html = render();
    expect(html).toContain('aria-controls="workspace-sidebar"');
    expect(html).toContain(en.auth.launchNotice);
    expect(html).not.toContain("Public navigation");
    expect(html).not.toContain("<footer>");
  });
});
