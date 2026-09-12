export class FixedStepRunner {
  private accumulator = 0;
  constructor(public readonly step = 1 / 120, private readonly maxSteps = 12, private readonly maxFrameDt = 0.25) {}
  advance(frameDt: number, update: (dt: number) => void) {
    if (!Number.isFinite(frameDt) || frameDt <= 0) return;
    this.accumulator += Math.min(frameDt, this.maxFrameDt);
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
