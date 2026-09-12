export class FixedStepRunner {
  private accumulator = 0;
  constructor(public readonly step = 1 / 120, private readonly maxSteps = 12) {}
  advance(frameDt: number, update: (dt: number) => void) {
    this.accumulator += Math.min(frameDt, 0.25);
    let steps = 0;
    while (this.accumulator >= this.step && steps < this.maxSteps) {
      update(this.step);
      this.accumulator -= this.step;
      steps++;
    }
    if (steps === this.maxSteps) this.accumulator = 0;
  }
  reset() { this.accumulator = 0; }
}
