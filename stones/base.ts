export default class Stone {
  protected globalAlpha = 1;
  protected size = 0;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected ki: number
  ) {}
  draw() {
    // Base draw method - to be implemented by subclasses
  }

  setGlobalAlpha(alpha: number) {
    this.globalAlpha = alpha;
  }

  setSize(size: number) {
    this.size = size;
  }
}
