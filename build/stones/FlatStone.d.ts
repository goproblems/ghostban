import Stone from './base';
import { ThemeContext, ThemeConfig } from '../types';
export declare class FlatStone extends Stone {
    protected themeContext?: ThemeContext;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, ki: number, themeContext?: ThemeContext);
    /**
     * Get a theme property value with fallback
     */
    protected getThemeProperty<K extends keyof ThemeConfig>(key: K): ThemeConfig[K];
    draw(): void;
}
