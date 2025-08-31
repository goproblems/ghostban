import Markup from './MarkupBase';
import {Ki} from '../types';

export class HighlightMarkup extends Markup {
  draw() {
    const {ctx, x, y, s, ki, globalAlpha} = this;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = this.getThemeProperty('markupLineWidth');
    ctx.globalAlpha = 0.6;
    let size = s * 0.4;
    ctx.fillStyle = this.getThemeProperty('highlightColor');
    if (ki === Ki.White || ki === Ki.Black) {
      size = s * 0.35;
    }
    ctx.arc(x, y, size, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.restore();
  }
}
