import EffectBase from './EffectBase';
export declare class BanEffect extends EffectBase {
    protected ctx: CanvasRenderingContext2D;
    protected x: number;
    protected y: number;
    protected size: number;
    protected ki: number;
    private img;
    private alpha;
    private fadeInDuration;
    private fadeOutDuration;
    private stayDuration;
    private startTime;
    private isFadingOut;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ki: number);
    play: () => void;
}
