export type WorkspaceMode = "student" | "teacher";

export function workspaceHome(mode: WorkspaceMode) {
  return mode === "teacher" ? "/en/teacher-kit/dashboard" : "/en/classroom";
}

export function workspaceModeForPath(pathname: string): WorkspaceMode | null {
  const [, , section, page] = pathname.split("/");
  if (section === "teacher-kit" && page === "dashboard") return "teacher";
  if (section === "classroom" || section === "progress") return "student";
  return null;
}

export function workspaceRedirect(pathname: string, mode: WorkspaceMode) {
  const routeMode = workspaceModeForPath(pathname);
  if (!routeMode || routeMode === mode) return null;
  if (mode === "teacher" && pathname.split("/")[2] === "progress") return `${workspaceHome(mode)}#insights`;
  return workspaceHome(mode);
}
