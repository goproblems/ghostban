import Markup from './MarkupBase';
import {Ki} from '../types';

export class TextMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, val, globalAlpha} = this;
    const size = s * 0.8;
    let fontSize = size / 1.5;
    ctx.save();
    ctx.globalAlpha = globalAlpha;

    if (ki === Ki.White) {
      ctx.fillStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.Black) {
      ctx.fillStyle = this.getThemeProperty('flatWhiteColor');
    } else {
      ctx.fillStyle = this.getThemeProperty('boardLineColor');
    }
    // else {
    //   ctx.clearRect(x - size / 2, y - size / 2, size, size);
    // }
    if (val.toString().length === 1) {
      fontSize = size / 1.5;
    } else if (val.toString().length === 2) {
      fontSize = size / 1.8;
    } else {
      fontSize = size / 2.0;
    }
    ctx.font = `bold ${fontSize}px Tahoma`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(val.toString(), x, y + 2);
    ctx.restore();
  }
}
