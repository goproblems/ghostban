import Markup from './MarkupBase';

export class NodeMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, color, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.4;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.setLineDash(this.lineDash);
    if (size > 0) {
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
      ctx.stroke();
    }
    ctx.restore();
  }
}
