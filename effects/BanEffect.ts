import EffectBase from './EffectBase';
import {encode} from 'js-base64';

const banSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban" viewBox="0 0 16 16">
  <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>
</svg>`;

export class BanEffect extends EffectBase {
  private img = new Image();
  private alpha = 0;
  private fadeInDuration = 200;
  private fadeOutDuration = 150;
  private stayDuration = 400;
  private startTime = performance.now();

  private isFadingOut = false;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected size: number,
    protected ki: number
  ) {
    super(ctx, x, y, size, ki);

    // Convert SVG string to a data URL
    const svgBlob = new Blob([banSvg], {type: 'image/svg+xml'});

    const svgDataUrl = `data:image/svg+xml;base64,${encode(banSvg)}`;

    this.img = new Image();
    this.img.src = svgDataUrl;
  }

  play = () => {
    if (!this.img.complete) {
      return;
    }

    const {ctx, x, y, size, img, fadeInDuration, fadeOutDuration} = this;

    const now = performance.now();

    if (!this.startTime) {
      this.startTime = now;
    }

    ctx.clearRect(x - size / 2, y - size / 2, size, size);
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    ctx.globalAlpha = 1;

    const elapsed = now - this.startTime;

    if (!this.isFadingOut) {
      this.alpha = Math.min(elapsed / fadeInDuration, 1);
      if (elapsed >= fadeInDuration) {
        this.alpha = 1;
        setTimeout(() => {
          this.isFadingOut = true;
          this.startTime = performance.now();
        }, this.stayDuration);
      }
    } else {
      const fadeElapsed = now - this.startTime;
      this.alpha = Math.max(1 - fadeElapsed / fadeOutDuration, 0);
      if (fadeElapsed >= fadeOutDuration) {
        this.alpha = 0;
        ctx.clearRect(x - size / 2, y - size / 2, size, size);
        return;
      }
    }

    requestAnimationFrame(this.play);
  };
}
