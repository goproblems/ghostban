import { Cursor, Theme, Ki, Analysis, GhostBanOptions, GhostBanOptionsParams, Center } from './types';
export declare class GhostBan {
    defaultOptions: GhostBanOptions;
    options: GhostBanOptions;
    dom: HTMLElement | undefined;
    canvas?: HTMLCanvasElement;
    board?: HTMLCanvasElement;
    analysisCanvas?: HTMLCanvasElement;
    cursorCanvas?: HTMLCanvasElement;
    markupCanvas?: HTMLCanvasElement;
    effectCanvas?: HTMLCanvasElement;
    moveSoundAudio?: HTMLAudioElement;
    turn: Ki;
    private cursor;
    private cursorValue;
    private touchMoving;
    private touchStartPoint;
    cursorPosition: [number, number];
    actualCursorPosition: [number, number];
    cursorPoint: DOMPoint;
    actualCursorPoint: DOMPoint;
    mat: number[][];
    markup: string[][];
    visibleAreaMat: number[][] | undefined;
    preventMoveMat: number[][];
    effectMat: string[][];
    maxhv: number;
    transMat: DOMMatrix;
    analysis: Analysis | null;
    visibleArea: number[][];
    nodeMarkupStyles: {
        [key: string]: {
            color: string;
            lineDash: number[];
        };
    };
    constructor(options?: GhostBanOptionsParams);
    setTurn(turn: Ki): void;
    setBoardSize(size: number): void;
    resize(): void;
    private createCanvas;
    init(dom: HTMLElement): void;
    setOptions(options: GhostBanOptionsParams): void;
    setMat(mat: number[][]): void;
    setVisibleAreaMat(mat: number[][]): void;
    setPreventMoveMat(mat: number[][]): void;
    setEffectMat(mat: string[][]): void;
    setMarkup(markup: string[][]): void;
    setCursor(cursor: Cursor, value?: string): void;
    setCursorWithRender: (domPoint: DOMPoint, offsetY?: number) => void;
    private onMouseMove;
    private calcTouchPoint;
    private onTouchStart;
    private onTouchMove;
    private onTouchEnd;
    renderInteractive(): void;
    setAnalysis(analysis: Analysis | null): void;
    setTheme(theme: Theme, options?: {}): void;
    calcCenter: () => Center;
    calcDynamicPadding(visibleAreaSize: number): void;
    zoomBoard(zoom?: boolean): void;
    calcBoardVisibleArea(zoom?: boolean): void;
    resetTransform(): void;
    render(): void;
    renderInOneCanvas(canvas?: HTMLCanvasElement | undefined): void;
    clearAllCanvas: () => void;
    clearBoard: () => void;
    clearCanvas: (canvas?: HTMLCanvasElement | undefined) => void;
    clearMarkupCanvas: () => void;
    clearCursorCanvas: () => void;
    clearAnalysisCanvas: () => void;
    drawAnalysis: (analysis?: Analysis | null) => void;
    drawMarkup: (mat?: number[][], markup?: string[][], markupCanvas?: HTMLCanvasElement | undefined, clear?: boolean) => void;
    drawBoard: (board?: HTMLCanvasElement | undefined, clear?: boolean) => void;
    drawBan: (board?: HTMLCanvasElement | undefined) => void;
    drawBoardLine: (board?: HTMLCanvasElement | undefined) => void;
    drawStars: (board?: HTMLCanvasElement | undefined) => void;
    drawCoordinate: () => void;
    calcSpaceAndPadding: (canvas?: HTMLCanvasElement | undefined) => {
        space: number;
        scaledPadding: number;
        scaledBoardExtent: number;
    };
    playEffect: (mat?: number[][], effectMat?: string[][], clear?: boolean) => void;
    drawCursor: () => void;
    drawStones: (mat?: number[][], canvas?: HTMLCanvasElement | undefined, clear?: boolean) => void;
}
