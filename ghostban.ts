import {compact} from 'lodash-es';
import {calcVisibleArea, reverseOffset, zeros, empty, a1ToPos} from './helper';
import {A1_LETTERS, A1_NUMBERS, RESOURCES} from './const';
import {
  Center,
  Cursor,
  Markup,
  Theme,
  Ki,
  Analysis,
  GhostBanOptions,
  GhostBanOptionsParams,
} from './types';

import {ImageStone, ColorStone} from './stones';
import AnalysisPoint from './stones/AnalysisPoint';
// import {create, meanDependencies, stdDependencies} from 'mathjs';

// const config = {};
// const {std, mean} = create({meanDependencies, stdDependencies}, config);

import {
  CircleMarkup,
  CrossMarkup,
  TextMarkup,
  SquareMarkup,
  TriangleMarkup,
  NodeMarkup,
  PositiveNodeMarkup,
} from './markups';

// const devicePixelRatio = window.devicePixelRatio;
let devicePixelRatio = 1.0;
if (typeof window !== 'undefined') {
  devicePixelRatio = window.devicePixelRatio;
  // browser code
}

const images: {
  [key: string]: HTMLImageElement;
} = {};

function preload(urls: string[], done: () => void) {
  let loaded = 0;
  const imageLoaded = () => {
    loaded++;
    if (loaded === urls.length) {
      done();
    }
  };
  for (let i = 0; i < urls.length; i++) {
    if (!images[urls[i]]) {
      images[urls[i]] = new Image();
      images[urls[i]].src = urls[i];
      images[urls[i]].onload = function () {
        imageLoaded();
      };
      images[urls[i]].onerror = function () {
        imageLoaded();
      };
    }
  }
}

export class GhostBan {
  defaultOptions: GhostBanOptions = {
    boardSize: 19,
    padding: 10,
    extend: 3,
    interactive: false,
    coordinate: true,
    theme: Theme.BlackAndWhite,
    background: false,
    showAnalysis: false,
    themeFlatBoardColor: '#ECB55A',
    positiveNodeColor: '#28a745',
    negativeNodeColor: '#dc3545',
    neutralNodeColor: '#ffc107',
    defaultNodeColor: '#6c757d',
  };
  options: GhostBanOptions;
  dom: HTMLElement | undefined;
  canvas?: HTMLCanvasElement;
  board?: HTMLCanvasElement;
  analysisCanvas?: HTMLCanvasElement;
  cursorCanvas?: HTMLCanvasElement;
  markupCanvas?: HTMLCanvasElement;
  turn: Ki;
  private cursor: Cursor = Cursor.None;
  private cursorValue: string = '';
  public cursorPosition: [number, number];
  public cursorPoint: DOMPoint = new DOMPoint();
  public mat: number[][];
  public markup: string[][];
  maxhv: number;
  transMat: DOMMatrix;
  analysis: Analysis | null;
  visibleArea: number[][];

  constructor(options: GhostBanOptionsParams = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    this.mat = zeros([19, 19]);
    this.markup = empty([19, 19]);
    this.turn = Ki.Black;
    this.cursorPosition = [18, 0];
    this.maxhv = this.options.boardSize;
    this.transMat = new DOMMatrix();
    this.analysis = null;
    this.visibleArea = [
      [0, 18],
      [0, 18],
    ];
  }

  setTurn(turn: Ki) {
    this.turn = turn;
  }

  resize() {
    if (
      !this.canvas ||
      !this.cursorCanvas ||
      !this.dom ||
      !this.board ||
      !this.markupCanvas ||
      !this.analysisCanvas
    )
      return;
    const {board, canvas, markupCanvas, cursorCanvas, analysisCanvas} = this;
    const {size, zoom} = this.options;
    if (size) {
      board.width = size * devicePixelRatio;
      board.height = size * devicePixelRatio;
      canvas.width = size * devicePixelRatio;
      canvas.height = size * devicePixelRatio;
      markupCanvas.width = size * devicePixelRatio;
      markupCanvas.height = size * devicePixelRatio;
      cursorCanvas.width = size * devicePixelRatio;
      cursorCanvas.height = size * devicePixelRatio;
      analysisCanvas.width = size * devicePixelRatio;
      analysisCanvas.height = size * devicePixelRatio;
    } else {
      const {clientWidth} = this.dom;
      board.style.width = clientWidth + 'px';
      board.style.height = clientWidth + 'px';
      board.width = Math.floor(clientWidth * devicePixelRatio);
      board.height = Math.floor(clientWidth * devicePixelRatio);
      canvas.style.width = clientWidth + 'px';
      canvas.style.height = clientWidth + 'px';
      canvas.width = Math.floor(clientWidth * devicePixelRatio);
      canvas.height = Math.floor(clientWidth * devicePixelRatio);
      markupCanvas.style.width = clientWidth + 'px';
      markupCanvas.style.height = clientWidth + 'px';
      markupCanvas.width = Math.floor(clientWidth * devicePixelRatio);
      markupCanvas.height = Math.floor(clientWidth * devicePixelRatio);
      cursorCanvas.style.width = clientWidth + 'px';
      cursorCanvas.style.height = clientWidth + 'px';
      cursorCanvas.width = Math.floor(clientWidth * devicePixelRatio);
      cursorCanvas.height = Math.floor(clientWidth * devicePixelRatio);
      analysisCanvas.style.width = clientWidth + 'px';
      analysisCanvas.style.height = clientWidth + 'px';
      analysisCanvas.width = Math.floor(clientWidth * devicePixelRatio);
      analysisCanvas.height = Math.floor(clientWidth * devicePixelRatio);
    }
    this.calcBoardVisibleArea(zoom || false);
    this.render();
  }

  init(dom: HTMLElement) {
    this.mat = zeros([19, 19]);
    this.markup = empty([19, 19]);
    this.transMat = new DOMMatrix();

    const board = document.createElement('canvas');
    board.style.position = 'absolute';
    board.id = 'ghostban-board';
    this.board = board;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.id = 'ghostban-canvas';
    this.canvas = canvas;

    const markupCanvas = document.createElement('canvas');
    markupCanvas.style.position = 'absolute';
    markupCanvas.id = 'ghostban-markup';
    markupCanvas.style.pointerEvents = 'none';
    this.markupCanvas = markupCanvas;

    const cursorCanvas = document.createElement('canvas');
    cursorCanvas.style.position = 'absolute';
    cursorCanvas.id = 'ghostban-cursor';
    this.cursorCanvas = cursorCanvas;

    const analysisCanvas = document.createElement('canvas');
    analysisCanvas.style.position = 'absolute';
    analysisCanvas.style.pointerEvents = 'none';
    analysisCanvas.id = 'ghostban-analysis';
    this.analysisCanvas = analysisCanvas;

    this.dom = dom;

    dom.firstChild?.remove();
    dom.firstChild?.remove();
    dom.firstChild?.remove();
    dom.firstChild?.remove();
    dom.firstChild?.remove();

    dom.appendChild(board);
    dom.appendChild(canvas);
    dom.appendChild(markupCanvas);
    dom.appendChild(analysisCanvas);
    dom.appendChild(cursorCanvas);

    this.resize();
    this.renderInteractive();
  }

  setOptions(options: GhostBanOptionsParams) {
    this.options = {...this.options, ...options};
  }

  setMat(mat: number[][]) {
    this.mat = mat;
  }

  setMarkup(markup: string[][]) {
    this.markup = markup;
  }

  setCursor(cursor: Cursor, value = '') {
    this.cursor = cursor;
    this.cursorValue = value;
  }

  renderInteractive() {
    const canvas = this.cursorCanvas;
    if (!canvas) return;
    const {padding} = this.options;

    const setCursorWithRender = (domPoint: DOMPoint) => {
      // space need recalculate every time
      const {space} = this.calcSpaceAndPadding();
      const point = this.transMat.inverse().transformPoint(domPoint);
      const idx = Math.round((point.x - padding + space / 2) / space);
      const idy = Math.round((point.y - padding + space / 2) / space);
      const xx = idx * space;
      const yy = idy * space;
      const p = this.transMat.transformPoint(new DOMPoint(xx, yy));
      this.cursorPoint = p;
      this.cursorPosition = [idx - 1, idy - 1];
      this.drawCursor();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touches = e.changedTouches;
      const point = new DOMPoint(
        (touches[0].clientX - rect.left) * devicePixelRatio,
        (touches[0].clientY - rect.top) * devicePixelRatio
      );
      setCursorWithRender(point);
    };
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const point = new DOMPoint(
        e.offsetX * devicePixelRatio,
        e.offsetY * devicePixelRatio
      );
      setCursorWithRender(point);
    };

    if (this.options.interactive) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('touchmove', onTouchMove);
      canvas.addEventListener('mouseout', onMouseMove);
    } else {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mouseout', onMouseMove);
    }
  }

  setAnalysis(analysis: Analysis | null) {
    this.analysis = analysis;
    if (!analysis) {
      this.clearAnalysisCanvas();
      return;
    }
    if (this.options.showAnalysis) this.drawAnalysis(analysis);
  }

  setTheme(theme: Theme, options = {}) {
    if (!RESOURCES[theme]) return;
    const {board, blacks, whites} = RESOURCES[theme];
    this.options.theme = theme;
    this.options = {
      ...this.options,
      theme,
      ...options,
    };
    preload(compact([board, ...blacks, ...whites]), () => {
      this.drawBoard();
      this.render();
    });
    this.drawBoard();
    this.render();
  }

  calcBoardVisibleArea(zoom: boolean) {
    const {canvas, analysisCanvas, board, cursorCanvas, markupCanvas} = this;
    const {boardSize, extend} = this.options;
    const {visibleArea: zoomedVisibleArea, center} = calcVisibleArea(
      this.mat,
      boardSize,
      extend
    );
    const ctx = canvas?.getContext('2d');
    const boardCtx = board?.getContext('2d');
    const cursorCtx = cursorCanvas?.getContext('2d');
    const markupCtx = markupCanvas?.getContext('2d');
    const analysisCtx = analysisCanvas?.getContext('2d');
    const visibleArea = zoom
      ? zoomedVisibleArea
      : [
          [0, 18],
          [0, 18],
        ];

    this.visibleArea = visibleArea;

    if (zoom) {
      const {space} = this.calcSpaceAndPadding();
      const zoomedBoardSize = visibleArea[0][1] - visibleArea[0][0] + 1;
      if (zoomedBoardSize < boardSize) {
        const scale = 1 / (zoomedBoardSize / boardSize);

        let offsetX = 0;
        let offsetY = 0;

        // const offset = this.options.padding;
        const offset = this.options.padding * scale;
        switch (center) {
          case Center.TopLeft:
            break;
          case Center.TopRight:
            offsetX = visibleArea[0][0] * space * scale + offset;
            break;
          case Center.BottomLeft:
            offsetY = visibleArea[1][0] * space * scale + offset;
            break;
          case Center.BottomRight:
            offsetX = visibleArea[0][0] * space * scale + offset;
            offsetY = visibleArea[1][0] * space * scale + offset;
            break;
        }
        this.transMat = new DOMMatrix();
        this.transMat.translateSelf(-offsetX, -offsetY);
        this.transMat.scaleSelf(scale, scale);
        ctx?.setTransform(this.transMat);
        boardCtx?.setTransform(this.transMat);
        analysisCtx?.setTransform(this.transMat);
        cursorCtx?.setTransform(this.transMat);
        markupCtx?.setTransform(this.transMat);
      } else {
        this.resetTransform();
      }
    } else {
      this.resetTransform();
    }
  }

  resetTransform() {
    const {canvas, analysisCanvas, board, cursorCanvas, markupCanvas} = this;
    const ctx = canvas?.getContext('2d');
    const boardCtx = board?.getContext('2d');
    const cursorCtx = cursorCanvas?.getContext('2d');
    const markupCtx = markupCanvas?.getContext('2d');
    const analysisCtx = analysisCanvas?.getContext('2d');
    this.transMat = new DOMMatrix();
    ctx?.resetTransform();
    boardCtx?.resetTransform();
    analysisCtx?.resetTransform();
    cursorCtx?.resetTransform();
    markupCtx?.resetTransform();
  }

  render() {
    this.clearAllCanvas();
    this.drawBoard();
    this.drawStones();
    this.drawMarkup();
    if (this.options.showAnalysis) this.drawAnalysis();
  }

  renderInOneCanvas(canvas = this.canvas) {
    this.clearAllCanvas();
    this.drawBoard(canvas, false);
    this.drawStones(this.mat, canvas, false);
    this.drawMarkup(this.mat, this.markup, canvas, false);
  }

  clearAllCanvas = () => {
    this.clearCanvas(this.board);
    this.clearCanvas();
    this.clearCanvas(this.markupCanvas);
    this.clearCursorCanvas();
    this.clearAnalysisCanvas();
  };

  clearBoard = () => {
    if (!this.board) return;
    const ctx = this.board.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Will always clear the right space
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
  };

  clearCanvas = (canvas = this.canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };

  clearMarkupCanvas = () => {
    if (!this.markupCanvas) return;
    const ctx = this.markupCanvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.markupCanvas.width, this.markupCanvas.height);
      ctx.restore();
    }
  };

  clearCursorCanvas = () => {
    if (!this.cursorCanvas) return;
    const ctx = this.cursorCanvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
      ctx.restore();
    }
  };

  clearAnalysisCanvas = () => {
    if (!this.analysisCanvas) return;
    const ctx = this.analysisCanvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(
        0,
        0,
        this.analysisCanvas.width,
        this.analysisCanvas.height
      );
      ctx.restore();
    }
  };

  drawAnalysis = (analysis = this.analysis) => {
    const canvas = this.analysisCanvas;
    const {theme = Theme.BlackAndWhite} = this.options;
    if (!canvas || !analysis) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.clearAnalysisCanvas();
    const {rootInfo} = analysis;

    analysis.moveInfos.forEach(m => {
      if (m.move === 'pass') return;
      const idObj = JSON.parse(analysis.id);
      const {x: ox, y: oy} = reverseOffset(this.mat, idObj.bx, idObj.by);
      let {x: i, y: j} = a1ToPos(m.move);
      i += ox;
      j += oy;
      if (this.mat[i][j] !== 0) return;
      const {space, scaledPadding} = this.calcSpaceAndPadding();
      const x = scaledPadding + i * space;
      const y = scaledPadding + j * space;
      const ratio = 0.46;
      ctx.save();
      if (
        theme !== Theme.Subdued &&
        theme !== Theme.BlackAndWhite &&
        theme !== Theme.Flat
      ) {
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowColor = '#555';
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 0;
      }
      const point = new AnalysisPoint(ctx, x, y, space * ratio, rootInfo, m);
      point.draw();
      ctx.restore();
    });
  };

  drawMarkup = (
    mat = this.mat,
    markup = this.markup,
    markupCanvas = this.markupCanvas,
    clear = true
  ) => {
    const canvas = markupCanvas;
    if (canvas) {
      if (clear) this.clearCanvas(canvas);
      for (let i = 0; i < markup.length; i++) {
        for (let j = 0; j < markup[i].length; j++) {
          const values = markup[i][j];
          values.split('|').forEach(value => {
            if (value !== null && value !== '') {
              const {space, scaledPadding} = this.calcSpaceAndPadding();
              const x = scaledPadding + i * space;
              const y = scaledPadding + j * space;
              const ki = mat[i][j];
              let markup;
              const ctx = canvas.getContext('2d');

              if (ctx) {
                switch (value) {
                  case Markup.Circle:
                  case Markup.Current: {
                    markup = new CircleMarkup(ctx, x, y, space, ki);
                    break;
                  }
                  case Markup.PositiveNode: {
                    markup = new PositiveNodeMarkup(
                      ctx,
                      x,
                      y,
                      space,
                      ki,
                      Markup.Circle
                    );
                    markup.setColor(this.options.positiveNodeColor);
                    break;
                  }
                  case Markup.NegativeNode:
                  case Markup.NeutralNode:
                  case Markup.Node: {
                    let color = this.options.defaultNodeColor;
                    if (value === Markup.NegativeNode) {
                      color = this.options.negativeNodeColor;
                    } else if (value === Markup.NeutralNode) {
                      color = this.options.neutralNodeColor;
                    }

                    markup = new NodeMarkup(
                      ctx,
                      x,
                      y,
                      space,
                      ki,
                      Markup.Circle
                    );
                    markup.setColor(color);
                    break;
                  }
                  case Markup.Square: {
                    markup = new SquareMarkup(ctx, x, y, space, ki);
                    break;
                  }
                  case Markup.Triangle: {
                    markup = new TriangleMarkup(ctx, x, y, space, ki);
                    break;
                  }
                  case Markup.Cross: {
                    markup = new CrossMarkup(ctx, x, y, space, ki);
                    break;
                  }
                  default: {
                    if (value !== '') {
                      markup = new TextMarkup(ctx, x, y, space, ki, value);
                    }
                    break;
                  }
                }
                markup?.draw();
              }
            }
          });
        }
      }
    }
  };

  drawBoard = (board = this.board, clear = true) => {
    if (clear) this.clearCanvas(board);
    this.drawBan(board);
    this.drawBoardLine(board);
    this.drawStars(board);
    if (this.options.coordinate) {
      this.drawCoordinate();
    }
  };

  drawBan = (board = this.board) => {
    const {theme} = this.options;
    if (board) {
      board.style.borderRadius = '2px';
      const ctx = board.getContext('2d');
      if (ctx) {
        if (theme === Theme.BlackAndWhite) {
          board.style.boxShadow = '0px 0px 0px #000000';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, board.width, board.height);
        } else if (theme === Theme.Flat) {
          ctx.fillStyle = this.options.themeFlatBoardColor;
          ctx.fillRect(0, 0, board.width, board.height);
        } else if (
          theme === Theme.Walnut &&
          RESOURCES[theme].board !== undefined
        ) {
          const boardUrl = RESOURCES[theme].board || '';
          const boardRes = images[boardUrl];
          if (boardRes) {
            ctx.drawImage(boardRes, 0, 0, board.width, board.height);
          }
        } else {
          const boardUrl = RESOURCES[theme].board || '';
          const image = images[boardUrl];
          if (image) {
            const pattern = ctx.createPattern(image, 'repeat');
            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.fillRect(0, 0, board.width, board.height);
            }
          }
        }
      }
    }
  };

  drawBoardLine = (board = this.board) => {
    if (!board) return;

    const {visibleArea} = this;
    const ctx = board.getContext('2d');
    if (ctx) {
      const {space, scaledPadding} = this.calcSpaceAndPadding();

      ctx.lineWidth = 1 * devicePixelRatio;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      for (let i = visibleArea[0][0]; i <= visibleArea[0][1]; i++) {
        ctx.moveTo(
          i * space + scaledPadding,
          scaledPadding + visibleArea[1][0] * space
        );
        ctx.lineTo(
          i * space + scaledPadding,
          space * visibleArea[1][1] + scaledPadding
        );
      }
      for (let i = visibleArea[1][0]; i <= visibleArea[1][1]; i++) {
        ctx.moveTo(
          visibleArea[0][0] * space + scaledPadding,
          i * space + scaledPadding
        );
        ctx.lineTo(
          visibleArea[0][1] * space + scaledPadding,
          i * space + scaledPadding
        );
      }
      ctx.stroke();
    }
  };

  drawStars = (board = this.board) => {
    if (!board) return;

    const visibleArea = this.visibleArea;
    const ctx = board.getContext('2d');
    if (ctx) {
      const {space, scaledPadding} = this.calcSpaceAndPadding();
      // Drawing star
      ctx.stroke();
      [3, 9, 15].forEach(i => {
        [3, 9, 15].forEach(j => {
          if (
            i > visibleArea[0][0] &&
            i < visibleArea[0][1] &&
            j > visibleArea[1][0] &&
            j < visibleArea[1][1]
          ) {
            ctx.beginPath();
            ctx.arc(
              i * space + scaledPadding,
              j * space + scaledPadding,
              3 * devicePixelRatio,
              0,
              2 * Math.PI,
              true
            );
            ctx.fillStyle = 'black';
            ctx.fill();
          }
        });
      });
    }
  };

  drawCoordinate = (
    visibleArea = [
      [0, 18],
      [0, 18],
    ]
  ) => {
    const board = this.board;
    if (!board) return;
    const ctx = board.getContext('2d');
    const {space, scaledPadding} = this.calcSpaceAndPadding();
    if (ctx) {
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${space / 2.8}px Helvetica`;

      const offset = space / 3;
      A1_LETTERS.forEach((l, index) => {
        const x = space * index + scaledPadding;
        if (index >= visibleArea[0][0] && index <= visibleArea[0][1]) {
          ctx.fillText(l, x, 0 + offset);
          ctx.fillText(l, x, board.height - offset);
        }
      });
      A1_NUMBERS.forEach((l: number, index) => {
        const y = space * index + scaledPadding;
        if (index >= visibleArea[1][0] && index <= visibleArea[1][1]) {
          ctx.fillText(l.toString(), offset, y);
          ctx.fillText(l.toString(), board.width - offset, y);
        }
      });
    }
  };

  calcSpaceAndPadding = (canvas = this.canvas) => {
    let space = 0;
    let scaledPadding = 0;
    if (canvas) {
      const {padding, boardSize} = this.options;
      scaledPadding = padding;
      space = (canvas.width - padding * 2) / boardSize;
      scaledPadding = scaledPadding + space / 2;
    }
    return {space, scaledPadding};
  };

  drawCursor = () => {
    const canvas = this.cursorCanvas;
    if (canvas) {
      this.clearCursorCanvas();
      if (this.cursor === Cursor.None) return;
      const {padding} = this.options;
      const ctx = canvas.getContext('2d');
      const {space} = this.calcSpaceAndPadding();
      const {visibleArea, cursor, cursorValue} = this;

      const [idx, idy] = this.cursorPosition;
      if (idx < visibleArea[0][0] || idx > visibleArea[0][1]) return;
      if (idy < visibleArea[1][0] || idy > visibleArea[1][1]) return;
      // if (this.mat[idx][idy] !== Ki.Empty) return;
      const x = idx * space + space / 2 + padding;
      const y = idy * space + space / 2 + padding;
      const ki = this.mat[idx][idy];

      if (ctx) {
        let cur;
        const size = space * 0.8;
        if (cursor === Cursor.Circle) {
          cur = new CircleMarkup(ctx, x, y, space, ki);
          cur.setGlobalAlpha(0.8);
        } else if (cursor === Cursor.Square) {
          cur = new SquareMarkup(ctx, x, y, space, ki);
          cur.setGlobalAlpha(0.8);
        } else if (cursor === Cursor.Triangle) {
          cur = new TriangleMarkup(ctx, x, y, space, ki);
          cur.setGlobalAlpha(0.8);
        } else if (cursor === Cursor.Cross) {
          cur = new CrossMarkup(ctx, x, y, space, ki);
          cur.setGlobalAlpha(0.8);
        } else if (cursor === Cursor.Text) {
          cur = new TextMarkup(ctx, x, y, space, ki, cursorValue);
          cur.setGlobalAlpha(0.8);
        } else if (ki === Ki.Empty && cursor === Cursor.BlackStone) {
          cur = new ColorStone(ctx, x, y, Ki.Black);
          cur.setSize(size);
          cur.setGlobalAlpha(0.5);
        } else if (ki === Ki.Empty && cursor === Cursor.WhiteStone) {
          cur = new ColorStone(ctx, x, y, Ki.White);
          cur.setSize(size);
          cur.setGlobalAlpha(0.5);
        } else if (cursor === Cursor.Clear) {
          cur = new ColorStone(ctx, x, y, Ki.Empty);
          cur.setSize(size);
        }
        cur?.draw();
      }
    }
  };

  drawStones = (
    mat: number[][] = this.mat,
    canvas = this.canvas,
    clear = true
  ) => {
    const {theme = Theme.BlackAndWhite} = this.options;
    if (clear) this.clearCanvas();
    if (canvas) {
      for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
          const value = mat[i][j];
          if (value !== 0) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const {space, scaledPadding} = this.calcSpaceAndPadding();
              const x = scaledPadding + i * space;
              const y = scaledPadding + j * space;

              const ratio = 0.45;
              ctx.save();
              if (
                theme !== Theme.Subdued &&
                theme !== Theme.BlackAndWhite &&
                theme !== Theme.Flat
              ) {
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowColor = '#555';
                ctx.shadowBlur = 8;
              } else {
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
              }
              let stone;
              switch (theme) {
                case Theme.BlackAndWhite:
                case Theme.Flat: {
                  stone = new ColorStone(ctx, x, y, value);
                  stone.setSize(space * ratio * 2);
                  break;
                }
                default: {
                  const blacks = RESOURCES[theme].blacks.map(i => images[i]);
                  const whites = RESOURCES[theme].whites.map(i => images[i]);
                  const mod = i + 10 + j;
                  stone = new ImageStone(ctx, x, y, value, mod, blacks, whites);
                  stone.setSize(space * ratio * 2);
                }
              }
              stone.draw();
              ctx.restore();
            }
          }
        }
      }
    }
  };
}
