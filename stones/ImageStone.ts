import Stone from './base';
import {Ki, ThemeContext} from '../types';
import {FlatStone} from './FlatStone';

export class ImageStone extends Stone {
  private fallbackStone?: FlatStone;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    ki: number,
    private mod: number,
    private blacks: any,
    private whites: any,
    private themeContext?: ThemeContext
  ) {
    super(ctx, x, y, ki);

    // Create FlatStone as fallback option
    if (themeContext) {
      this.fallbackStone = new FlatStone(ctx, x, y, ki, themeContext);
    }
  }

  draw() {
    const {ctx, x, y, size, ki, blacks, whites, mod} = this;
    if (size <= 0) return;

    let img;
    if (ki === Ki.Black) {
      img = blacks[mod % blacks.length];
    } else {
      img = whites[mod % whites.length];
    }

    // Check if image is loaded completely
    if (img && img.complete && img.naturalHeight !== 0) {
      // Image loaded, render with image
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    } else {
      // Image not loaded or load failed, use FlatStone as fallback
      if (this.fallbackStone) {
        this.fallbackStone.setSize(size);
        this.fallbackStone.draw();
      }
    }
  }

  setSize(size: number) {
    super.setSize(size);
    // Synchronously update fallbackStone size
    if (this.fallbackStone) {
      this.fallbackStone.setSize(size);
    }
  }
}
