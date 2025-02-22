export default class EffectBase {
    protected ctx: CanvasRenderingContext2D;
    protected x: number;
    protected y: number;
    protected size: number;
    protected ki: number;
    protected globalAlpha: number;
    protected color: string;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ki: number);
    play(): void;
}
