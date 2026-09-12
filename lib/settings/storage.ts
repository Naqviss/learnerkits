export type RenderQuality = "low" | "medium" | "high";
export type MotionPreference = "system" | "reduce" | "full";
export type ThemePreference = "light" | "dark" | "system";

export interface AppSettings {
  quality: RenderQuality;
  motion: MotionPreference;
  theme: ThemePreference;
}

const STORAGE_KEY = "science-sim-settings-v1";
export const defaultSettings: AppSettings = { quality: "high", motion: "system", theme: "light" };

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const quality: RenderQuality = parsed.quality === "low" || parsed.quality === "medium" || parsed.quality === "high" ? parsed.quality : defaultSettings.quality;
    const motion: MotionPreference = parsed.motion === "system" || parsed.motion === "reduce" || parsed.motion === "full" ? parsed.motion : defaultSettings.motion;
    const theme: ThemePreference = parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system" ? parsed.theme : defaultSettings.theme;
    return { quality, motion, theme };
  } catch {
    return defaultSettings;
  }
}

export function resolveTheme(theme: ThemePreference): "light" | "dark" {
  if (theme !== "system") return theme;
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ThemePreference): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolveTheme(theme);
  document.documentElement.style.colorScheme = resolveTheme(theme);
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  applyTheme(settings.theme);
  window.dispatchEvent(new CustomEvent("science-sim-settings", { detail: settings }));
}

export function prefersReducedMotion(settings = loadSettings()): boolean {
  if (settings.motion === "reduce") return true;
  if (settings.motion === "full") return false;
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

export function renderProfile(quality: RenderQuality) {
  if (quality === "low") return { pixelRatioCap: 1, shadows: false, starCount: 260 };
  if (quality === "medium") return { pixelRatioCap: 1.35, shadows: true, starCount: 520 };
  return { pixelRatioCap: 1.7, shadows: true, starCount: 800 };
}
