import type { Values } from "./model";
export const spacePresets: Record<string, { label: string; values: Values }[]> = {
  "moon-phases-3d": [{ label: "New moon", values: { angle: 0 } }, { label: "Quarter", values: { angle: 90 } }, { label: "Full moon", values: { angle: 180 } }],
  "solar-eclipse-3d": [{ label: "Total", values: { offset: 0, distance: 356000 } }, { label: "Annular", values: { offset: 0, distance: 406000 } }, { label: "Partial", values: { offset: .25, distance: 384000 } }],
  "escape-velocity": [{ label: "Earth orbit", values: { world: 0, altitude: 400, speed: 7.7 } }, { label: "Escape Earth", values: { world: 0, altitude: 400, speed: 11 } }, { label: "Escape Moon", values: { world: 1, altitude: 100, speed: 2.4 } }],
  "satellite-orbit-builder": [{ label: "Circular", values: { altitude: 400, speedScale: 100, inclination: 28 } }, { label: "Elliptical", values: { altitude: 400, speedScale: 120, inclination: 45 } }, { label: "Reentry", values: { altitude: 400, speedScale: 85, inclination: 15 } }],
  "gravity-slingshot": [{ label: "Gain speed", values: { angle: 150, speed: 8, altitude: 1000, side: 0 } }, { label: "Lose speed", values: { angle: 30, speed: 8, altitude: 1000, side: 1 } }],
  "keplers-laws-orbit": [{ label: "Earth-like", values: { axis: 1, eccentricity: .02, anomaly: 0 } }, { label: "Comet-like", values: { axis: 2, eccentricity: .8, anomaly: 0 } }, { label: "Two-year orbit", values: { axis: 1.59, eccentricity: .6, anomaly: 0 } }],
  "earth-seasons-tilt": [{ label: "June solstice", values: { longitude: 90, tilt: 23.5, latitude: 40 } }, { label: "December solstice", values: { longitude: 270, tilt: 23.5, latitude: 40 } }, { label: "Equinox", values: { longitude: 0, tilt: 23.5, latitude: 40 } }],
  "planet-size-comparison-3d": [{ label: "Earth / Jupiter", values: { planetA: 2, planetB: 4 } }, { label: "Earth / Mars", values: { planetA: 2, planetB: 3 } }, { label: "Ice giants", values: { planetA: 6, planetB: 7 } }],
  "black-hole-orbit": [{ label: "Safe orbit", values: { mass: 10, radius: 8 } }, { label: "Near the limit", values: { mass: 10, radius: 3.5 } }, { label: "Unstable", values: { mass: 10, radius: 2.5 } }],
  "mars-landing-challenge": [{ label: "Autopilot", values: { assist: 1, speed: 0 } }, { label: "Manual flight", values: { assist: 0, throttle: 35, speed: 0 } }],
};
