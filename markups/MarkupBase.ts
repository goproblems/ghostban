import {Ki, ThemeContext, ThemeConfig} from '../types';
import {BASE_THEME_CONFIG} from '../const';

export default class Markup {
  protected globalAlpha = 1;
  protected color = '';
  protected lineDash: number[] = [];
  protected themeContext?: ThemeContext;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected s: number,
    protected ki: number,
    themeContext?: ThemeContext,
    protected val: string | number = ''
  ) {
    this.themeContext = themeContext;
  }

  draw() {
    console.log('TBD');
  }

  setGlobalAlpha(alpha: number) {
    this.globalAlpha = alpha;
  }

  setColor(color: string) {
    this.color = color;
  }

  setLineDash(lineDash: number[]) {
    this.lineDash = lineDash;
  }

  /**
   * Get a theme property value with fallback
   */
  protected getThemeProperty<K extends keyof ThemeConfig>(
    key: K
  ): ThemeConfig[K] {
    if (!this.themeContext) {
      console.log(`[DEBUG] No theme context for key: ${key}, using default`);
      return BASE_THEME_CONFIG[key];
    }

    const {theme, themeOptions} = this.themeContext;
    const themeSpecific = themeOptions[theme];
    const defaultConfig = themeOptions.default;

    // Try theme-specific value first, then default
    const result = (themeSpecific?.[key] ??
      defaultConfig[key]) as ThemeConfig[K];
    console.log(`[DEBUG] Result for ${key}:`, result);
    return result;
  }
}
