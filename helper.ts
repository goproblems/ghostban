import TreeModel from 'tree-model';
import {
  cloneDeep,
  flattenDepth,
  clone,
  sum,
  filter,
  findLastIndex,
  compact,
  sample,
} from 'lodash-es';
import {SgfNode, SgfNodeOptions} from './core/types';
import {A1_LETTERS, A1_NUMBERS, SGF_LETTERS} from './const';
import {
  SetupProp,
  MoveProp,
  CustomProp,
  SgfPropBase,
  NodeAnnotationProp,
  RootProp,
} from './core/props';
import {
  Analysis,
  GhostBanOptions,
  Ki,
  MoveInfo,
  ProblemAnswerType as PAT,
  RootInfo,
  Markup,
} from './types';
import sha256 from 'crypto-js/sha256';

import {Center} from './types';

export const calcDoubtfulMovesThresholdRange = (threshold: number) => {
  // 8D-9D
  if (threshold >= 25) {
    return {
      evil: {winrateRange: [-1, -0.15], scoreRange: [-100, -3]},
      bad: {winrateRange: [-0.15, -0.1], scoreRange: [-3, -2]},
      poor: {winrateRange: [-0.1, -0.05], scoreRange: [-2, -1]},
      ok: {winrateRange: [-0.05, -0.02], scoreRange: [-1, -0.5]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  // 5D-7D
  if (threshold >= 23 && threshold < 25) {
    return {
      evil: {winrateRange: [-1, -0.2], scoreRange: [-100, -8]},
      bad: {winrateRange: [-0.2, -0.15], scoreRange: [-8, -4]},
      poor: {winrateRange: [-0.15, -0.05], scoreRange: [-4, -2]},
      ok: {winrateRange: [-0.05, -0.02], scoreRange: [-2, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }

  // 3D-5D
  if (threshold >= 20 && threshold < 23) {
    return {
      evil: {winrateRange: [-1, -0.25], scoreRange: [-100, -12]},
      bad: {winrateRange: [-0.25, -0.1], scoreRange: [-12, -5]},
      poor: {winrateRange: [-0.1, -0.05], scoreRange: [-5, -2]},
      ok: {winrateRange: [-0.05, -0.02], scoreRange: [-2, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  // 1D-3D
  if (threshold >= 18 && threshold < 20) {
    return {
      evil: {winrateRange: [-1, -0.3], scoreRange: [-100, -15]},
      bad: {winrateRange: [-0.3, -0.1], scoreRange: [-15, -7]},
      poor: {winrateRange: [-0.1, -0.05], scoreRange: [-7, -5]},
      ok: {winrateRange: [-0.05, -0.02], scoreRange: [-5, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  // 5K-1K
  if (threshold >= 13 && threshold < 18) {
    return {
      evil: {winrateRange: [-1, -0.35], scoreRange: [-100, -20]},
      bad: {winrateRange: [-0.35, -0.12], scoreRange: [-20, -10]},
      poor: {winrateRange: [-0.12, -0.08], scoreRange: [-10, -5]},
      ok: {winrateRange: [-0.08, -0.02], scoreRange: [-5, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  // 5K-10K
  if (threshold >= 8 && threshold < 13) {
    return {
      evil: {winrateRange: [-1, -0.4], scoreRange: [-100, -25]},
      bad: {winrateRange: [-0.4, -0.15], scoreRange: [-25, -10]},
      poor: {winrateRange: [-0.15, -0.1], scoreRange: [-10, -5]},
      ok: {winrateRange: [-0.1, -0.02], scoreRange: [-5, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  // 18K-10K
  if (threshold >= 0 && threshold < 8) {
    return {
      evil: {winrateRange: [-1, -0.45], scoreRange: [-100, -35]},
      bad: {winrateRange: [-0.45, -0.2], scoreRange: [-35, -20]},
      poor: {winrateRange: [-0.2, -0.1], scoreRange: [-20, -10]},
      ok: {winrateRange: [-0.1, -0.02], scoreRange: [-10, -1]},
      good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
      great: {winrateRange: [0, 1], scoreRange: [0, 100]},
    };
  }
  return {
    evil: {winrateRange: [-1, -0.3], scoreRange: [-100, -30]},
    bad: {winrateRange: [-0.3, -0.2], scoreRange: [-30, -20]},
    poor: {winrateRange: [-0.2, -0.1], scoreRange: [-20, -10]},
    ok: {winrateRange: [-0.1, -0.02], scoreRange: [-10, -1]},
    good: {winrateRange: [-0.02, 0], scoreRange: [0, 100]},
    great: {winrateRange: [0, 1], scoreRange: [0, 100]},
  };
};

export const round2 = (v: number, scale = 1, fixed = 2) => {
  return ((Math.round(v * 100) / 100) * scale).toFixed(fixed);
};

export const round3 = (v: number, scale = 1, fixed = 3) => {
  return ((Math.round(v * 1000) / 1000) * scale).toFixed(fixed);
};

export const getDeduplicatedProps = (targetProps: SgfPropBase[]) => {
  return filter(
    targetProps,
    (prop: SgfPropBase, index: number) =>
      index ===
      findLastIndex(
        targetProps,
        (lastPro: SgfPropBase) =>
          prop.token === lastPro.token && prop.value === lastPro.value
      )
  );
};

export const isMoveNode = (n: TreeModel.Node<SgfNode>) => {
  return n.model.moveProps.length > 0;
};

export const isRooNode = (n: TreeModel.Node<SgfNode>) => {
  return n.model.moveProps.length > 0;
};

export const isSetupNode = (n: TreeModel.Node<SgfNode>) => {
  return n.model.setupProps.length > 0;
};

export const isAnswerNode = (n: TreeModel.Node<SgfNode>, kind: PAT) => {
  const pat = n.model.customProps?.find((p: CustomProp) => p.token === 'PAT');
  return pat?.value === kind;
};

export const isRightLeaf = (n: TreeModel.Node<SgfNode>) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return c?.value.includes('RIGHT');
};

export const isVariantLeaf = (n: TreeModel.Node<SgfNode>) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return c?.value.includes('VARIANT');
};

export const isWrongLeaf = (n: TreeModel.Node<SgfNode>) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return (!c?.value.includes('VARIANT') && !c?.value.includes('RIGHT')) || !c;
};

export const inRightPath = (node: TreeModel.Node<SgfNode>) => {
  const rightLeaves = node.all((n: TreeModel.Node<SgfNode>) => isRightLeaf(n));
  return rightLeaves.length > 0;
};

export const inVariantPath = (node: TreeModel.Node<SgfNode>) => {
  const variantLeaves = node.all((n: TreeModel.Node<SgfNode>) =>
    isVariantLeaf(n)
  );
  return variantLeaves.length > 0;
};

export const inWrongPath = (node: TreeModel.Node<SgfNode>) => {
  const wrongLeaves = node.all((n: TreeModel.Node<SgfNode>) => isWrongLeaf(n));
  return wrongLeaves.length > 0;
};

export const getNodeNumber = (
  n: TreeModel.Node<SgfNode>,
  parent?: TreeModel.Node<SgfNode>
) => {
  const path = n.getPath();
  let movesCount = path.filter(n => isMoveNode(n)).length;
  if (parent) {
    movesCount += parent.getPath().filter(n => isMoveNode(n)).length;
  }
  return movesCount;
};

export const calcSHA = (
  node: TreeModel.Node<SgfNode> | null | undefined,
  moveProps: any = [],
  setupProps: any = []
) => {
  let nodeType = 'r';
  if (moveProps.length > 0) nodeType = 'm';
  if (setupProps.length > 0) nodeType = 's';

  let n = `${nodeType}`;
  if (moveProps.length > 0) n += `${moveProps[0].token}${moveProps[0].value}`;

  let fullname = n;
  if (node) {
    fullname =
      node
        .getPath()
        .map((n: TreeModel.Node<SgfNode>) => n.model.id)
        .join('=>') +
      '=>' +
      n;
  }

  const sha = sha256(fullname).toString().slice(0, 6);
  return sha;
};

export const nFormatter = (num: number, fixed = 1) => {
  const lookup = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: 'k'},
    {value: 1e6, symbol: 'M'},
    {value: 1e9, symbol: 'G'},
    {value: 1e12, symbol: 'T'},
    {value: 1e15, symbol: 'P'},
    {value: 1e18, symbol: 'E'},
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(item => {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(fixed).replace(rx, '$1') + item.symbol
    : '0';
};

export const pathToIndexes = (path: TreeModel.Node<SgfNode>[]): number[] => {
  return path.map(n => n.model.id);
};

export const pathToInitialStones = (
  path: TreeModel.Node<SgfNode>[],
  xOffset = 0,
  yOffset = 0
): string[][] => {
  const inits = path
    .filter(n => n.model.setupProps.length > 0)
    .map(n => {
      return n.model.setupProps.map((setup: SetupProp) => {
        return setup.values.map((v: string) => {
          const a = A1_LETTERS[SGF_LETTERS.indexOf(v[0]) + xOffset];
          const b = A1_NUMBERS[SGF_LETTERS.indexOf(v[1]) + yOffset];
          const token = setup.token === 'AB' ? 'B' : 'W';
          return [token, a + b];
        });
      });
    });
  return flattenDepth(inits[0], 1);
};

export const pathToAiMoves = (
  path: TreeModel.Node<SgfNode>[],
  xOffset = 0,
  yOffset = 0
) => {
  const moves = path
    .filter(n => n.model.moveProps.length > 0)
    .map(n => {
      const prop = n.model.moveProps[0];
      const a = A1_LETTERS[SGF_LETTERS.indexOf(prop.value[0]) + xOffset];
      const b = A1_NUMBERS[SGF_LETTERS.indexOf(prop.value[1]) + yOffset];
      return [prop.token, a + b];
    });
  return moves;
};

export const getIndexFromAnalysis = (a: Analysis) => {
  if (/indexes/.test(a.id)) {
    return JSON.parse(a.id).indexes[0];
  }
  return '';
};

export const isMainPath = (node: TreeModel.Node<SgfNode>) => {
  return sum(node.getPath().map(n => n.getIndex())) === 0;
};

export const sgfToPos = (str: string) => {
  const ki = str[0] === 'B' ? 1 : -1;
  const tempStr = /\[(.*)\]/.exec(str);
  if (tempStr) {
    const pos = tempStr[1];
    const x = SGF_LETTERS.indexOf(pos[0]);
    const y = SGF_LETTERS.indexOf(pos[1]);
    return {x, y, ki};
  }
  return {x: -1, y: -1, ki: 0};
};

export const sgfToA1 = (str: string) => {
  const {x, y} = sgfToPos(str);
  return A1_LETTERS[x] + A1_NUMBERS[y];
};

export const a1ToPos = (move: string) => {
  const x = A1_LETTERS.indexOf(move[0]);
  const y = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0));
  return {x, y};
};

export const a1ToIndex = (move: string, boardSize = 19) => {
  const x = A1_LETTERS.indexOf(move[0]);
  const y = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0));
  return x * boardSize + y;
};

export const sgfOffset = (sgf: any, offset = 0) => {
  if (offset === 0) return sgf;
  const res = clone(sgf);
  const charIndex = SGF_LETTERS.indexOf(sgf[2]) - offset;
  return res.substr(0, 2) + SGF_LETTERS[charIndex] + res.substr(2 + 1);
};

export const a1ToSGF = (str: any, type = 'B', offsetX = 0, offsetY = 0) => {
  if (str === 'pass') return `${type}[]`;
  const inx = A1_LETTERS.indexOf(str[0]) + offsetX;
  const iny = A1_NUMBERS.indexOf(parseInt(str.substr(1), 0)) + offsetY;
  const sgf = `${type}[${SGF_LETTERS[inx]}${SGF_LETTERS[iny]}]`;
  return sgf;
};

export const posToSgf = (x: number, y: number, ki: number) => {
  const ax = SGF_LETTERS[x];
  const ay = SGF_LETTERS[y];
  if (ki === 0) return '';
  if (ki === 1) return `B[${ax}${ay}]`;
  if (ki === -1) return `W[${ax}${ay}]`;
  return '';
};

export const matToPosition = (mat: number[][], xOffset = 0, yOffset = 0) => {
  let result = '';
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      const value = mat[i][j];
      if (value !== 0) {
        const x = A1_LETTERS[i + xOffset];
        const y = A1_NUMBERS[j + yOffset];
        const color = value === 1 ? 'b' : 'w';
        result += `${color} ${x}${y} `;
      }
    }
  }
  return result;
};

export const matToListOfTuples = (
  mat: number[][],
  xOffset = 0,
  yOffset = 0
) => {
  const results = [];
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      const value = mat[i][j];
      if (value !== 0) {
        const x = A1_LETTERS[i + xOffset];
        const y = A1_NUMBERS[j + yOffset];
        const color = value === 1 ? 'B' : 'W';
        results.push([color, x + y]);
      }
    }
  }
  return results;
};

export const convertStoneTypeToString = (type: any) => (type === 1 ? 'B' : 'W');

export const convertStepsForAI = (steps: any, offset = 0) => {
  let res = clone(steps);
  res = res.map((s: any) => sgfOffset(s, offset));
  const header = `(;FF[4]GM[1]SZ[${
    19 - offset
  }]GN[226]PB[Black]HA[0]PW[White]KM[7.5]DT[2017-08-01]TM[1800]RU[Chinese]CP[Copyright ghost-go.com]AP[ghost-go.com]PL[Black];`;
  let count = 0;
  let prev = '';
  steps.forEach((step: any, index: any) => {
    if (step[0] === prev[0]) {
      if (step[0] === 'B') {
        res.splice(index + count, 0, 'W[tt]');
        count += 1;
      } else {
        res.splice(index + count, 0, 'B[tt]');
        count += 1;
      }
    }
    prev = step;
  });
  return `${header}${res.join(';')})`;
};

export const reverseOffsetA1Move = (
  move: string,
  mat: number[][],
  analysis: Analysis
) => {
  if (move === 'pass') return move;
  const idObj = JSON.parse(analysis.id);
  const {x, y} = reverseOffset(mat, idObj.bx, idObj.by);
  const inx = A1_LETTERS.indexOf(move[0]) + x;
  const iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + y;
  return `${A1_LETTERS[inx]}${A1_NUMBERS[iny]}`;
};

export const calcScoreDiffText = (
  prev?: RootInfo | null,
  curr?: MoveInfo | RootInfo | null,
  fixed = 1,
  reverse = false
) => {
  if (!prev || !curr) return '';
  let score = calcScoreDiff(prev, curr);
  if (reverse) score = -score;
  const fixedScore = score.toFixed(fixed);

  return score > 0 ? `+${fixedScore}` : `${fixedScore}`;
};

export const calcWinrateDiffText = (
  prev?: RootInfo | null,
  curr?: MoveInfo | RootInfo | null,
  fixed = 1,
  reverse = false
) => {
  if (!prev || !curr) return '';
  let winrate = calcWinrateDiff(prev, curr);
  if (reverse) winrate = -winrate;
  const fixedWinrate = winrate.toFixed(fixed);

  return winrate >= 0 ? `+${fixedWinrate}%` : `${fixedWinrate}%`;
};

export const calcScoreDiff = (
  prevInfo: RootInfo,
  currInfo: MoveInfo | RootInfo
) => {
  const sign = prevInfo.currentPlayer === 'B' ? 1 : -1;
  const score =
    Math.round((currInfo.scoreLead - prevInfo.scoreLead) * sign * 1000) / 1000;

  return score;
};

export const calcWinrateDiff = (
  prevInfo: RootInfo,
  currInfo: MoveInfo | RootInfo
) => {
  const sign = prevInfo.currentPlayer === 'B' ? 1 : -1;
  const score =
    Math.round((currInfo.winrate - prevInfo.winrate) * sign * 1000 * 100) /
    1000;

  return score;
};

// export const GoBanDetection = (pixelData, canvas) => {
// const columns = canvas.width;
// const rows = canvas.height;
// const dataType = JsFeat.U8C1_t;
// const distMatrixT = new JsFeat.matrix_t(columns, rows, dataType);
// JsFeat.imgproc.grayscale(pixelData, columns, rows, distMatrixT);
// JsFeat.imgproc.gaussian_blur(distMatrixT, distMatrixT, 2, 0);
// JsFeat.imgproc.canny(distMatrixT, distMatrixT, 50, 50);

// const newPixelData = new Uint32Array(pixelData.buffer);
// const alpha = (0xff << 24);
// let i = distMatrixT.cols * distMatrixT.rows;
// let pix = 0;
// while (i >= 0) {
//   pix = distMatrixT.data[i];
//   newPixelData[i] = alpha | (pix << 16) | (pix << 8) | pix;
//   i -= 1;
// }
// };

export const extractPAI = (n: TreeModel.Node<SgfNode>) => {
  const pai = n.model.customProps.find((p: CustomProp) => p.token === 'PAI');
  if (!pai) return;
  const data = JSON.parse(pai.value);

  return data;
};

export const extractAnswerType = (
  n: TreeModel.Node<SgfNode>
): PAT | undefined => {
  const pat = n.model.customProps.find((p: CustomProp) => p.token === 'PAT');
  return pat?.value;
};

export const extractPI = (n: TreeModel.Node<SgfNode>) => {
  const pi = n.model.customProps.find((p: CustomProp) => p.token === 'PI');
  if (!pi) return;
  const data = JSON.parse(pi.value);

  return data;
};

export const initNodeData = (sha: string, number?: number): SgfNode => {
  return {
    id: sha,
    name: sha,
    number: number || 0,
    rootProps: [],
    moveProps: [],
    setupProps: [],
    markupProps: [],
    gameInfoProps: [],
    nodeAnnotationProps: [],
    moveAnnotationProps: [],
    customProps: [],
  };
};

export const buildMoveNode = (
  move: string,
  parentNode?: TreeModel.Node<SgfNode>,
  props?: SgfNodeOptions
) => {
  const tree: TreeModel = new TreeModel();
  const moveProp = MoveProp.from(move);
  const sha = calcSHA(parentNode, [moveProp]);
  let number = 1;
  if (parentNode) number = getNodeNumber(parentNode) + 1;
  const nodeData = initNodeData(sha, number);
  nodeData.moveProps = [moveProp];
  nodeData.nodeAnnotationProps = [NodeAnnotationProp.from(`N[${sha}]`)];

  const node = tree.parse({
    ...nodeData,
    ...props,
  });
  return node;
};

export const getLastIndex = (root: TreeModel.Node<SgfNode>) => {
  let lastNode = root;
  root.walk(node => {
    // Halt the traversal by returning false
    lastNode = node;
    return true;
  });
  return lastNode.model.index;
};

export const cutMoveNodes = (
  root: TreeModel.Node<SgfNode>,
  returnRoot?: boolean
) => {
  let node = cloneDeep(root);
  while (node && node.hasChildren() && node.model.moveProps.length === 0) {
    node = node.children[0];
    node.children = [];
  }

  if (returnRoot) {
    while (node && node.parent && !node.isRoot()) {
      node = node.parent;
    }
  }

  return node;
};

export const calcSpaceAndScaledPadding = (
  size: number,
  padding: number,
  boardSize: number
) => {
  const newSpace = (size - padding * 2) / boardSize;
  return {space: newSpace, scaledPadding: padding + newSpace / 2};
};

export const zeros = (size: [number, number]) =>
  new Array(size[0]).fill(0).map(() => new Array(size[1]).fill(0));

export const empty = (size: [number, number]): string[][] =>
  new Array(size[0]).fill('').map(() => new Array(size[1]).fill(''));

const GRID = 19;
let liberties = 0;
let recursionPath: string[] = [];

export const calcMost = (mat: number[][], boardSize = 19) => {
  let leftMost: number = boardSize - 1;
  let rightMost = 0;
  let topMost: number = boardSize - 1;
  let bottomMost = 0;
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      const value = mat[i][j];
      if (value !== 0) {
        if (leftMost > i) leftMost = i;
        if (rightMost < i) rightMost = i;
        if (topMost > j) topMost = j;
        if (bottomMost < j) bottomMost = j;
      }
    }
  }
  return {leftMost, rightMost, topMost, bottomMost};
};

export const calcCenter = (mat: number[][], boardSize = 19) => {
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  const top = topMost < boardSize - 1 - bottomMost;
  const left = leftMost < boardSize - 1 - rightMost;
  if (top && left) return Center.TopLeft;
  if (!top && left) return Center.BottomLeft;
  if (top && !left) return Center.TopRight;
  if (!top && !left) return Center.BottomRight;
  return Center.Center;
};

export const calcBoardSize = (
  mat: number[][],
  boardSize = 19,
  extend = 2
): number[] => {
  const result = [19, 19];
  const center = calcCenter(mat);
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  if (center === Center.TopLeft) {
    result[0] = rightMost + extend + 1;
    result[1] = bottomMost + extend + 1;
  }
  if (center === Center.TopRight) {
    result[0] = boardSize - leftMost + extend;
    result[1] = bottomMost + extend + 1;
  }
  if (center === Center.BottomLeft) {
    result[0] = rightMost + extend + 1;
    result[1] = boardSize - topMost + extend;
  }
  if (center === Center.BottomRight) {
    result[0] = boardSize - leftMost + extend;
    result[1] = boardSize - topMost + extend;
  }
  result[0] = Math.min(result[0], boardSize);
  result[1] = Math.min(result[1], boardSize);

  return result;
};

export const calcPartialArea = (
  mat: number[][],
  extend = 2
): [[number, number], [number, number]] => {
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat);

  const x1 = leftMost - extend < 0 ? 0 : leftMost - extend;
  const y1 = topMost - extend < 0 ? 0 : topMost - extend;
  const x2 = rightMost + extend > 18 ? 18 : rightMost + extend;
  const y2 = bottomMost + extend > 18 ? 18 : bottomMost + extend;

  return [
    [x1, y1],
    [x2, y2],
  ];
};

export const calcOffset = (mat: number[][]) => {
  const boardSize = calcBoardSize(mat);
  const ox = 19 - boardSize[0];
  const oy = 19 - boardSize[1];
  const center = calcCenter(mat);

  let oox = ox;
  let ooy = oy;
  switch (center) {
    case Center.TopLeft: {
      oox = 0;
      ooy = oy;
      break;
    }
    case Center.TopRight: {
      oox = -ox;
      ooy = oy;
      break;
    }
    case Center.BottomLeft: {
      oox = 0;
      ooy = 0;
      break;
    }
    case Center.BottomRight: {
      oox = -ox;
      ooy = 0;
      break;
    }
  }
  return {x: oox, y: ooy};
};

export const reverseOffset = (mat: number[][], bx = 19, by = 19) => {
  const ox = 19 - bx;
  const oy = 19 - by;
  const center = calcCenter(mat);

  let oox = ox;
  let ooy = oy;
  switch (center) {
    case Center.TopLeft: {
      oox = 0;
      ooy = -oy;
      break;
    }
    case Center.TopRight: {
      oox = ox;
      ooy = -oy;
      break;
    }
    case Center.BottomLeft: {
      oox = 0;
      ooy = 0;
      break;
    }
    case Center.BottomRight: {
      oox = ox;
      ooy = 0;
      break;
    }
  }
  return {x: oox, y: ooy};
};

export const calcVisibleArea = (
  mat: number[][],
  boardSize = 19,
  extend = 2
) => {
  const center = calcCenter(mat);
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  let visibleArea = [
    [0, 18],
    [0, 18],
  ];
  let visibleSize = boardSize - 1;
  if (center === Center.TopLeft) {
    visibleSize = Math.min(
      Math.max(rightMost, bottomMost) + extend,
      boardSize - 1
    );
    visibleArea = [
      [0, visibleSize],
      [0, visibleSize],
    ];
  } else if (center === Center.TopRight) {
    visibleSize = Math.min(
      Math.max(bottomMost + extend, boardSize - 1 - (leftMost - extend)),
      boardSize - 1
    );
    visibleArea = [
      [boardSize - 1 - visibleSize, 18],
      [0, visibleSize],
    ];
  } else if (center === Center.BottomLeft) {
    visibleSize = Math.min(
      Math.max(boardSize - 1 - (topMost - extend), rightMost + extend),
      boardSize - 1
    );
    visibleArea = [
      [0, visibleSize],
      [boardSize - 1 - visibleSize, 18],
    ];
  } else if (center === Center.BottomRight) {
    visibleSize = Math.min(
      Math.max(
        boardSize - 1 - (topMost - extend),
        boardSize - 1 - (leftMost - extend)
      ),
      boardSize - 1
    );
    visibleArea = [
      [boardSize - 1 - visibleSize, 18],
      [boardSize - 1 - visibleSize, 18],
    ];
  }
  return {visibleArea, center};
};

function calcLibertyCore(mat: number[][], x: number, y: number, ki: number) {
  if (x >= 0 && x < GRID && y >= 0 && y < GRID) {
    if (mat[x][y] === ki && !recursionPath.includes(`${x},${y}`)) {
      recursionPath.push(`${x},${y}`);
      calcLibertyCore(mat, x - 1, y, ki);
      calcLibertyCore(mat, x + 1, y, ki);
      calcLibertyCore(mat, x, y - 1, ki);
      calcLibertyCore(mat, x, y + 1, ki);
    } else if (mat[x][y] === 0) {
      liberties += 1;
    }
  }
}

function calcLiberty(mat: number[][], x: number, y: number, ki: number) {
  liberties = 0;
  recursionPath = [];

  if (x < 0 || y < 0 || x > GRID - 1 || y > GRID - 1) {
    return {
      liberty: 4,
      recursionPath: [],
    };
  }

  if (mat[x][y] === 0) {
    return {
      liberty: 4,
      recursionPath: [],
    };
  }
  calcLibertyCore(mat, x, y, ki);
  return {
    liberty: liberties,
    recursionPath,
  };
}

function execCapture(mat: number[][], i: number, j: number, ki: number) {
  const newMat = cloneDeep(mat);
  const {liberty: libertyUp, recursionPath: recursionPathUp} = calcLiberty(
    mat,
    i,
    j - 1,
    ki
  );
  const {liberty: libertyDown, recursionPath: recursionPathDown} = calcLiberty(
    mat,
    i,
    j + 1,
    ki
  );
  const {liberty: libertyLeft, recursionPath: recursionPathLeft} = calcLiberty(
    mat,
    i - 1,
    j,
    ki
  );
  const {liberty: libertyRight, recursionPath: recursionPathRight} =
    calcLiberty(mat, i + 1, j, ki);
  if (libertyUp === 0) {
    recursionPathUp.forEach(item => {
      const coord = item.split(',');
      newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
    });
  }
  if (libertyDown === 0) {
    recursionPathDown.forEach(item => {
      const coord = item.split(',');
      newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
    });
  }
  if (libertyLeft === 0) {
    recursionPathLeft.forEach(item => {
      const coord = item.split(',');
      newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
    });
  }
  if (libertyRight === 0) {
    recursionPathRight.forEach(item => {
      const coord = item.split(',');
      newMat[parseInt(coord[0], 10)][parseInt(coord[1], 10)] = 0;
    });
  }
  return newMat;
}

function canCapture(mat: number[][], i: number, j: number, ki: number) {
  const {liberty: libertyUp, recursionPath: recursionPathUp} = calcLiberty(
    mat,
    i,
    j - 1,
    ki
  );
  const {liberty: libertyDown, recursionPath: recursionPathDown} = calcLiberty(
    mat,
    i,
    j + 1,
    ki
  );
  const {liberty: libertyLeft, recursionPath: recursionPathLeft} = calcLiberty(
    mat,
    i - 1,
    j,
    ki
  );
  const {liberty: libertyRight, recursionPath: recursionPathRight} =
    calcLiberty(mat, i + 1, j, ki);
  if (libertyUp === 0 && recursionPathUp.length > 0) {
    return true;
  }
  if (libertyDown === 0 && recursionPathDown.length > 0) {
    return true;
  }
  if (libertyLeft === 0 && recursionPathLeft.length > 0) {
    return true;
  }
  if (libertyRight === 0 && recursionPathRight.length > 0) {
    return true;
  }
  return false;
}

export function canMove(mat: number[][], i: number, j: number, ki: number) {
  if (i < 0 || j < 0) return true;
  if (i > 18 || j > 18) return true;
  const newMat = cloneDeep(mat);
  if (newMat[i][j] !== 0) {
    return false;
  }

  newMat[i][j] = ki;
  const {liberty} = calcLiberty(newMat, i, j, ki);
  if (canCapture(newMat, i, j, -ki)) {
    return true;
  }
  if (canCapture(newMat, i, j, ki)) {
    return false;
  }
  if (liberty === 0) {
    return false;
  }
  return true;
}

export function move(mat: number[][], i: number, j: number, ki: number) {
  if (i < 0 || j < 0) return mat;
  const newMat = cloneDeep(mat);
  newMat[i][j] = ki;
  return execCapture(newMat, i, j, -ki);
}

export function showKi(mat: number[][], steps: string[], isCaptured = true) {
  let newMat = cloneDeep(mat);
  let hasMoved = false;
  steps.forEach(str => {
    const {
      x,
      y,
      ki,
    }: {
      x: number;
      y: number;
      ki: number;
    } = sgfToPos(str);
    if (isCaptured) {
      if (canMove(newMat, x, y, ki)) {
        newMat[x][y] = ki;
        newMat = execCapture(newMat, x, y, -ki);
        hasMoved = true;
      }
    } else {
      newMat[x][y] = ki;
      hasMoved = true;
    }
  });

  return {
    arrangement: newMat,
    hasMoved,
  };
}

export const calcTransform = (
  size: number,
  mat: number[][],
  options: GhostBanOptions
) => {
  const {boardSize, extend, padding, zoom} = options;
  const {visibleArea: zoomedVisibleArea, center} = calcVisibleArea(
    mat,
    boardSize,
    extend
  );
  const va = zoom
    ? zoomedVisibleArea
    : [
        [0, 18],
        [0, 18],
      ];

  const zoomedBoardSize = va[0][1] - va[0][0] + 1;
  const {space} = calcSpaceAndScaledPadding(size, padding, boardSize);
  // const scale = 1 / (zoomedBoardSize / boardSize);
  const scale = size / (zoomedBoardSize * space + padding);
  const clip = {
    x: 0,
    y: 0,
    width: zoom ? size / scale : size,
    height: zoom ? size / scale : size,
  };
  const transform: any = [];

  if (
    zoom &&
    !(va[0][0] === 0 && va[0][1] === 18 && va[1][0] === 0 && va[1][1] === 18)
  ) {
    let offsetX = 0;
    let offsetY = 0;
    // const offset = this.options.padding;
    const offset = padding * scale;

    // This offset formula is not accurate, just try many time
    // const offset = (padding * scale - (space * scale) / 2.5) * scale;

    switch (center) {
      case Center.TopLeft:
        break;
      case Center.TopRight:
        clip.x = size - size / scale;
        offsetX = va[0][0] * space * scale + offset;
        break;
      case Center.BottomLeft:
        clip.y = size - size / scale;
        offsetY = va[1][0] * space * scale + offset;
        break;
      case Center.BottomRight:
        clip.x = size - size / scale;
        clip.y = size - size / scale;
        offsetX = va[0][0] * space * scale + offset;
        offsetY = va[1][0] * space * scale + offset;
        break;
    }

    return {
      va,
      scale,
      translateX: -offsetX,
      translateY: -offsetY,
      center,
      clip,
      space,
      // transform: [{translateX: -offsetX, translateY: -offsetY}, {scale}],
      transform: [
        {
          translateX: -offsetX,
          // translateX: 0,
        },
        {
          translateY: -offsetY,
          // translateY: 0,
        },
        {scale},
      ],
    };
  } else {
    return {
      va,
      scale: 1,
      translateX: 0,
      translateY: 0,
      center,
      clip,
      space,
      transform,
    };
  }
};

export const handleMove = (
  mat: number[][],
  i: number,
  j: number,
  turn: Ki,
  currentNode: TreeModel.Node<SgfNode>,
  onAfterMove: (node: TreeModel.Node<SgfNode>, isMoved: boolean) => void
) => {
  if (turn === Ki.Empty) return;
  if (canMove(mat, i, j, turn)) {
    // dispatch(uiSlice.actions.setTurn(-turn));
    const value = SGF_LETTERS[i] + SGF_LETTERS[j];
    const token = turn === Ki.Black ? 'B' : 'W';
    const sha = calcSHA(currentNode, [MoveProp.from(`${token}[${value}]`)]);
    const filtered = currentNode.children.filter(
      (n: any) => n.model.id === sha
    );
    let node;
    if (filtered.length > 0) {
      node = filtered[0];
    } else {
      node = buildMoveNode(`${token}[${value}]`, currentNode);
      currentNode.addChild(node);
    }
    if (onAfterMove) onAfterMove(node, true);
  } else {
    if (onAfterMove) onAfterMove(currentNode, false);
  }
};

export const addMove = (
  mat: number[][],
  currentNode: TreeModel.Node<SgfNode>,
  i: number,
  j: number,
  ki: Ki
) => {
  if (ki === Ki.Empty) return;
  let node;
  if (canMove(mat, i, j, ki)) {
    const value = SGF_LETTERS[i] + SGF_LETTERS[j];
    const token = ki === Ki.Black ? 'B' : 'W';
    const sha = calcSHA(currentNode, [MoveProp.from(`${token}[${value}]`)]);
    const filtered = currentNode.children.filter(
      (n: any) => n.model.id === sha
    );
    if (filtered.length > 0) {
      node = filtered[0];
    } else {
      node = buildMoveNode(`${token}[${value}]`, currentNode);
      currentNode.addChild(node);
    }
  }
  return node;
};

export const calcMatAndMarkup = (currentNode: TreeModel.Node<SgfNode>) => {
  const path = currentNode.getPath();
  let mat = zeros([19, 19]);
  let li, lj;
  const markup = empty([19, 19]);
  const numMarkup = empty([19, 19]);
  let setupCount = 0;
  path.forEach((node, index) => {
    const {moveProps, setupProps, rootProps} = node.model;
    if (setupProps.length > 0) setupCount += 1;

    // const st = rootProps.find((p: RootProp) => p.token === 'ST');
    // let showVariationsMarkup = false;
    // let showChildrenMarkup = false;
    // let showSiblingsMarkup = false;

    // if (st) {
    //   if (st.value === '0') {
    //     showSiblingsMarkup = false;
    //     showChildrenMarkup = true;
    //     showVariationsMarkup = true;
    //   } else if (st.value === '1') {
    //     showSiblingsMarkup = true;
    //     showChildrenMarkup = false;
    //     showVariationsMarkup = true;
    //   } else if (st.value === '2') {
    //     showSiblingsMarkup = false;
    //     showChildrenMarkup = true;
    //     showVariationsMarkup = false;
    //   } else if (st.value === '3') {
    //     showSiblingsMarkup = true;
    //     showChildrenMarkup = false;
    //     showVariationsMarkup = false;
    //   }
    // }

    // if (showVariationsMarkup && showChildrenMarkup) {
    //   if (currentNode.hasChildren()) {
    //     console.log('has children');
    //     currentNode.children.forEach((n: TreeModel.Node<SgfNode>) => {
    //       n.model.moveProps.forEach((m: MoveProp) => {
    //         console.log('aaaaaaaaaaaaaaaaaa');
    //         const i = SGF_LETTERS.indexOf(m.value[0]);
    //         const j = SGF_LETTERS.indexOf(m.value[1]);
    //         markup[i][j] = Markup.Node;
    //       });
    //     });
    //   }
    // }

    moveProps.forEach((m: MoveProp) => {
      const i = SGF_LETTERS.indexOf(m.value[0]);
      const j = SGF_LETTERS.indexOf(m.value[1]);
      if (i < 0 || j < 0) return;
      li = i;
      lj = j;
      mat = move(mat, i, j, m.token === 'B' ? Ki.Black : Ki.White);

      if (li !== undefined && lj !== undefined && li >= 0 && lj >= 0) {
        numMarkup[li][lj] = node.model.number || index - setupCount;
      }
    });

    for (let i = 0; i < 19; i++) {
      for (let j = 0; j < 19; j++) {
        if (mat[i][j] === 0) numMarkup[i][j] = '';
      }
    }

    setupProps.forEach((setup: any) => {
      setup.values.forEach((value: any) => {
        const i = SGF_LETTERS.indexOf(value[0]);
        const j = SGF_LETTERS.indexOf(value[1]);
        li = i;
        lj = j;
        mat[i][j] = setup.token === 'AB' ? 1 : -1;
        if (setup.token === 'AE') mat[i][j] = 0;
      });
    });
  });
  const markupProps = currentNode.model.markupProps;
  markupProps.forEach((m: any) => {
    const token = m.token;
    const i = SGF_LETTERS.indexOf(m.value[0]);
    const j = SGF_LETTERS.indexOf(m.value[1]);
    if (i < 0 || j < 0) return;
    let mark;
    switch (token) {
      case 'CR':
        mark = Markup.Circle;
        break;
      case 'SQ':
        mark = Markup.Square;
        break;
      case 'TR':
        mark = Markup.Triangle;
        break;
      case 'MA':
        mark = Markup.Cross;
        break;
      default: {
        mark = m.value.split(':')[1];
      }
    }
    markup[i][j] = mark;
  });

  if (
    li !== undefined &&
    lj !== undefined &&
    li >= 0 &&
    lj >= 0 &&
    !markup[li][lj]
  ) {
    markup[li][lj] = Markup.Current;
  }

  return {mat, markup};
};

export const genMove = (
  node: TreeModel.Node<SgfNode>,
  onRight: (path: string) => void,
  onWrong: (path: string) => void,
  onVariant: (path: string) => void,
  onOffPath: (path: string) => void
): TreeModel.Node<SgfNode> => {
  let nextNode;
  const getPath = (node: TreeModel.Node<SgfNode>) => {
    const newPath = compact(
      node.getPath().map(n => n.model.moveProps[0]?.toString())
    ).join(';');
    return newPath;
  };

  const checkResult = (node: TreeModel.Node<SgfNode>) => {
    if (node.hasChildren()) return;

    const path = getPath(node);
    if (isRightLeaf(node)) {
      if (onRight) onRight(path);
    } else if (isVariantLeaf(node)) {
      if (onVariant) onVariant(path);
    } else {
      if (onWrong) onWrong(path);
    }
  };

  if (node.hasChildren()) {
    const rightNodes = node.children.filter((n: TreeModel.Node<SgfNode>) =>
      inRightPath(n)
    );
    const wrongNodes = node.children.filter((n: TreeModel.Node<SgfNode>) =>
      inWrongPath(n)
    );
    const variantNodes = node.children.filter((n: TreeModel.Node<SgfNode>) =>
      inVariantPath(n)
    );

    nextNode = node;

    if (inRightPath(node) && rightNodes.length > 0) {
      nextNode = sample(rightNodes);
    } else if (inWrongPath(node) && wrongNodes.length > 0) {
      nextNode = sample(wrongNodes);
    } else if (inVariantPath(variantNodes) && variantNodes.length > 0) {
      nextNode = sample(variantNodes);
    } else if (isRightLeaf(node)) {
      onRight(getPath(nextNode));
    } else {
      onWrong(getPath(nextNode));
    }
    checkResult(nextNode);
  } else {
    checkResult(node);
  }
  return nextNode;
};
