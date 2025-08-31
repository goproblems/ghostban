import Stone from './base';
import {Ki, ThemeContext, ThemeConfig} from '../types';
import {DEFAULT_THEME_COLOR_CONFIG} from '../const';

export class FlatStone extends Stone {
  protected themeContext?: ThemeContext;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    ki: number,
    themeContext?: ThemeContext
  ) {
    super(ctx, x, y, ki);
    this.themeContext = themeContext;
  }

  /**
   * Get a theme property value with fallback
   */
  protected getThemeProperty<K extends keyof ThemeConfig>(
    key: K
  ): ThemeConfig[K] {
    if (!this.themeContext) {
      return DEFAULT_THEME_COLOR_CONFIG[key];
    }

    const {theme, themeOptions} = this.themeContext;
    const themeSpecific = themeOptions[theme];
    const defaultConfig = themeOptions.default;

    // Try theme-specific value first, then default
    const result = (themeSpecific?.[key] ??
      defaultConfig[key]) as ThemeConfig[K];
    return result;
  }

  draw() {
    const {ctx, x, y, size, ki, globalAlpha} = this;
    if (size <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI, true);
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.getThemeProperty('boardLineColor');
    if (ki === Ki.Black) {
      ctx.fillStyle = this.getThemeProperty('flatBlackColor');
    } else if (ki === Ki.White) {
      ctx.fillStyle = this.getThemeProperty('flatWhiteColor');
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
