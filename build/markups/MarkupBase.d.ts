import { ThemeContext, ThemeConfig } from '../types';
export default class Markup {
    protected ctx: CanvasRenderingContext2D;
    protected x: number;
    protected y: number;
    protected s: number;
    protected ki: number;
    protected val: string | number;
    protected globalAlpha: number;
    protected color: string;
    protected lineDash: number[];
    protected themeContext?: ThemeContext;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, ki: number, themeContext?: ThemeContext, val?: string | number);
    draw(): void;
    setGlobalAlpha(alpha: number): void;
    setColor(color: string): void;
    setLineDash(lineDash: number[]): void;
    /**
     * Get a theme property value with fallback
     */
    protected getThemeProperty<K extends keyof ThemeConfig>(key: K): ThemeConfig[K];
}
