"use client";
import { useEffect, useState } from "react";
import { applyTheme, loadSettings, saveSettings } from "@/lib/settings/storage";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light"|"dark">("light");
  useEffect(() => { const settings = loadSettings(); const resolved = settings.theme === "dark" ? "dark" : settings.theme === "light" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; setTheme(resolved); applyTheme(settings.theme); }, []);
  const toggle = () => { const next = theme === "light" ? "dark" : "light"; const settings = loadSettings(); saveSettings({ ...settings, theme: next }); setTheme(next); };
  return <button className="themeToggle" onClick={toggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span></button>;
}
