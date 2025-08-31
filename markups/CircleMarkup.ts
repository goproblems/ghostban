import Markup from './MarkupBase';
import {Ki} from '../types';

export class CircleMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha, color} = this;
    const radius = s * 0.5;
    let size = radius * 0.65;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.lineWidth = this.getThemeProperty('markupLineWidth');
    ctx.setLineDash(this.lineDash);
    if (ki === Ki.White) {
      ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.Black) {
      ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
    } else {
      ctx.strokeStyle = this.getThemeProperty('boardLineColor');
      ctx.lineWidth = 3;
    }
    if (color) ctx.strokeStyle = color;
    if (size > 0) {
      ctx.arc(x, y, size, 0, 2 * Math.PI, true);
      ctx.stroke();
    }
    ctx.restore();
  }
}
