export interface ProgressState { xp: number; completedMissionIds: string[]; bestScores: Record<string, number> }
const KEY = "science-sim-progress-v1";
const EMPTY: ProgressState = { xp: 0, completedMissionIds: [], bestScores: {} };
export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return EMPTY; }
}
export function saveProgress(state: ProgressState) { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state)); }
export type RankKey = "explorer" | "cadet" | "pilot" | "missionSpecialist" | "spaceScientist";
export const rankGoals = [300, 900, 1800, 3000] as const;
export function rankForXp(xp: number): RankKey {
  if (xp >= rankGoals[3]) return "spaceScientist";
  if (xp >= rankGoals[2]) return "missionSpecialist";
  if (xp >= rankGoals[1]) return "pilot";
  if (xp >= rankGoals[0]) return "cadet";
  return "explorer";
}

export function completeMission(id: string, xp: number, score: number): ProgressState {
  const current = loadProgress();
  const alreadyComplete = current.completedMissionIds.includes(id);
  const next: ProgressState = {
    xp: current.xp + (alreadyComplete ? 0 : xp),
    completedMissionIds: alreadyComplete ? current.completedMissionIds : [...current.completedMissionIds, id],
    bestScores: { ...current.bestScores, [id]: Math.max(current.bestScores[id] ?? 0, score) },
  };
  saveProgress(next);
  return next;
}
