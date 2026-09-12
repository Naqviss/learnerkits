export interface MissionObjective<TContext> {
  id: string;
  labelKey: string;
  test: (context: TContext) => boolean;
}

export interface RuntimeMission<TContext> {
  id: string;
  objectives: MissionObjective<TContext>[];
}

export interface MissionEvaluation {
  complete: boolean;
  completedObjectives: string[];
  totalObjectives: number;
}

export class MissionEngine<TContext> {
  evaluate(mission: RuntimeMission<TContext>, context: TContext): MissionEvaluation {
    const completedObjectives = mission.objectives.filter((objective) => objective.test(context)).map((objective) => objective.id);
    return {
      complete: completedObjectives.length === mission.objectives.length,
      completedObjectives,
      totalObjectives: mission.objectives.length,
    };
  }
}
