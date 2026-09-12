export type MissionDifficulty = "Beginner" | "Intermediate" | "Advanced";
export interface MissionDefinition {
  id: string;
  simulation: "moonLanding" | "orbitalRescue";
  titleKey: string;
  descriptionKey: string;
  difficulty: MissionDifficulty;
  xp: number;
}

export const missions: MissionDefinition[] = [
  { id: "moon-gravity", simulation: "moonLanding", titleKey: "missions.moon1.title", descriptionKey: "missions.moon1.description", difficulty: "Beginner", xp: 100 },
  { id: "moon-descent", simulation: "moonLanding", titleKey: "missions.moon2.title", descriptionKey: "missions.moon2.description", difficulty: "Beginner", xp: 150 },
  { id: "moon-soft", simulation: "moonLanding", titleKey: "missions.moon3.title", descriptionKey: "missions.moon3.description", difficulty: "Intermediate", xp: 250 },
  { id: "moon-fuel", simulation: "moonLanding", titleKey: "missions.moon4.title", descriptionKey: "missions.moon4.description", difficulty: "Intermediate", xp: 300 },
  { id: "moon-expert", simulation: "moonLanding", titleKey: "missions.moon5.title", descriptionKey: "missions.moon5.description", difficulty: "Advanced", xp: 500 },
  { id: "orbit-stable", simulation: "orbitalRescue", titleKey: "missions.orbit1.title", descriptionKey: "missions.orbit1.description", difficulty: "Beginner", xp: 150 },
  { id: "orbit-altitude", simulation: "orbitalRescue", titleKey: "missions.orbit2.title", descriptionKey: "missions.orbit2.description", difficulty: "Intermediate", xp: 225 },
  { id: "orbit-transfer", simulation: "orbitalRescue", titleKey: "missions.orbit3.title", descriptionKey: "missions.orbit3.description", difficulty: "Intermediate", xp: 300 },
  { id: "orbit-intercept", simulation: "orbitalRescue", titleKey: "missions.orbit4.title", descriptionKey: "missions.orbit4.description", difficulty: "Advanced", xp: 400 },
  { id: "orbit-rescue", simulation: "orbitalRescue", titleKey: "missions.orbit5.title", descriptionKey: "missions.orbit5.description", difficulty: "Advanced", xp: 500 },
  { id: "orbit-expert", simulation: "orbitalRescue", titleKey: "missions.orbit6.title", descriptionKey: "missions.orbit6.description", difficulty: "Advanced", xp: 650 },
];
