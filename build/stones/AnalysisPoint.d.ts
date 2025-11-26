import { AnalysisPointOptions } from '../types';
export default class AnalysisPoint {
    private ctx;
    private x;
    private y;
    private r;
    private rootInfo;
    private moveInfo;
    private policyValue?;
    private theme;
    private outlineColor?;
    constructor(options: AnalysisPointOptions);
    draw(): void;
    private drawProblemAnalysisPoint;
    private drawDefaultAnalysisPoint;
    private drawScenarioAnalysisPoint;
    private drawCandidatePoint;
}
