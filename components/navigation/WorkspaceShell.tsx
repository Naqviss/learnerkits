"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/session";
import { isWorkspaceLandingPath, workspaceHome, workspaceModeForPath, type WorkspaceMode } from "@/lib/auth/workspace";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { SearchBar } from "./SearchBar";
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
  const [collapsed, setCollapsed] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const routeMode = workspaceModeForPath(pathname);
  const mode = routeMode ?? (preference && preference.userId === userId ? preference.mode : undefined);
  // Production serves the canonical English homepage at `/`, while local development and
  // alternate locales use `/{locale}`. Both are public landing URLs and should open the
  // remembered workspace after a browser session is restored.
  const isLandingPath = isWorkspaceLandingPath(pathname, locale);
  const isTeacherKitLanding = pathname === "/en/teacher-kit";
  const checkingLandingSession = clientReady && status === "loading" && (isLandingPath || isTeacherKitLanding);
  const redirectingWorkspaceLanding = Boolean(user && mode && (isLandingPath || isTeacherKitLanding));

  useEffect(() => { setClientReady(true); }, []);

  useEffect(() => {
    if (!userId) {
      setPreference(undefined);
      setOpen(false);
      setCollapsed(false);
      return;
    }
    if (routeMode) {
      setPreference({ userId, mode: routeMode });
      try { localStorage.setItem(`learnerkits-workspace:${userId}`, routeMode); } catch { /* optional preference */ }
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
  }, [userId, mode, pathname, routeMode]);

  useEffect(() => {
    if (!userId) return;
    try { setCollapsed(localStorage.getItem(`learnerkits-sidebar:${userId}`) === "collapsed"); }
    catch { setCollapsed(false); }
  }, [userId]);

  useEffect(() => {
    if (!mode) return;
    if (isLandingPath || isTeacherKitLanding) {
      router.replace(mode === "student" && locale !== "en" ? `/${locale}/progress` : workspaceHome(mode));
    }
  }, [isLandingPath, isTeacherKitLanding, locale, mode, router]);

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
    router.push(next === "student" && locale !== "en" ? `/${locale}/progress` : workspaceHome(next));
  }

  function toggleSidebar() {
    if (!userId) return;
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(`learnerkits-sidebar:${userId}`, next ? "collapsed" : "expanded"); } catch { /* optional preference */ }
  }

  const workspaceLinks = mode === "teacher"
    ? [["Overview", teacherHome], ["Classes & students", `${teacherHome}#classes`], ["Lessons", `${teacherHome}#lessons`], ["Subject kits", `${teacherHome}#kits`], ["Question bank & papers", `${teacherHome}#papers`], ["Assignments", `${teacherHome}#assignments`], ["Submissions", `${teacherHome}#submissions`], ["Class insights", `${teacherHome}#insights`], ["Plan & seats", `${teacherHome}#plan`]]
    : [["My classroom", workspaceHome("student")], [m.navigation.progress, `/${locale}/progress`]];
  const resources = [[m.navigation.simulations, `/${locale}/simulations`], ...(mode === "teacher"
    ? []
    : [["Exam preparation", "/en/exam-prep"], ["Mock exams", "/en/mock-exams"]])];

  function navigationLink([label, href]: string[]) {
    const teacherSection = href.startsWith(teacherHome);
    const active = teacherSection ? `${pathname}${hash}` === href : pathname === href || pathname.startsWith(`${href}/`);
    const onClick = open ? closeDrawer : undefined;
    const icon = href.includes("#classes") ? "◎" : href.includes("#lessons") ? "▤" : href.includes("#kits") ? "◇" : href.includes("#papers") ? "▣" : href.includes("#assignments") ? "✓" : href.includes("#submissions") ? "↗" : href.includes("#insights") || href.endsWith("/progress") ? "◔" : href.includes("#plan") ? "☆" : href.includes("simulations") ? "◇" : href.includes("exam") ? "▣" : href.includes("teacher-kit") ? "▦" : "⌂";
    const content = <><span className={styles.navIcon} aria-hidden="true">{icon}</span><span className={styles.linkText}>{label}</span></>;
    return teacherSection
      ? <a key={href} href={href} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} aria-current={active ? "page" : undefined} onClick={onClick}>{content}</a>
      : <Link key={href} href={href} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} aria-current={active ? "page" : undefined} onClick={onClick}>{content}</Link>;
  }

  return <div className={user ? styles.shell : undefined} data-workspace={user ? mode ?? "loading" : undefined} data-nav-collapsed={user && collapsed ? "true" : undefined}>
    {!user && !checkingLandingSession && guestNav}
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
          <img className={styles.brandWordmark} src="/learnerkits-logo.svg" width="178" height="38" alt="LearnerKits" />
          <img className={styles.brandSymbol} src="/learnerkits-mark.svg" width="30" height="30" alt="LearnerKits" />
          <button className={styles.collapseButton} type="button" onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
          </button>
          <button className={styles.drawerClose} type="button" ref={closeButton} onClick={closeDrawer} aria-label="Close workspace menu">×</button>
        </div>
        {mode && <div className={styles.sidebarScroll}>
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
        </div>}
        <div className={styles.sidebarFooter}>
          {mode && <WorkspaceProfile key={user.id} user={user} mode={mode} setMode={changeMode} locale={locale} signOutLabel={m.auth.signOut} />}
          <div className={styles.preferences}>
            <Link href={`/${locale}/settings`} onClick={open ? closeDrawer : undefined}>{m.navigation.settings}</Link>
            <LanguageSelector locale={locale} label={m.common.languageLabel} inWorkspace />
            <ThemeToggle labels={{ toLight: `${m.settings.theme}: ${m.settings.light}`, toDark: `${m.settings.theme}: ${m.settings.dark}` }} />
          </div>
        </div>
      </aside>
    </div>}
    <div className={user ? styles.content : undefined} inert={Boolean(user && open)}>
      {checkingLandingSession && <main className={styles.authLoading} role="status" aria-live="polite">
        <img src="/learnerkits-mark.svg" width="42" height="42" alt="" />
        <span className={styles.authSpinner} aria-hidden="true" />
        <p>Opening LearnerKits…</p>
      </main>}
      {user && mode && <header className={styles.appBar}>
        <div>
          <span className={styles.appBarLabel}>{mode === "teacher" ? "Teacher workspace" : "Student workspace"}</span>
          <strong>{mode === "teacher" ? "Teacher Kit" : "My classroom"}</strong>
        </div>
        <p className={styles.appStatus}>{m.auth.launchNotice}</p>
        <div className={styles.appBarActions}>
          <Link href={`/${locale}/simulations`}>Explore simulations</Link>
          <Link className={styles.helpLink} href={`/${locale}/contact`}>Help</Link>
        </div>
      </header>}
      {!checkingLandingSession && (user && (!mode || redirectingWorkspaceLanding) ? <p className={styles.loading} role="status">Opening your dashboard…</p> : children)}
      {status === "signedOut" && guestFooter}
    </div>
  </div>;
}
