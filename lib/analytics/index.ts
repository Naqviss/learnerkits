export type AnalyticsEvent = "simulation_started" | "simulation_completed" | "mission_started" | "mission_completed" | "mission_failed" | "experiment_created" | "concept_viewed" | "language_changed";
export interface AnalyticsProvider { track(event: AnalyticsEvent, payload?: Record<string, unknown>): void }
let provider: AnalyticsProvider | null = null;
export function setAnalyticsProvider(next: AnalyticsProvider | null) { provider = next; }
export function track(event: AnalyticsEvent, payload?: Record<string, unknown>) { provider?.track(event, payload); }
