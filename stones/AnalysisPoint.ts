import {AnalysisPointTheme, MoveInfo, RootInfo} from '../types';
import {
  calcAnalysisPointColor,
  calcScoreDiff,
  calcScoreDiffText,
  nFormatter,
  round3,
} from '../helper';
import {
  LIGHT_GREEN_RGB,
  LIGHT_RED_RGB,
  LIGHT_YELLOW_RGB,
  YELLOW_RGB,
} from '../const';

export default class AnalysisPoint {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private r: number,
    private rootInfo: RootInfo,
    private moveInfo: MoveInfo,
    private theme: AnalysisPointTheme = AnalysisPointTheme.Default,
    private outlineColor?: string
  ) {}

  draw() {
    const {ctx, x, y, r, rootInfo, moveInfo, theme} = this;
    if (r < 0) return;

    ctx.save();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 0;

    // this.drawDefaultAnalysisPoint();
    if (theme === AnalysisPointTheme.Default) {
      this.drawDefaultAnalysisPoint();
    } else if (theme === AnalysisPointTheme.Problem) {
      this.drawProblemAnalysisPoint();
    }

    ctx.restore();
  }

  private drawProblemAnalysisPoint = () => {
    const {ctx, x, y, r, rootInfo, moveInfo, outlineColor} = this;
    const {order} = moveInfo;

    let pColor = calcAnalysisPointColor(rootInfo, moveInfo);

    if (order < 5) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      ctx.lineWidth = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0)';
      const gradient = ctx.createRadialGradient(x, y, r * 0.9, x, y, r);
      gradient.addColorStop(0, pColor);
      gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0');
      ctx.fillStyle = gradient;
      ctx.fill();
      if (outlineColor) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.lineWidth = 4;
        ctx.strokeStyle = outlineColor;
        ctx.stroke();
      }

      const fontSize = r / 1.5;

      ctx.font = `${fontSize * 0.8}px Tahoma`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';

      ctx.font = `${fontSize}px Tahoma`;
      const scoreText = calcScoreDiffText(rootInfo, moveInfo);
      ctx.fillText(scoreText, x, y);

      ctx.font = `${fontSize * 0.8}px Tahoma`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(nFormatter(moveInfo.visits), x, y + r / 2 + fontSize / 8);
    } else {
      this.drawCandidatePoint();
    }
  };

  private drawDefaultAnalysisPoint = () => {
    const {ctx, x, y, r, rootInfo, moveInfo} = this;
    const {order} = moveInfo;

    let pColor = calcAnalysisPointColor(rootInfo, moveInfo);

    if (order < 5) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      ctx.lineWidth = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0)';
      const gradient = ctx.createRadialGradient(x, y, r * 0.9, x, y, r);
      gradient.addColorStop(0, pColor);
      gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0');
      ctx.fillStyle = gradient;
      ctx.fill();

      const fontSize = r / 1.5;

      ctx.font = `${fontSize * 0.8}px Tahoma`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';

      const winrate =
        rootInfo.currentPlayer === 'B'
          ? moveInfo.winrate
          : 1 - moveInfo.winrate;

      ctx.fillText(round3(winrate, 100, 1), x, y - r / 2 + fontSize / 5);

      ctx.font = `${fontSize}px Tahoma`;
      const scoreText = calcScoreDiffText(rootInfo, moveInfo);
      ctx.fillText(scoreText, x, y + fontSize / 3);

      ctx.font = `${fontSize * 0.8}px Tahoma`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(nFormatter(moveInfo.visits), x, y + r / 2 + fontSize / 3);

      const order = moveInfo.order;
      ctx.fillText((order + 1).toString(), x + r, y - r / 2);
    } else {
      this.drawCandidatePoint();
    }
  };

  private drawCandidatePoint = () => {
    const {ctx, x, y, r, rootInfo, moveInfo} = this;
    const pColor = calcAnalysisPointColor(rootInfo, moveInfo);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, 2 * Math.PI, true);
    ctx.lineWidth = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0)';
    const gradient = ctx.createRadialGradient(x, y, r * 0.4, x, y, r);
    gradient.addColorStop(0, pColor);
    gradient.addColorStop(0.95, 'rgba(255, 255, 255, 0');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
  };
}
