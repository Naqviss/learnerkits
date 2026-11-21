import { getAuthClient } from "@/lib/auth/client";

export type SimulationMeasurement = {
  id: string;
  simulation_slug: string;
  title: string;
  conditions: string;
  observation: string;
  created_at: string;
};

export type MissionId = "predict" | "compare" | "explain";
export type SimulationMissionProgress = {
  mission_id: MissionId;
  completed: boolean;
  evidence: string;
  updated_at: string;
};

export type MissionDefinition = {
  id: MissionId;
  number: string;
  title: string;
  prompt: string;
  evidenceLabel: string;
};

export function missionDefinitions(title: string, outcome: string, concepts: string): MissionDefinition[] {
  const variables = concepts.split(" · ").filter(Boolean).slice(0, 3).join(", ");
  return [
    {
      id: "predict",
      number: "01",
      title: "Predict the outcome",
      prompt: `Before changing the controls in ${title}, write what you expect to happen and why.`,
      evidenceLabel: "My prediction",
    },
    {
      id: "compare",
      number: "02",
      title: "Run a controlled comparison",
      prompt: `Change one variable${variables ? ` (${variables})` : ""}, keep the others fixed, and compare two trials.`,
      evidenceLabel: "What changed between the trials?",
    },
    {
      id: "explain",
      number: "03",
      title: "Explain from evidence",
      prompt: `${outcome} Use a measurement or visible pattern from the simulation to explain your conclusion.`,
      evidenceLabel: "My evidence-based explanation",
    },
  ];
}

export async function loadMeasurements(simulationSlug: string) {
  const client = await getAuthClient();
  const { data, error } = await client.from("simulation_measurements")
    .select("id,simulation_slug,title,conditions,observation,created_at")
    .eq("simulation_slug", simulationSlug)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SimulationMeasurement[];
}

export async function loadMissionProgress(simulationSlug: string) {
  const client = await getAuthClient();
  const { data, error } = await client.from("simulation_mission_progress")
    .select("mission_id,completed,evidence,updated_at")
    .eq("simulation_slug", simulationSlug);
  if (error) throw error;
  return (data ?? []) as SimulationMissionProgress[];
}

export async function createMeasurement(userId: string, simulationSlug: string, input: Pick<SimulationMeasurement, "title" | "conditions" | "observation">) {
  const client = await getAuthClient();
  const { data, error } = await client.from("simulation_measurements")
    .insert({ user_id: userId, simulation_slug: simulationSlug, ...input })
    .select("id,simulation_slug,title,conditions,observation,created_at")
    .single();
  if (error) throw error;
  return data as SimulationMeasurement;
}

export async function removeMeasurement(id: string) {
  const client = await getAuthClient();
  const { error } = await client.from("simulation_measurements").delete().eq("id", id);
  if (error) throw error;
}

export async function saveMissionProgress(userId: string, simulationSlug: string, progress: Pick<SimulationMissionProgress, "mission_id" | "completed" | "evidence">) {
  const client = await getAuthClient();
  const row = { user_id: userId, simulation_slug: simulationSlug, ...progress, updated_at: new Date().toISOString() };
  const { data, error } = await client.from("simulation_mission_progress")
    .upsert(row, { onConflict: "user_id,simulation_slug,mission_id" })
    .select("mission_id,completed,evidence,updated_at")
    .single();
  if (error) throw error;
  return data as SimulationMissionProgress;
}
