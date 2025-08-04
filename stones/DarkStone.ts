import Stone from './base';

export class DarkStone extends Stone {
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    ki: number,
    fillColor: string = '#000'
  ) {
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
    ctx.strokeStyle = '#1a1a1a';
    if (ki === 1) {
      ctx.fillStyle = '#1a1a1a';
    } else if (ki === -1) {
      ctx.fillStyle = '#F2F2F2';
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
