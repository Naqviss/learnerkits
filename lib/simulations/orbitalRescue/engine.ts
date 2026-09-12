import { EARTH_MU, EARTH_RADIUS } from "@/lib/physics/constants";
import { gravitationalAcceleration, specificOrbitalEnergy } from "@/lib/physics/gravity";
import { semiImplicitEuler } from "@/lib/physics/integration";
import { deltaV, massFlowRate } from "@/lib/physics/rocketEquation";
import { add, length, normalize, scale, type Vec2 } from "@/lib/physics/vectors";
import type { Simulation } from "../types";

export type BurnDirection = "none" | "prograde" | "retrograde" | "radial-out" | "radial-in";
export type OrbitalStatus = "active" | "rescued" | "reentry" | "escaped";
export interface OrbitalState {
  position: Vec2;
  velocity: Vec2;
  targetPosition: Vec2;
  targetVelocity: Vec2;
  dryMass: number;
  fuelMass: number;
  initialFuelMass: number;
  isp: number;
  maxThrust: number;
  thrust: number;
  direction: BurnDirection;
  elapsed: number;
  status: OrbitalStatus;
}
export interface OrbitalInput { thrust?: number; direction?: BurnDirection }
export interface OrbitalResult { status: OrbitalStatus; rescued: boolean; reason: string }

const altitude = 400_000;
const radius = EARTH_RADIUS + altitude;
const circularSpeed = Math.sqrt(EARTH_MU / radius);
const targetRadius = EARTH_RADIUS + 430_000;
const targetSpeed = Math.sqrt(EARTH_MU / targetRadius);

const DEFAULT_STATE: OrbitalState = {
  position: { x: radius, y: 0 },
  velocity: { x: 0, y: circularSpeed * 0.995 },
  targetPosition: { x: 0, y: targetRadius },
  targetVelocity: { x: -targetSpeed, y: 0 },
  dryMass: 8_000,
  fuelMass: 3_500,
  initialFuelMass: 3_500,
  isp: 340,
  maxThrust: 120_000,
  thrust: 0,
  direction: "none",
  elapsed: 0,
  status: "active",
};

export class OrbitalRescueEngine implements Simulation<OrbitalState, OrbitalInput, OrbitalResult> {
  private state: OrbitalState;
  constructor(private readonly initial: Partial<OrbitalState> = {}) { this.state = this.makeInitialState(); }
  private makeInitialState(): OrbitalState {
    return {
      ...DEFAULT_STATE,
      ...this.initial,
      position: { ...DEFAULT_STATE.position, ...this.initial.position },
      velocity: { ...DEFAULT_STATE.velocity, ...this.initial.velocity },
      targetPosition: { ...DEFAULT_STATE.targetPosition, ...this.initial.targetPosition },
      targetVelocity: { ...DEFAULT_STATE.targetVelocity, ...this.initial.targetVelocity },
    };
  }
  initialize() { this.reset(); }
  reset() { this.state = this.makeInitialState(); }
  handleInput(input: OrbitalInput) {
    if (typeof input.thrust === "number") this.state.thrust = Math.max(0, Math.min(1, input.thrust));
    if (input.direction) this.state.direction = input.direction;
  }
  update(dt: number) {
    const s = this.state;
    if (s.status !== "active") return;
    const grav = gravitationalAcceleration(s.position);
    const targetGrav = gravitationalAcceleration(s.targetPosition);
    let thrustAcceleration: Vec2 = { x: 0, y: 0 };
    const mass = s.dryMass + s.fuelMass;
    const force = s.fuelMass > 0 ? s.maxThrust * s.thrust : 0;
    if (force > 0 && s.direction !== "none") {
      const prograde = normalize(s.velocity);
      const radial = normalize(s.position);
      const dir = s.direction === "prograde" ? prograde : s.direction === "retrograde" ? scale(prograde, -1) : s.direction === "radial-out" ? radial : scale(radial, -1);
      thrustAcceleration = scale(dir, force / mass);
      s.fuelMass -= Math.min(s.fuelMass, massFlowRate(force, s.isp) * dt);
    }
    const ship = semiImplicitEuler(s.position, s.velocity, add(grav, thrustAcceleration), dt);
    const target = semiImplicitEuler(s.targetPosition, s.targetVelocity, targetGrav, dt);
    s.position = ship.position; s.velocity = ship.velocity;
    s.targetPosition = target.position; s.targetVelocity = target.velocity;
    s.elapsed += dt;

    const shipR = length(s.position);
    if (shipR <= EARTH_RADIUS + 80_000) s.status = "reentry";
    if (shipR >= EARTH_RADIUS * 8) s.status = "escaped";
    const distance = length({ x: s.position.x - s.targetPosition.x, y: s.position.y - s.targetPosition.y });
    const relV = length({ x: s.velocity.x - s.targetVelocity.x, y: s.velocity.y - s.targetVelocity.y });
    if (distance < 4_000 && relV < 8) s.status = "rescued";
  }
  getState(): OrbitalState { return { ...this.state, position: { ...this.state.position }, velocity: { ...this.state.velocity }, targetPosition: { ...this.state.targetPosition }, targetVelocity: { ...this.state.targetVelocity } }; }
  telemetry() {
    const s = this.state;
    const r = length(s.position);
    const speed = length(s.velocity);
    const targetDistance = length({ x: s.position.x - s.targetPosition.x, y: s.position.y - s.targetPosition.y });
    const relativeVelocity = length({ x: s.velocity.x - s.targetVelocity.x, y: s.velocity.y - s.targetVelocity.y });
    return {
      altitude: r - EARTH_RADIUS,
      speed,
      circularSpeed: Math.sqrt(EARTH_MU / r),
      orbitalEnergy: specificOrbitalEnergy(speed, r),
      targetDistance,
      relativeVelocity,
      deltaVRemaining: deltaV(s.isp, s.dryMass + s.fuelMass, s.dryMass),
    };
  }
  checkMissionConditions(): OrbitalResult {
    if (this.state.status === "rescued") return { status: "rescued", rescued: true, reason: "Rendezvous achieved with low relative velocity." };
    if (this.state.status === "reentry") return { status: "reentry", rescued: false, reason: "Perigee fell too low and the spacecraft reentered." };
    if (this.state.status === "escaped") return { status: "escaped", rescued: false, reason: "The spacecraft moved beyond the mission region." };
    return { status: "active", rescued: false, reason: "Match the target orbit, then reduce relative velocity for rendezvous." };
  }
  dispose() {}
}
