import Markup from './MarkupBase';

export class PositiveNodeMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, color, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    if (size > 0) {
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    if (size > 0) {
      ctx.arc(x, y, size * 0.4, 0, 2 * Math.PI, true);
      ctx.fill();
    }
    ctx.restore();
  }
}
