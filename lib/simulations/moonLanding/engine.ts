import { MOON_GRAVITY } from "@/lib/physics/constants";
import { semiImplicitEuler } from "@/lib/physics/integration";
import { massFlowRate } from "@/lib/physics/rocketEquation";
import { rotate, type Vec2 } from "@/lib/physics/vectors";
import type { Simulation } from "../types";

export type LandingStatus = "flying" | "landed" | "hard-landing" | "crashed";
export interface MoonLandingState {
  position: Vec2;
  velocity: Vec2;
  acceleration: Vec2;
  angle: number;
  angularVelocity: number;
  dryMass: number;
  fuelMass: number;
  initialFuelMass: number;
  maxThrust: number;
  isp: number;
  throttle: number;
  status: LandingStatus;
  elapsed: number;
  lastImpactSpeed: number;
}
export interface MoonLandingInput {
  throttle?: number;
  rotate?: -1 | 0 | 1;
}
export interface MoonLandingResult {
  status: LandingStatus;
  safe: boolean;
  reason: string;
}

const DEFAULT_STATE: MoonLandingState = {
  position: { x: 0, y: 1200 },
  velocity: { x: 11, y: -34 },
  acceleration: { x: 0, y: -MOON_GRAVITY },
  angle: 0.06,
  angularVelocity: 0,
  dryMass: 4700,
  fuelMass: 2700,
  initialFuelMass: 2700,
  maxThrust: 45_000,
  isp: 311,
  throttle: 0,
  status: "flying",
  elapsed: 0,
  lastImpactSpeed: 0,
};

export class MoonLandingEngine implements Simulation<MoonLandingState, MoonLandingInput, MoonLandingResult> {
  private state: MoonLandingState;
  private rotateInput = 0;
  constructor(private readonly initial: Partial<MoonLandingState> = {}) {
    this.state = this.makeInitialState();
  }
  private makeInitialState(): MoonLandingState {
    return { ...DEFAULT_STATE, ...this.initial, position: { ...DEFAULT_STATE.position, ...this.initial.position }, velocity: { ...DEFAULT_STATE.velocity, ...this.initial.velocity }, acceleration: { ...DEFAULT_STATE.acceleration } };
  }
  initialize() { this.reset(); }
  reset() { this.state = this.makeInitialState(); this.rotateInput = 0; }
  handleInput(input: MoonLandingInput) {
    if (typeof input.throttle === "number") this.state.throttle = Math.max(0, Math.min(1, input.throttle));
    if (typeof input.rotate === "number") this.rotateInput = input.rotate;
  }
  update(dt: number) {
    const s = this.state;
    if (s.status !== "flying") return;
    const mass = s.dryMass + s.fuelMass;
    const commandedThrust = s.fuelMass > 0 ? s.maxThrust * s.throttle : 0;
    const usedFuel = Math.min(s.fuelMass, massFlowRate(commandedThrust, s.isp) * dt);
    s.fuelMass -= usedFuel;

    const thrustDirection = rotate({ x: 0, y: 1 }, -s.angle);
    const thrustAccel = mass > 0 ? commandedThrust / mass : 0;
    s.acceleration = {
      x: thrustDirection.x * thrustAccel,
      y: thrustDirection.y * thrustAccel - MOON_GRAVITY,
    };

    s.angularVelocity += this.rotateInput * 0.5 * dt;
    s.angularVelocity *= Math.max(0, 1 - 0.18 * dt);
    s.angle += s.angularVelocity * dt;

    const integrated = semiImplicitEuler(s.position, s.velocity, s.acceleration, dt);
    s.position = integrated.position;
    s.velocity = integrated.velocity;
    s.elapsed += dt;

    if (s.position.y <= 0) this.resolveSurfaceContact();
  }
  private resolveSurfaceContact() {
    const s = this.state;
    const vertical = Math.abs(s.velocity.y);
    const horizontal = Math.abs(s.velocity.x);
    const angle = Math.abs(s.angle);
    s.lastImpactSpeed = Math.hypot(s.velocity.x, s.velocity.y);
    s.position.y = 0;
    if (vertical <= 3.2 && horizontal <= 2.2 && angle <= 0.14) s.status = "landed";
    else if (vertical <= 7 && horizontal <= 5 && angle <= 0.3) s.status = "hard-landing";
    else s.status = "crashed";
    s.velocity = { x: 0, y: 0 };
    s.acceleration = { x: 0, y: 0 };
  }
  getState(): MoonLandingState { return { ...this.state, position: { ...this.state.position }, velocity: { ...this.state.velocity }, acceleration: { ...this.state.acceleration } }; }
  checkMissionConditions(): MoonLandingResult {
    const status = this.state.status;
    if (status === "landed") return { status, safe: true, reason: "Safe touchdown: low velocity and stable orientation." };
    if (status === "hard-landing") return { status, safe: false, reason: "The lander survived, but impact velocity or tilt exceeded the safe landing envelope." };
    if (status === "crashed") return { status, safe: false, reason: "Impact energy was too high. Reduce descent speed and stabilize before contact." };
    return { status, safe: false, reason: "Landing is still in progress." };
  }
  dispose() {}
}
