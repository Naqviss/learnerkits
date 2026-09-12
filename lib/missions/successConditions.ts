import type { MoonLandingState } from "@/lib/simulations/moonLanding/engine";
import type { OrbitalState } from "@/lib/simulations/orbitalRescue/engine";

export interface OrbitalMissionContext {
  state: OrbitalState;
  altitude: number;
  targetDistance: number;
  relativeVelocity: number;
}

export function moonMissionComplete(id: string, state: MoonLandingState): boolean {
  const fuelRatio = state.fuelMass / Math.max(1, state.initialFuelMass);
  switch (id) {
    case "moon-gravity": return state.elapsed >= 5;
    case "moon-descent": return state.elapsed >= 12 && state.status !== "crashed";
    case "moon-soft": return state.status === "landed";
    case "moon-fuel": return state.status === "landed" && fuelRatio >= 0.35;
    case "moon-expert": return state.status === "landed" && fuelRatio >= 0.45 && state.lastImpactSpeed <= 2.6;
    default: return false;
  }
}

export function orbitMissionComplete(id: string, context: OrbitalMissionContext): boolean {
  const { state, altitude, targetDistance, relativeVelocity } = context;
  const fuelRatio = state.fuelMass / Math.max(1, state.initialFuelMass);
  switch (id) {
    case "orbit-stable": return state.elapsed >= 120 && state.status === "active" && altitude > 150_000;
    case "orbit-altitude": return Math.abs(altitude - 400_000) >= 50_000 && state.status === "active";
    case "orbit-transfer": return altitude >= 415_000 && altitude <= 455_000 && state.elapsed >= 60;
    case "orbit-intercept": return targetDistance < 50_000;
    case "orbit-rescue": return state.status === "rescued";
    case "orbit-expert": return state.status === "rescued" && fuelRatio >= 0.35 && relativeVelocity < 5;
    default: return false;
  }
}

export function moonScore(state: MoonLandingState): number {
  if (state.status !== "landed") return 0;
  const fuel = state.fuelMass / Math.max(1, state.initialFuelMass);
  const impact = Math.max(0, 1 - state.lastImpactSpeed / 5);
  const attitude = Math.max(0, 1 - Math.abs(state.angle) / 0.2);
  return Math.round(1000 * (0.4 * fuel + 0.4 * impact + 0.2 * attitude));
}

export function orbitalScore(context: OrbitalMissionContext): number {
  if (context.state.status !== "rescued") return 0;
  const fuel = context.state.fuelMass / Math.max(1, context.state.initialFuelMass);
  const rel = Math.max(0, 1 - context.relativeVelocity / 10);
  return Math.round(1000 * (0.55 * fuel + 0.45 * rel));
}
