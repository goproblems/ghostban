import Markup from './MarkupBase';

export class CrossMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.globalAlpha = globalAlpha;
    if (ki === 1) {
      ctx.strokeStyle = '#fff';
    } else if (ki === -1) {
      ctx.strokeStyle = '#000';
    } else {
      ctx.strokeStyle = this.getThemeAwareColor('#000', '#fff');
      size = radius * 0.58;
    }
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
