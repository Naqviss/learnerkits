"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/session";
import { workspaceHome, workspaceModeForPath, workspaceRedirect, type WorkspaceMode } from "@/lib/auth/workspace";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { SearchBar } from "./SearchBar";
import { SignedInNotice } from "./SignedInNotice";
import { ThemeToggle } from "./ThemeToggle";
import { WorkspaceProfile } from "./WorkspaceProfile";
import styles from "./workspace.module.css";

const teacherHome = workspaceHome("teacher");
const subscribeToHash = (notify: () => void) => {
  window.addEventListener("hashchange", notify);
  return () => window.removeEventListener("hashchange", notify);
};

export function WorkspaceShell({ locale, m, guestNav, guestFooter, children }: {
  locale: string;
  m: Pick<Messages, "auth" | "common" | "navigation" | "search" | "settings">;
  guestNav: ReactNode;
  guestFooter: ReactNode;
  children: ReactNode;
}) {
  const { status, session } = useAuth();
  const user = status === "signedIn" ? session?.user : undefined;
  const userId = user?.id;
  const pathname = usePathname().replace(/\/$/, "");
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const router = useRouter();
  const [preference, setPreference] = useState<{ userId: string; mode: WorkspaceMode }>();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const mode = preference && preference.userId === userId ? preference.mode : undefined;

  useEffect(() => {
    if (!userId) {
      setPreference(undefined);
      setOpen(false);
      return;
    }
    if (mode) return;
    let stored: string | null = null;
    try { stored = localStorage.getItem(`learnerkits-workspace:${userId}`); } catch { /* optional preference */ }
    const initialMode = stored === "teacher" || stored === "student" ? stored : workspaceModeForPath(pathname) ?? "student";
    setPreference({ userId, mode: initialMode });
    if (initialMode !== stored) {
      try { localStorage.setItem(`learnerkits-workspace:${userId}`, initialMode); } catch { /* optional preference */ }
    }
  }, [userId, mode, pathname]);

  const wrongWorkspace = mode ? workspaceRedirect(pathname, mode) : null;
  useEffect(() => {
    if (!mode) return;
    if (wrongWorkspace) router.replace(wrongWorkspace);
    else if (pathname === `/${locale}` && !window.location.search && !window.location.hash) {
      router.replace(mode === "student" && locale !== "en" ? `/${locale}/progress` : workspaceHome(mode));
    }
  }, [locale, mode, pathname, router, wrongWorkspace]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const desktop = window.matchMedia("(min-width: 1081px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    desktop.addEventListener("change", onResize);
    window.addEventListener("keydown", escape);
    return () => {
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  function closeDrawer() {
    setOpen(false);
    window.requestAnimationFrame(() => toggle.current?.focus());
  }

  function changeMode(next: WorkspaceMode) {
    if (!userId || next === mode) return;
    setPreference({ userId, mode: next });
    try { localStorage.setItem(`learnerkits-workspace:${userId}`, next); } catch { /* optional preference */ }
    if (open) closeDrawer();
    router.replace(next === "student" && locale !== "en" ? `/${locale}/progress` : workspaceHome(next));
  }

  const workspaceLinks = mode === "teacher"
    ? [["Overview", teacherHome], ["Classes & students", `${teacherHome}#classes`], ["Lessons", `${teacherHome}#lessons`], ["Assignments", `${teacherHome}#assignments`], ["Submissions", `${teacherHome}#submissions`], ["Class insights", `${teacherHome}#insights`]]
    : [["My classroom", workspaceHome("student")], [m.navigation.progress, `/${locale}/progress`]];
  const resources = [[m.navigation.simulations, `/${locale}/simulations`], ...(mode === "teacher"
    ? [["Teaching resources", "/en/teacher-kit"]]
    : [["Exam preparation", "/en/exam-prep"], ["Mock exams", "/en/mock-exams"]])];

  function navigationLink([label, href]: string[]) {
    const teacherSection = href.startsWith(teacherHome);
    const active = teacherSection ? `${pathname}${hash}` === href : pathname === href || pathname.startsWith(`${href}/`);
    const onClick = open ? closeDrawer : undefined;
    return teacherSection
      ? <a key={href} href={href} aria-current={active ? "page" : undefined} onClick={onClick}>{label}</a>
      : <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={onClick}>{label}</Link>;
  }

  return <div className={user ? styles.shell : undefined} data-workspace={user ? mode ?? "loading" : undefined}>
    {!user && guestNav}
    {user && <div className={styles.sidebarArea}>
      <div className={styles.mobileBar} inert={open}>
        <button type="button" ref={toggle} className={styles.drawerToggle} aria-expanded={open} aria-controls="workspace-sidebar" onClick={() => setOpen(true)}>
          <span className={styles.menuIcon} aria-hidden="true" /> Menu
        </button>
        <img src="/learnerkits-mark.svg" width="30" height="30" alt="LearnerKits" />
      </div>
      {open && <div className={styles.scrim} aria-hidden="true" onClick={closeDrawer} />}
      <aside id="workspace-sidebar" className={styles.sidebar} data-open={open} aria-label="Workspace navigation" role={open ? "dialog" : undefined} aria-modal={open || undefined}>
        <div className={styles.brand}>
          <img className="brandLogo" src="/learnerkits-logo.svg" width="178" height="38" alt="LearnerKits" />
          <button className={styles.drawerClose} type="button" ref={closeButton} onClick={closeDrawer} aria-label="Close workspace menu">×</button>
        </div>
        {mode && <>
          <WorkspaceProfile key={user.id} user={user} mode={mode} setMode={changeMode} locale={locale} signOutLabel={m.auth.signOut} />
          <SearchBar locale={locale} search={m.search} id="workspace-search" />
          <nav className={styles.navigation} aria-label={mode === "teacher" ? "Teacher navigation" : "Student navigation"}>
            <div className={styles.linkGroup}>
              <span className={styles.groupLabel}>{mode === "teacher" ? "Teaching" : "Learning"}</span>
              <div className={styles.links}>{workspaceLinks.map(navigationLink)}</div>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.groupLabel}>Resources</span>
              <div className={styles.links}>{resources.map(navigationLink)}</div>
            </div>
          </nav>
        </>}
        <div className={styles.sidebarFooter}>
          <div className={styles.preferences}>
            <Link href={`/${locale}/settings`} onClick={open ? closeDrawer : undefined}>{m.navigation.settings}</Link>
            <LanguageSelector locale={locale} label={m.common.languageLabel} inWorkspace />
            <ThemeToggle labels={{ toLight: `${m.settings.theme}: ${m.settings.light}`, toDark: `${m.settings.theme}: ${m.settings.dark}` }} />
          </div>
        </div>
      </aside>
    </div>}
    <div className={user ? styles.content : undefined} inert={Boolean(user && open)}>
      {user && <div className={styles.notice}><SignedInNotice message={m.auth.launchNotice} /></div>}
      {user && (!mode || wrongWorkspace) ? <p className={styles.loading} role="status">Opening your workspace…</p> : children}
      {!user && guestFooter}
    </div>
  </div>;
}
