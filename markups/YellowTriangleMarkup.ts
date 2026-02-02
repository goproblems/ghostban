import Markup from './MarkupBase';

export class YellowTriangleMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, globalAlpha} = this;
    const radius = s * 0.5;
    const size = radius * 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;

    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size * Math.cos(0.523), y + size * Math.sin(0.523));
    ctx.lineTo(x + size * Math.cos(0.523), y + size * Math.sin(0.523));

    ctx.lineWidth = this.getThemeProperty('markupLineWidth') * 2;
    ctx.strokeStyle = '#facc15';
    ctx.setLineDash(this.lineDash);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
