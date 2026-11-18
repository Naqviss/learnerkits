import { describe, expect, it } from "vitest";
import { workspaceModeForPath, workspaceRedirect } from "@/lib/auth/workspace";

describe("workspace mode routing", () => {
  it("chooses the role from a direct workspace link when no preference exists", () => {
    expect(workspaceModeForPath("/en/teacher-kit/dashboard")).toBe("teacher");
    expect(workspaceModeForPath("/en/classroom")).toBe("student");
    expect(workspaceModeForPath("/es/progress")).toBe("student");
    expect(workspaceModeForPath("/en/teacher-kit")).toBeNull();
  });

  it("keeps each account workspace aligned with the selected role", () => {
    expect(workspaceRedirect("/en/teacher-kit/dashboard", "student")).toBe("/en/classroom");
    expect(workspaceRedirect("/en/classroom", "teacher")).toBe("/en/teacher-kit/dashboard");
    expect(workspaceRedirect("/es/progress", "teacher")).toBe("/en/teacher-kit/dashboard#insights");
    expect(workspaceRedirect("/en/classroom", "student")).toBeNull();
    expect(workspaceRedirect("/en/teacher-kit/dashboard", "teacher")).toBeNull();
  });

  it("leaves shared routes accessible in either mode", () => {
    for (const mode of ["student", "teacher"] as const) {
      expect(workspaceRedirect("/en/simulations/moon-landing", mode)).toBeNull();
      expect(workspaceRedirect("/es/settings", mode)).toBeNull();
    }
  });
});
