import Markup from './MarkupBase';

export class RedCrossMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, globalAlpha} = this;
    const radius = s * 0.5;
    const size = (radius * 0.38) / Math.SQRT2;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = this.getThemeProperty('markupLineWidth') * 3;
    ctx.globalAlpha = globalAlpha;
    ctx.strokeStyle = this.getThemeProperty('negativeNodeColor');
    ctx.setLineDash(this.lineDash);

    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
