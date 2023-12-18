import Stone from './base';

export class ImageStone extends Stone {
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    ki: number,
    private mod: number,
    private blacks: any,
    private whites: any
  ) {
    super(ctx, x, y, ki);
  }

  draw() {
    const {ctx, x, y, size, ki, blacks, whites, mod} = this;
    if (size <= 0) return;
    let img;
    if (ki === 1) {
      img = blacks[mod % blacks.length];
    } else {
      img = whites[mod % whites.length];
    }
    if (img) {
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    }
  }
}
