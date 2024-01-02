import Markup from './MarkupBase';

export class CircleSolidMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha, color} = this;
    const radius = s * 0.25;
    let size = radius * 0.65;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = 2;
    if (ki === 1) {
      ctx.fillStyle = '#fff';
    } else if (ki === -1) {
      ctx.fillStyle = '#000';
    } else {
      ctx.lineWidth = 3;
    }
    if (color) ctx.fillStyle = color;
    if (size > 0) {
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
      ctx.fill();
    }
    ctx.restore();
  }
}
