import type { PlanId } from "./types";

// Student seats are counted once per student across all of a teacher's classes.
export const plans: Record<PlanId, { name: string; seats: number; display: string }> = {
  basic: { name: "Basic", seats: 10, display: "10 students" },
  famous: { name: "Famous", seats: 30, display: "30 students" },
  premium: { name: "Premium", seats: 500, display: "100+ students" },
};
export const planIds = Object.keys(plans) as PlanId[];
export function isPlanId(value: unknown): value is PlanId { return typeof value === "string" && value in plans; }

/** Distinct students across a teacher's classes. */
export function seatsUsed(members: { student_id: string }[]) { return new Set(members.map((member) => member.student_id)).size; }
