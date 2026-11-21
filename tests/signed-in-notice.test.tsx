import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SignedInNotice } from "@/components/navigation/SignedInNotice";
import { useAuth } from "@/lib/auth/session";

vi.mock("@/lib/auth/session", () => ({ useAuth: vi.fn() }));

const mockedUseAuth = vi.mocked(useAuth);

describe("signed-in launch notice", () => {
  beforeEach(() => mockedUseAuth.mockReset());

  it("stays hidden for signed-out visitors", () => {
    mockedUseAuth.mockReturnValue({ status: "signedOut", session: null, failed: false });
    expect(renderToStaticMarkup(<SignedInNotice message="Live data on 30 November"/>)).toBe("");
  });

  it("appears at the top for signed-in users", () => {
    mockedUseAuth.mockReturnValue({ status: "signedIn", session: null, failed: false });
    const html = renderToStaticMarkup(<SignedInNotice message="LearnerKits goes fully live on 30 November. Some features are still in preview until then."/>);
    expect(html).toContain("signedInNotice");
    expect(html).toContain("LearnerKits goes fully live on 30 November. Some features are still in preview until then.");
  });
});
