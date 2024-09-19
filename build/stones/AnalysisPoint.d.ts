import { AnalysisPointTheme, MoveInfo, RootInfo } from '../types';
export default class AnalysisPoint {
    private ctx;
    private x;
    private y;
    private r;
    private rootInfo;
    private moveInfo;
    private theme;
    private outlineColor?;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rootInfo: RootInfo, moveInfo: MoveInfo, theme?: AnalysisPointTheme, outlineColor?: string | undefined);
    draw(): void;
    private drawProblemAnalysisPoint;
    private drawDefaultAnalysisPoint;
    private drawCandidatePoint;
}
