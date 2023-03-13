export default class Stone {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  r: number;
  ki: number;
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    ki: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.r = r;
    this.ki = ki;
  }
  draw() {
    console.log('TBD');
  }
}
