import Markup from './MarkupBase';
import {Ki} from '../types';

export class TriangleMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.75;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size * Math.cos(0.523), y + size * Math.sin(0.523));
    ctx.lineTo(x + size * Math.cos(0.523), y + size * Math.sin(0.523));

    ctx.lineWidth = this.getThemeProperty('markupLineWidth');
    if (ki === Ki.White) {
      ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.Black) {
      ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
    } else {
      ctx.strokeStyle = this.getThemeProperty('boardLineColor');
      ctx.lineWidth = 3;
      size = radius * 0.7;
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
