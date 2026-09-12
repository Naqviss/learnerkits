import { EARTH_MU } from "./constants";
import { length, scale, type Vec2 } from "./vectors";

export function gravitationalAcceleration(position: Vec2, mu = EARTH_MU): Vec2 {
  const r = length(position);
  if (r <= 0) return { x: 0, y: 0 };
  const factor = -mu / (r * r * r);
  return scale(position, factor);
}

export const circularOrbitalVelocity = (radius: number, mu = EARTH_MU) => Math.sqrt(mu / radius);
export const escapeVelocity = (radius: number, mu = EARTH_MU) => Math.sqrt((2 * mu) / radius);
export const specificOrbitalEnergy = (speed: number, radius: number, mu = EARTH_MU) => speed * speed / 2 - mu / radius;
