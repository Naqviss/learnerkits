"use client";

import { useEffect, useState } from "react";
import type { Messages } from "@/lib/i18n/getMessages";
import { applyTheme, defaultSettings, loadSettings, saveSettings, type AppSettings, type MotionPreference, type RenderQuality, type ThemePreference } from "@/lib/settings/storage";

export function SettingsClient({ m }: { m: Messages }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { const next = loadSettings(); setSettings(next); applyTheme(next.theme); }, []);

  const commit = (next: AppSettings) => {
    setSettings(next); saveSettings(next); setSaved(true); window.setTimeout(() => setSaved(false), 1400);
  };

  return <main className="container section narrow">
    <span className="eyebrow">{m.navigation.settings}</span>
    <h1>{m.settings.title}</h1>
    <p className="lead">{m.settings.lead}</p>
    <div className="grid3 sectionCompact">
      <section className="card">
        <h2>{m.settings.theme}</h2><p className="muted">{m.settings.themeHelp}</p>
        <label className="field"><span>{m.settings.appearance}</span><select className="langSelect" value={settings.theme} onChange={(e) => commit({ ...settings, theme: e.target.value as ThemePreference })}><option value="light">{m.settings.light}</option><option value="dark">{m.settings.dark}</option><option value="system">{m.settings.system}</option></select></label>
      </section>
      <section className="card"><h2>{m.settings.quality}</h2><p className="muted">{m.settings.qualityHelp}</p><label className="field"><span>{m.settings.quality}</span><select className="langSelect" value={settings.quality} onChange={(e) => commit({ ...settings, quality: e.target.value as RenderQuality })}><option value="low">{m.settings.low}</option><option value="medium">{m.settings.medium}</option><option value="high">{m.settings.high}</option></select></label></section>
      <section className="card"><h2>{m.settings.motion}</h2><p className="muted">{m.settings.motionHelp}</p><label className="field"><span>{m.settings.motion}</span><select className="langSelect" value={settings.motion} onChange={(e) => commit({ ...settings, motion: e.target.value as MotionPreference })}><option value="system">{m.settings.system}</option><option value="reduce">{m.settings.reduce}</option><option value="full">{m.settings.full}</option></select></label></section>
    </div><p className="muted" role="status">{saved ? m.settings.saved : m.settings.applies}</p>
  </main>;
}
