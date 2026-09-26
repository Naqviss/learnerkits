"use client";
import { useEffect, useState } from "react";
import { applyMotion, applyTheme, loadSettings, resolveTheme, saveSettings, subscribeSettings, watchSystemTheme } from "@/lib/settings/storage";

// `labels.toLight` / `labels.toDark` describe what a click does, in the page's language.
export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const [theme, setTheme] = useState<"light"|"dark">("light");
  useEffect(() => {
    const settings = loadSettings();
    setTheme(resolveTheme(settings.theme));
    applyTheme(settings.theme);
    applyMotion(settings.motion);
    // Stay in sync with the settings page, other tabs, and the OS when the theme is "system".
    const unsubscribe = subscribeSettings((next) => setTheme(resolveTheme(next.theme)));
    const unwatch = watchSystemTheme();
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSystem = () => setTheme(resolveTheme(loadSettings().theme));
    query?.addEventListener("change", onSystem);
    return () => { unsubscribe(); unwatch(); query?.removeEventListener("change", onSystem); };
  }, []);
  const toggle = () => { const next = theme === "light" ? "dark" : "light"; saveSettings({ ...loadSettings(), theme: next }); setTheme(next); };
  const label = theme === "light" ? labels.toDark : labels.toLight;
  return <button className="themeToggle" onClick={toggle} aria-label={label} title={label}><span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span></button>;
}
