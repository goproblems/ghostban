export default class Stone {
    protected ctx: CanvasRenderingContext2D;
    protected x: number;
    protected y: number;
    protected ki: number;
    protected globalAlpha: number;
    protected size: number;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, ki: number);
    draw(): void;
    setGlobalAlpha(alpha: number): void;
    setSize(size: number): void;
}
