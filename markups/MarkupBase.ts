export default class Markup {
  protected globalAlpha = 1;
  protected color = '';

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected s: number,
    protected ki: number,
    protected val: string | number = ''
  ) {}

  draw() {
    console.log('TBD');
  }

  setGlobalAlpha(alpha: number) {
    this.globalAlpha = alpha;
  }

  setColor(color: string) {
    this.color = color;
  }
}
