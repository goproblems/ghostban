import Markup from './MarkupBase';

export class NodeMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, color, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.3;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    if (size > 0) {
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
      ctx.stroke();
    }
    ctx.restore();
  }
}
