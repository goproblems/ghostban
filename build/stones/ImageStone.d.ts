import Stone from './base';
export declare class ImageStone extends Stone {
    private mod;
    private blacks;
    private whites;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, ki: number, mod: number, blacks: any, whites: any);
    draw(): void;
}
