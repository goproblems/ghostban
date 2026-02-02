import Markup from './MarkupBase';

export class GreenPlusMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, globalAlpha} = this;
    const radius = s * 0.5;
    const size = radius * 0.38;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = this.getThemeProperty('markupLineWidth') * 3;
    ctx.strokeStyle = this.getThemeProperty('positiveNodeColor');
    ctx.setLineDash(this.lineDash);

    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
