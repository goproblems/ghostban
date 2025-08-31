import Markup from './MarkupBase';
import {Ki} from '../types';

export class CrossMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    const radius = s * 0.5;
    let size = radius * 0.5;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.globalAlpha = globalAlpha;
    if (ki === Ki.White) {
      ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.Black) {
      ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
    } else {
      ctx.strokeStyle = this.getThemeProperty('boardLineColor');
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
