export interface Vec2 { x: number; y: number }
export const vec = (x = 0, y = 0): Vec2 => ({ x, y });
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a: Vec2, s: number): Vec2 => ({ x: a.x * s, y: a.y * s });
export const length = (a: Vec2): number => Math.hypot(a.x, a.y);
export const normalize = (a: Vec2): Vec2 => {
  const l = length(a);
  return l > 0 ? scale(a, 1 / l) : vec();
};
export const rotate = (a: Vec2, radians: number): Vec2 => ({
  x: a.x * Math.cos(radians) - a.y * Math.sin(radians),
  y: a.x * Math.sin(radians) + a.y * Math.cos(radians),
});
