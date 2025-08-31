import Markup from './MarkupBase';
import {Ki} from '../types';

export class SquareMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = this.getThemeProperty('markupLineWidth');
    ctx.globalAlpha = globalAlpha;
    let size = s * 0.55;
    if (ki === Ki.White) {
      ctx.strokeStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.Black) {
      ctx.strokeStyle = this.getThemeProperty('flatWhiteColor');
    } else {
      ctx.strokeStyle = this.getThemeProperty('boardLineColor');
      ctx.lineWidth = 3;
    }
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.stroke();
    ctx.restore();
  }
}
