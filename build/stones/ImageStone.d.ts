import Stone from './base';
import { ThemeContext } from '../types';
export declare class ImageStone extends Stone {
    private mod;
    private blacks;
    private whites;
    private themeContext?;
    private fallbackStone?;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, ki: number, mod: number, blacks: any, whites: any, themeContext?: ThemeContext | undefined);
    draw(): void;
    setSize(size: number): void;
}
