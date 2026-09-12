export interface Simulation<TState, TInput, TResult> {
  initialize(): void;
  reset(): void;
  update(dt: number): void;
  getState(): TState;
  handleInput(input: TInput): void;
  checkMissionConditions(): TResult;
  dispose(): void;
}
