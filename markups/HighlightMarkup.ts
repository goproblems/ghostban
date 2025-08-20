import Markup from './MarkupBase';

export class HighlightMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    let size = s * 0.4;
    ctx.fillStyle = this.getThemeAwareColor('#ffeb64', '#b8860b');
    if (ki === 1 || ki === -1) {
      size = s * 0.35;
    }
    ctx.arc(x, y, size, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.restore();
  }
}
