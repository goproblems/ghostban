export default class EffectBase {
  protected globalAlpha = 1;
  protected color = '';

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected size: number,
    protected ki: number
  ) {}

  play() {
    console.log('TBD');
  }
}
