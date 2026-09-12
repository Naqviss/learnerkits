import type { Vec2 } from "./vectors";

export function semiImplicitEuler(position: Vec2, velocity: Vec2, acceleration: Vec2, dt: number) {
  const nextVelocity = {
    x: velocity.x + acceleration.x * dt,
    y: velocity.y + acceleration.y * dt,
  };
  const nextPosition = {
    x: position.x + nextVelocity.x * dt,
    y: position.y + nextVelocity.y * dt,
  };
  return { position: nextPosition, velocity: nextVelocity };
}
