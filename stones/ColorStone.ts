import Stone from './base';

export class ColorStone extends Stone {
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, ki: number) {
    super(ctx, x, y, ki);
  }

  draw() {
    const {ctx, x, y, size, ki, globalAlpha} = this;
    if (size <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    if (ki === 1) {
      ctx.fillStyle = '#000';
    } else if (ki === -1) {
      ctx.fillStyle = '#fff';
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
