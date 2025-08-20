import {Theme} from '../types';

export default class Markup {
  protected globalAlpha = 1;
  protected color = '';
  protected lineDash: number[] = [];
  protected theme?: Theme;

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number,
    protected y: number,
    protected s: number,
    protected ki: number,
    theme?: Theme,
    protected val: string | number = ''
  ) {
    this.theme = theme;
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

  protected getThemeAwareColor(lightColor: string, darkColor: string): string {
    return this.theme === Theme.Dark ? darkColor : lightColor;
  }
}
