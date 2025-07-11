import {TreeModel, TNode} from './core/tree';
import {cloneDeep, flattenDepth, clone, sum, compact, sample} from 'lodash';
import {SgfNode, SgfNodeOptions} from './core/types';
import {
  isMoveNode,
  isSetupNode,
  calcHash,
  getNodeNumber,
  isRootNode,
} from './core/helpers';
export {isMoveNode, isSetupNode, calcHash, getNodeNumber, isRootNode};
import {
  A1_LETTERS,
  A1_NUMBERS,
  SGF_LETTERS,
  MAX_BOARD_SIZE,
  LIGHT_GREEN_RGB,
  LIGHT_YELLOW_RGB,
  LIGHT_RED_RGB,
  YELLOW_RGB,
  DEFAULT_BOARD_SIZE,
} from './const';
import {
  SetupProp,
  MoveProp,
  CustomProp,
  SgfPropBase,
  NodeAnnotationProp,
  GameInfoProp,
  MoveAnnotationProp,
  RootProp,
  MarkupProp,
  MOVE_PROP_LIST,
  SETUP_PROP_LIST,
  NODE_ANNOTATION_PROP_LIST,
  MOVE_ANNOTATION_PROP_LIST,
  MARKUP_PROP_LIST,
  ROOT_PROP_LIST,
  GAME_INFO_PROP_LIST,
  TIMING_PROP_LIST,
  MISCELLANEOUS_PROP_LIST,
  CUSTOM_PROP_LIST,
} from './core/props';
import {
  Analysis,
  GhostBanOptions,
  Ki,
  MoveInfo,
  ProblemAnswerType as PAT,
  RootInfo,
  Markup,
  PathDetectionStrategy,
} from './types';

import {Center} from './types';
import {canMove, execCapture} from './boardcore';
export {canMove, execCapture};

import {Sgf} from './core/sgf';

type Strategy = 'post' | 'pre' | 'both';

const SparkMD5 = require('spark-md5');

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

export const isAnswerNode = (n: TNode, kind: PAT) => {
  const pat = n.model.customProps?.find((p: CustomProp) => p.token === 'PAT');
  return pat?.value === kind;
};

export const isChoiceNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return !!c?.value.includes('CHOICE');
};

export const isTargetNode = isChoiceNode;

export const isForceNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return c?.value.includes('FORCE');
};

export const isPreventMoveNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return c?.value.includes('NOTTHIS');
};

// export const isRightLeaf = (n: TNode) => {
//   return isRightNode(n) && !n.hasChildren();
// };

export const isRightNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return !!c?.value.includes('RIGHT');
};

// export const isFirstRightLeaf = (n: TNode) => {
//   const root = n.getPath()[0];
//   const firstRightLeave = root.first((n: TNode) =>
//     isRightLeaf(n)
//   );
//   return firstRightLeave?.model.id === n.model.id;
// };

export const isFirstRightNode = (n: TNode) => {
  const root = n.getPath()[0];
  const firstRightNode = root.first(n => isRightNode(n));
  return firstRightNode?.model.id === n.model.id;
};

export const isVariantNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return !!c?.value.includes('VARIANT');
};

// export const isVariantLeaf = (n: TNode) => {
//   return isVariantNode(n) && !n.hasChildren();
// };

export const isWrongNode = (n: TNode) => {
  const c = n.model.nodeAnnotationProps?.find(
    (p: NodeAnnotationProp) => p.token === 'C'
  );
  return (!c?.value.includes('VARIANT') && !c?.value.includes('RIGHT')) || !c;
};

// export const isWrongLeaf = (n: TNode) => {
//   return isWrongNode(n) && !n.hasChildren();
// };

export const inPath = (
  node: TNode,
  detectionMethod: (n: TNode) => boolean,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[],
  postNodes?: TNode[]
) => {
  const path = preNodes ?? node.getPath();
  const postRightNodes =
    postNodes?.filter((n: TNode) => detectionMethod(n)) ??
    node.all((n: TNode) => detectionMethod(n));
  const preRightNodes = path.filter((n: TNode) => detectionMethod(n));

  switch (strategy) {
    case PathDetectionStrategy.Post:
      return postRightNodes.length > 0;
    case PathDetectionStrategy.Pre:
      return preRightNodes.length > 0;
    case PathDetectionStrategy.Both:
      return preRightNodes.length > 0 || postRightNodes.length > 0;
    default:
      return false;
  }
};

export const inRightPath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
) => {
  return inPath(node, isRightNode, strategy, preNodes, postNodes);
};

export const inFirstRightPath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
): boolean => {
  return inPath(node, isFirstRightNode, strategy, preNodes, postNodes);
};

export const inFirstBranchRightPath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Pre,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
): boolean => {
  if (!inRightPath(node)) return false;

  const path = preNodes ?? node.getPath();
  const postRightNodes = postNodes ?? node.all(() => true);

  let result = [];
  switch (strategy) {
    case PathDetectionStrategy.Post:
      result = postRightNodes.filter(n => n.getIndex() > 0);
      break;
    case PathDetectionStrategy.Pre:
      result = path.filter(n => n.getIndex() > 0);
      break;
    case PathDetectionStrategy.Both:
      result = path.concat(postRightNodes).filter(n => n.getIndex() > 0);
      break;
  }

  return result.length === 0;
};

export const inChoicePath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
): boolean => {
  return inPath(node, isChoiceNode, strategy, preNodes, postNodes);
};

export const inTargetPath = inChoicePath;

export const inVariantPath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
): boolean => {
  return inPath(node, isVariantNode, strategy, preNodes, postNodes);
};

export const inWrongPath = (
  node: TNode,
  strategy: PathDetectionStrategy = PathDetectionStrategy.Post,
  preNodes?: TNode[] | undefined,
  postNodes?: TNode[] | undefined
): boolean => {
  return inPath(node, isWrongNode, strategy, preNodes, postNodes);
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

export const pathToIndexes = (path: TNode[]): string[] => {
  return path.map(n => n.model.id);
};

export const pathToInitialStones = (
  path: TNode[],
  xOffset = 0,
  yOffset = 0
): string[] => {
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

export const pathToAiMoves = (path: TNode[], xOffset = 0, yOffset = 0) => {
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

export const isMainPath = (node: TNode) => {
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

export const matToPosition = (
  mat: number[][],
  xOffset?: number,
  yOffset?: number
) => {
  let result = '';
  xOffset = xOffset ?? 0;
  yOffset = yOffset ?? DEFAULT_BOARD_SIZE - mat.length;
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

export const offsetA1Move = (move: string, ox = 0, oy = 0) => {
  if (move === 'pass') return move;
  // console.log('oxy', ox, oy);
  const inx = A1_LETTERS.indexOf(move[0]) + ox;
  const iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + oy;
  // console.log('inxy', inx, iny, `${A1_LETTERS[inx]}${A1_NUMBERS[iny]}`);
  return `${A1_LETTERS[inx]}${A1_NUMBERS[iny]}`;
};

export const reverseOffsetA1Move = (
  move: string,
  mat: number[][],
  analysis: Analysis,
  boardSize = 19
) => {
  if (move === 'pass') return move;
  const idObj = JSON.parse(analysis.id);
  const {x, y} = reverseOffset(mat, idObj.bx, idObj.by, boardSize);
  const inx = A1_LETTERS.indexOf(move[0]) + x;
  const iny = A1_NUMBERS.indexOf(parseInt(move.substr(1), 0)) + y;
  return `${A1_LETTERS[inx]}${A1_NUMBERS[iny]}`;
};

export const calcScoreDiffText = (
  rootInfo?: RootInfo | null,
  currInfo?: MoveInfo | RootInfo | null,
  fixed = 1,
  reverse = false
) => {
  if (!rootInfo || !currInfo) return '';
  let score = calcScoreDiff(rootInfo, currInfo);
  if (reverse) score = -score;
  const fixedScore = score.toFixed(fixed);

  return score > 0 ? `+${fixedScore}` : `${fixedScore}`;
};

export const calcWinrateDiffText = (
  rootInfo?: RootInfo | null,
  currInfo?: MoveInfo | RootInfo | null,
  fixed = 1,
  reverse = false
) => {
  if (!rootInfo || !currInfo) return '';
  let winrate = calcWinrateDiff(rootInfo, currInfo);
  if (reverse) winrate = -winrate;
  const fixedWinrate = winrate.toFixed(fixed);

  return winrate >= 0 ? `+${fixedWinrate}%` : `${fixedWinrate}%`;
};

export const calcScoreDiff = (
  rootInfo: RootInfo,
  currInfo: MoveInfo | RootInfo
) => {
  const sign = rootInfo.currentPlayer === 'B' ? 1 : -1;
  const score =
    Math.round((currInfo.scoreLead - rootInfo.scoreLead) * sign * 1000) / 1000;

  return score;
};

export const calcWinrateDiff = (
  rootInfo: RootInfo,
  currInfo: MoveInfo | RootInfo
) => {
  const sign = rootInfo.currentPlayer === 'B' ? 1 : -1;
  const score =
    Math.round((currInfo.winrate - rootInfo.winrate) * sign * 1000 * 100) /
    1000;

  return score;
};

export const calcAnalysisPointColor = (
  rootInfo: RootInfo,
  moveInfo: MoveInfo
) => {
  const {prior, order} = moveInfo;
  const score = calcScoreDiff(rootInfo, moveInfo);
  let pointColor = 'rgba(255, 255, 255, 0.5)';
  if (
    prior >= 0.5 ||
    (prior >= 0.1 && order < 3 && score > -0.3) ||
    order === 0 ||
    score >= 0
  ) {
    pointColor = LIGHT_GREEN_RGB;
  } else if ((prior > 0.05 && score > -0.5) || (prior > 0.01 && score > -0.1)) {
    pointColor = LIGHT_YELLOW_RGB;
  } else if (prior > 0.01 && score > -1) {
    pointColor = YELLOW_RGB;
  } else {
    pointColor = LIGHT_RED_RGB;
  }
  return pointColor;
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

export const extractPAI = (n: TNode) => {
  const pai = n.model.customProps.find((p: CustomProp) => p.token === 'PAI');
  if (!pai) return;
  const data = JSON.parse(pai.value);

  return data;
};

export const extractAnswerType = (n: TNode): string | undefined => {
  const pat = n.model.customProps.find((p: CustomProp) => p.token === 'PAT');
  return pat?.value;
};

export const extractPI = (n: TNode) => {
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

/**
 * Creates the initial root node of the tree.
 *
 * @param rootProps - The root properties.
 * @returns The initial root node.
 */
export const initialRootNode = (
  rootProps = [
    'FF[4]',
    'GM[1]',
    'CA[UTF-8]',
    'AP[ghostgo:0.1.0]',
    'SZ[19]',
    'ST[0]',
  ]
) => {
  const tree = new TreeModel();
  const root = tree.parse({
    // '1b16b1' is the SHA256 hash of the 'n'
    id: '',
    name: '',
    index: 0,
    number: 0,
    rootProps: rootProps.map(p => RootProp.from(p)),
    moveProps: [],
    setupProps: [],
    markupProps: [],
    gameInfoProps: [],
    nodeAnnotationProps: [],
    moveAnnotationProps: [],
    customProps: [],
  });
  const hash = calcHash(root);
  root.model.id = hash;

  return root;
};

/**
 * Builds a new tree node with the given move, parent node, and additional properties.
 *
 * @param move - The move to be added to the node.
 * @param parentNode - The parent node of the new node. Optional.
 * @param props - Additional properties to be added to the new node. Optional.
 * @returns The newly created tree node.
 */
export const buildMoveNode = (
  move: string,
  parentNode?: TNode,
  props?: SgfNodeOptions
) => {
  const tree = new TreeModel();
  const moveProp = MoveProp.from(move);
  const hash = calcHash(parentNode, [moveProp]);
  let number = 1;
  if (parentNode) number = getNodeNumber(parentNode) + 1;
  const nodeData = initNodeData(hash, number);
  nodeData.moveProps = [moveProp];

  const node = tree.parse({
    ...nodeData,
    ...props,
  });
  return node;
};

export const getLastIndex = (root: TNode) => {
  let lastNode = root;
  root.walk(node => {
    // Halt the traversal by returning false
    lastNode = node;
    return true;
  });
  return lastNode.model.index;
};

export const cutMoveNodes = (root: TNode, returnRoot?: boolean) => {
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

export const getRoot = (node: TNode) => {
  let root = node;
  while (root && root.parent && !root.isRoot()) {
    root = root.parent;
  }
  return root;
};

export const zeros = (size: [number, number]): number[][] =>
  new Array(size[0]).fill(0).map(() => new Array(size[1]).fill(0));

export const empty = (size: [number, number]): string[][] =>
  new Array(size[0]).fill('').map(() => new Array(size[1]).fill(''));

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
  extent = 2
): number[] => {
  const result = [19, 19];
  const center = calcCenter(mat);
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  if (center === Center.TopLeft) {
    result[0] = rightMost + extent + 1;
    result[1] = bottomMost + extent + 1;
  }
  if (center === Center.TopRight) {
    result[0] = boardSize - leftMost + extent;
    result[1] = bottomMost + extent + 1;
  }
  if (center === Center.BottomLeft) {
    result[0] = rightMost + extent + 1;
    result[1] = boardSize - topMost + extent;
  }
  if (center === Center.BottomRight) {
    result[0] = boardSize - leftMost + extent;
    result[1] = boardSize - topMost + extent;
  }
  result[0] = Math.min(result[0], boardSize);
  result[1] = Math.min(result[1], boardSize);

  return result;
};

export const calcPartialArea = (
  mat: number[][],
  extent = 2,
  boardSize = 19
): [[number, number], [number, number]] => {
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat);

  const size = boardSize - 1;
  const x1 = leftMost - extent < 0 ? 0 : leftMost - extent;
  const y1 = topMost - extent < 0 ? 0 : topMost - extent;
  const x2 = rightMost + extent > size ? size : rightMost + extent;
  const y2 = bottomMost + extent > size ? size : bottomMost + extent;

  return [
    [x1, y1],
    [x2, y2],
  ];
};

export const calcAvoidMovesForPartialAnalysis = (
  partialArea: [[number, number], [number, number]],
  boardSize = 19
) => {
  const result: string[] = [];

  const [[x1, y1], [x2, y2]] = partialArea;

  for (const col of A1_LETTERS.slice(0, boardSize)) {
    for (const row of A1_NUMBERS.slice(-boardSize)) {
      const x = A1_LETTERS.indexOf(col);
      const y = A1_NUMBERS.indexOf(row);

      if (x < x1 || x > x2 || y < y1 || y > y2) {
        result.push(`${col}${row}`);
      }
    }
  }

  return result;
};

export const calcTsumegoFrame = (
  mat: number[][],
  extent: number,
  boardSize = 19,
  komi = 7.5,
  turn: Ki = Ki.Black,
  ko = false
): number[][] => {
  const result = cloneDeep(mat);
  const partialArea = calcPartialArea(mat, extent, boardSize);
  const center = calcCenter(mat);
  const putBorder = (mat: number[][]) => {
    const [x1, y1] = partialArea[0];
    const [x2, y2] = partialArea[1];
    for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        if (
          center === Center.TopLeft &&
          ((i === x2 && i < boardSize - 1) ||
            (j === y2 && j < boardSize - 1) ||
            (i === x1 && i > 0) ||
            (j === y1 && j > 0))
        ) {
          mat[i][j] = turn;
        } else if (
          center === Center.TopRight &&
          ((i === x1 && i > 0) ||
            (j === y2 && j < boardSize - 1) ||
            (i === x2 && i < boardSize - 1) ||
            (j === y1 && j > 0))
        ) {
          mat[i][j] = turn;
        } else if (
          center === Center.BottomLeft &&
          ((i === x2 && i < boardSize - 1) ||
            (j === y1 && j > 0) ||
            (i === x1 && i > 0) ||
            (j === y2 && j < boardSize - 1))
        ) {
          mat[i][j] = turn;
        } else if (
          center === Center.BottomRight &&
          ((i === x1 && i > 0) ||
            (j === y1 && j > 0) ||
            (i === x2 && i < boardSize - 1) ||
            (j === y2 && j < boardSize - 1))
        ) {
          mat[i][j] = turn;
        } else if (center === Center.Center) {
          mat[i][j] = turn;
        }
      }
    }
  };
  const putOutside = (mat: number[][]) => {
    const offenceToWin = 10;
    const offenseKomi = turn * komi;
    const [x1, y1] = partialArea[0];
    const [x2, y2] = partialArea[1];
    // TODO: Hard code for now
    // const blackToAttack = turn === Ki.Black;
    const blackToAttack = turn === Ki.Black;
    const isize = x2 - x1;
    const jsize = y2 - y1;
    // TODO: 361 is hardcoded
    // const defenseArea = Math.floor(
    //   (361 - isize * jsize - offenseKomi - offenceToWin) / 2
    // );
    const defenseArea =
      Math.floor((361 - isize * jsize) / 2) - offenseKomi - offenceToWin;

    // const defenseArea = 30;

    // outside the frame
    let count = 0;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (i < x1 || i > x2 || j < y1 || j > y2) {
          count++;
          let ki = Ki.Empty;
          if (center === Center.TopLeft || center === Center.BottomLeft) {
            ki = blackToAttack !== count <= defenseArea ? Ki.White : Ki.Black;
          } else if (
            center === Center.TopRight ||
            center === Center.BottomRight
          ) {
            ki = blackToAttack !== count <= defenseArea ? Ki.Black : Ki.White;
          }
          if ((i + j) % 2 === 0 && Math.abs(count - defenseArea) > boardSize) {
            ki = Ki.Empty;
          }

          mat[i][j] = ki;
        }
      }
    }
  };
  // TODO:
  const putKoThreat = (mat: number[][], ko: boolean) => {};

  putBorder(result);
  putOutside(result);

  // const flipSpec =
  //   imin < jmin
  //     ? [false, false, true]
  //     : [needFlip(imin, imax, isize), needFlip(jmin, jmax, jsize), false];

  // if (flipSpec.includes(true)) {
  //   const flipped = flipStones(stones, flipSpec);
  //   const filled = tsumegoFrameStones(flipped, komi, blackToPlay, ko, margin);
  //   return flipStones(filled, flipSpec);
  // }

  // const i0 = imin - margin;
  // const i1 = imax + margin;
  // const j0 = jmin - margin;
  // const j1 = jmax + margin;
  // const frameRange: Region = [i0, i1, j0, j1];
  // const blackToAttack = guessBlackToAttack(
  //   [top, bottom, left, right],
  //   [isize, jsize]
  // );

  // putBorder(mat, [isize, jsize], frameRange, blackToAttack);
  // putOutside(
  //   stones,
  //   [isize, jsize],
  //   frameRange,
  //   blackToAttack,
  //   blackToPlay,
  //   komi
  // );
  // putKoThreat(
  //   stones,
  //   [isize, jsize],
  //   frameRange,
  //   blackToAttack,
  //   blackToPlay,
  //   ko
  // );
  // return stones;

  return result;
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

export const reverseOffset = (
  mat: number[][],
  bx = 19,
  by = 19,
  boardSize = 19
) => {
  const ox = boardSize - bx;
  const oy = boardSize - by;
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

export function calcVisibleArea(
  mat: number[][] = zeros([19, 19]),
  extent: number,
  allowRectangle = false
): number[][] {
  let minRow = mat.length;
  let maxRow = 0;
  let minCol = mat[0].length;
  let maxCol = 0;

  let empty = true;

  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) {
      if (mat[i][j] !== 0) {
        empty = false;
        minRow = Math.min(minRow, i);
        maxRow = Math.max(maxRow, i);
        minCol = Math.min(minCol, j);
        maxCol = Math.max(maxCol, j);
      }
    }
  }

  if (empty) {
    return [
      [0, mat.length - 1],
      [0, mat[0].length - 1],
    ];
  }

  if (!allowRectangle) {
    const minRowWithExtent = Math.max(minRow - extent, 0);
    const maxRowWithExtent = Math.min(maxRow + extent, mat.length - 1);
    const minColWithExtent = Math.max(minCol - extent, 0);
    const maxColWithExtent = Math.min(maxCol + extent, mat[0].length - 1);

    const maxRange = Math.max(
      maxRowWithExtent - minRowWithExtent,
      maxColWithExtent - minColWithExtent
    );

    minRow = minRowWithExtent;
    maxRow = minRow + maxRange;

    if (maxRow >= mat.length) {
      maxRow = mat.length - 1;
      minRow = maxRow - maxRange;
    }

    minCol = minColWithExtent;
    maxCol = minCol + maxRange;
    if (maxCol >= mat[0].length) {
      maxCol = mat[0].length - 1;
      minCol = maxCol - maxRange;
    }
  } else {
    minRow = Math.max(0, minRow - extent);
    maxRow = Math.min(mat.length - 1, maxRow + extent);
    minCol = Math.max(0, minCol - extent);
    maxCol = Math.min(mat[0].length - 1, maxCol + extent);
  }

  return [
    [minRow, maxRow],
    [minCol, maxCol],
  ];
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

// TODO:
export const handleMove = (
  mat: number[][],
  i: number,
  j: number,
  turn: Ki,
  currentNode: TNode,
  onAfterMove: (node: TNode, isMoved: boolean) => void
) => {
  if (turn === Ki.Empty) return;
  if (canMove(mat, i, j, turn)) {
    // dispatch(uiSlice.actions.setTurn(-turn));
    const value = SGF_LETTERS[i] + SGF_LETTERS[j];
    const token = turn === Ki.Black ? 'B' : 'W';
    const hash = calcHash(currentNode, [MoveProp.from(`${token}[${value}]`)]);
    const filtered = currentNode.children.filter(
      (n: TNode) => n.model.id === hash
    );
    let node: TNode;
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

/**
 * Clear stone from the currentNode
 * @param currentNode
 * @param value
 */
export const clearStoneFromCurrentNode = (
  currentNode: TNode,
  value: string
) => {
  const path = currentNode.getPath();
  path.forEach(node => {
    const {setupProps} = node.model;
    if (setupProps.filter((s: SetupProp) => s.value === value).length > 0) {
      node.model.setupProps = setupProps.filter((s: any) => s.value !== value);
    } else {
      setupProps.forEach((s: SetupProp) => {
        s.values = s.values.filter(v => v !== value);
        if (s.values.length === 0) {
          node.model.setupProps = node.model.setupProps.filter(
            (p: SetupProp) => p.token !== s.token
          );
        }
      });
    }
  });
};

/**
 * Adds a stone to the current node in the tree.
 *
 * @param currentNode The current node in the tree.
 * @param mat The matrix representing the board.
 * @param i The row index of the stone.
 * @param j The column index of the stone.
 * @param ki The color of the stone (Ki.White or Ki.Black).
 * @returns True if the stone was removed from previous nodes, false otherwise.
 */
export const addStoneToCurrentNode = (
  currentNode: TNode,
  mat: number[][],
  i: number,
  j: number,
  ki: Ki
) => {
  const value = SGF_LETTERS[i] + SGF_LETTERS[j];
  const token = ki === Ki.White ? 'AW' : 'AB';
  const prop = findProp(currentNode, token);
  let result = false;
  if (mat[i][j] !== Ki.Empty) {
    clearStoneFromCurrentNode(currentNode, value);
  } else {
    if (prop) {
      prop.values = [...prop.values, value];
    } else {
      currentNode.model.setupProps = [
        ...currentNode.model.setupProps,
        new SetupProp(token, value),
      ];
    }
    result = true;
  }
  return result;
};

/**
 * Adds a move to the given matrix and returns the corresponding node in the tree.
 * If the ki is empty, no move is added and null is returned.
 *
 * @param mat - The matrix representing the game board.
 * @param currentNode - The current node in the tree.
 * @param i - The row index of the move.
 * @param j - The column index of the move.
 * @param ki - The type of move (Ki).
 * @returns The corresponding node in the tree, or null if no move is added.
 */
// TODO: The params here is weird
export const addMoveToCurrentNode = (
  currentNode: TNode,
  mat: number[][],
  i: number,
  j: number,
  ki: Ki
) => {
  if (ki === Ki.Empty) return;
  let node;
  if (canMove(mat, i, j, ki)) {
    const value = SGF_LETTERS[i] + SGF_LETTERS[j];
    const token = ki === Ki.Black ? 'B' : 'W';
    const hash = calcHash(currentNode, [MoveProp.from(`${token}[${value}]`)]);
    const filtered = currentNode.children.filter(
      (n: TNode) => n.model.id === hash
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

export const calcPreventMoveMatForDisplayOnly = (
  node: TNode,
  defaultBoardSize = 19
) => {
  if (!node) return zeros([defaultBoardSize, defaultBoardSize]);
  const size = extractBoardSize(node, defaultBoardSize);
  const preventMoveMat = zeros([size, size]);

  preventMoveMat.forEach(row => row.fill(1));
  if (node.hasChildren()) {
    node.children.forEach((n: TNode) => {
      n.model.moveProps.forEach((m: MoveProp) => {
        const i = SGF_LETTERS.indexOf(m.value[0]);
        const j = SGF_LETTERS.indexOf(m.value[1]);
        if (i >= 0 && j >= 0 && i < size && j < size) {
          preventMoveMat[i][j] = 0;
        }
      });
    });
  }
  return preventMoveMat;
};

export const calcPreventMoveMat = (node: TNode, defaultBoardSize = 19) => {
  if (!node) return zeros([defaultBoardSize, defaultBoardSize]);
  const size = extractBoardSize(node, defaultBoardSize);
  const preventMoveMat = zeros([size, size]);
  const forceNodes = [];
  let preventMoveNodes: TNode[] = [];
  if (node.hasChildren()) {
    preventMoveNodes = node.children.filter((n: TNode) => isPreventMoveNode(n));
  }

  if (isForceNode(node)) {
    preventMoveMat.forEach(row => row.fill(1));
    if (node.hasChildren()) {
      node.children.forEach((n: TNode) => {
        n.model.moveProps.forEach((m: MoveProp) => {
          const i = SGF_LETTERS.indexOf(m.value[0]);
          const j = SGF_LETTERS.indexOf(m.value[1]);
          if (i >= 0 && j >= 0 && i < size && j < size) {
            preventMoveMat[i][j] = 0;
          }
        });
      });
    }
  }

  preventMoveNodes.forEach((n: TNode) => {
    n.model.moveProps.forEach((m: MoveProp) => {
      const i = SGF_LETTERS.indexOf(m.value[0]);
      const j = SGF_LETTERS.indexOf(m.value[1]);
      if (i >= 0 && j >= 0 && i < size && j < size) {
        preventMoveMat[i][j] = 1;
      }
    });
  });

  return preventMoveMat;
};

/**
 * Calculates the markup matrix for variations in a given SGF node.
 *
 * @param node - The SGF node to calculate the markup for.
 * @param policy - The policy for handling the markup. Defaults to 'append'.
 * @returns The calculated markup for the variations.
 */
export const calcVariationsMarkup = (
  node: TNode,
  policy: 'append' | 'prepend' | 'replace' = 'append',
  activeIndex: number = 0,
  defaultBoardSize = 19
) => {
  const res = calcMatAndMarkup(node);
  const {mat, markup} = res;
  const size = extractBoardSize(node, defaultBoardSize);

  if (node.hasChildren()) {
    node.children.forEach((n: TNode) => {
      n.model.moveProps.forEach((m: MoveProp) => {
        const i = SGF_LETTERS.indexOf(m.value[0]);
        const j = SGF_LETTERS.indexOf(m.value[1]);
        if (i < 0 || j < 0) return;
        if (i < size && j < size) {
          let mark = Markup.NeutralNode;
          if (inWrongPath(n)) {
            mark =
              n.getIndex() === activeIndex
                ? Markup.NegativeActiveNode
                : Markup.NegativeNode;
          }
          if (inRightPath(n)) {
            mark =
              n.getIndex() === activeIndex
                ? Markup.PositiveActiveNode
                : Markup.PositiveNode;
          }
          if (mat[i][j] === Ki.Empty) {
            switch (policy) {
              case 'prepend':
                markup[i][j] = mark + '|' + markup[i][j];
                break;
              case 'replace':
                markup[i][j] = mark;
                break;
              case 'append':
              default:
                markup[i][j] += '|' + mark;
            }
          }
        }
      });
    });
  }

  return markup;
};

export const detectST = (node: TNode) => {
  // Reference: https://www.red-bean.com/sgf/properties.html#ST
  const root = node.getPath()[0];
  const stProp = root.model.rootProps.find((p: RootProp) => p.token === 'ST');
  let showVariationsMarkup = false;
  let showChildrenMarkup = false;
  let showSiblingsMarkup = false;

  const st = stProp?.value || '0';
  if (st) {
    if (st === '0') {
      showSiblingsMarkup = false;
      showChildrenMarkup = true;
      showVariationsMarkup = true;
    } else if (st === '1') {
      showSiblingsMarkup = true;
      showChildrenMarkup = false;
      showVariationsMarkup = true;
    } else if (st === '2') {
      showSiblingsMarkup = false;
      showChildrenMarkup = true;
      showVariationsMarkup = false;
    } else if (st === '3') {
      showSiblingsMarkup = true;
      showChildrenMarkup = false;
      showVariationsMarkup = false;
    }
  }
  return {showVariationsMarkup, showChildrenMarkup, showSiblingsMarkup};
};

/**
 * Calculates the mat and markup arrays based on the currentNode and defaultBoardSize.
 * @param currentNode The current node in the tree.
 * @param defaultBoardSize The default size of the board (optional, default is 19).
 * @returns An object containing the mat/visibleAreaMat/markup/numMarkup arrays.
 */
export const calcMatAndMarkup = (currentNode: TNode, defaultBoardSize = 19) => {
  const path = currentNode.getPath();
  const root = path[0];

  let li, lj;
  let setupCount = 0;
  const size = extractBoardSize(currentNode, defaultBoardSize);
  let mat = zeros([size, size]);
  const visibleAreaMat = zeros([size, size]);
  const markup = empty([size, size]);
  const numMarkup = empty([size, size]);

  path.forEach((node, index) => {
    const {moveProps, setupProps, rootProps} = node.model;
    if (setupProps.length > 0) setupCount += 1;

    moveProps.forEach((m: MoveProp) => {
      const i = SGF_LETTERS.indexOf(m.value[0]);
      const j = SGF_LETTERS.indexOf(m.value[1]);
      if (i < 0 || j < 0) return;
      if (i < size && j < size) {
        li = i;
        lj = j;
        mat = move(mat, i, j, m.token === 'B' ? Ki.Black : Ki.White);

        if (li !== undefined && lj !== undefined && li >= 0 && lj >= 0) {
          numMarkup[li][lj] = (
            node.model.number || index - setupCount
          ).toString();
        }

        if (index === path.length - 1) {
          markup[li][lj] = Markup.Current;
        }
      }
    });

    // Setup props should override move props
    setupProps.forEach((setup: any) => {
      setup.values.forEach((value: any) => {
        const i = SGF_LETTERS.indexOf(value[0]);
        const j = SGF_LETTERS.indexOf(value[1]);
        if (i < 0 || j < 0) return;
        if (i < size && j < size) {
          li = i;
          lj = j;
          mat[i][j] = setup.token === 'AB' ? 1 : -1;
          if (setup.token === 'AE') mat[i][j] = 0;
        }
      });
    });

    // If the root node does not include any setup properties
    // check whether its first child is a setup node (i.e., a non-move node)
    // and apply its setup properties instead
    if (setupProps.length === 0 && currentNode.isRoot()) {
      const firstChildNode = currentNode.children[0];
      if (
        firstChildNode &&
        isSetupNode(firstChildNode) &&
        !isMoveNode(firstChildNode)
      ) {
        const setupProps = firstChildNode.model.setupProps;
        setupProps.forEach((setup: any) => {
          setup.values.forEach((value: any) => {
            const i = SGF_LETTERS.indexOf(value[0]);
            const j = SGF_LETTERS.indexOf(value[1]);
            if (i < 0 || j < 0) return;
            if (i < size && j < size) {
              li = i;
              lj = j;
              mat[i][j] = setup.token === 'AB' ? 1 : -1;
              if (setup.token === 'AE') mat[i][j] = 0;
            }
          });
        });
      }
    }

    // Clear number when stones are captured
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (mat[i][j] === 0) numMarkup[i][j] = '';
      }
    }
  });

  // Calculating the visible area
  if (root) {
    root.all((node: TNode) => {
      const {moveProps, setupProps, rootProps} = node.model;
      if (setupProps.length > 0) setupCount += 1;
      setupProps.forEach((setup: any) => {
        setup.values.forEach((value: any) => {
          const i = SGF_LETTERS.indexOf(value[0]);
          const j = SGF_LETTERS.indexOf(value[1]);
          if (i >= 0 && j >= 0 && i < size && j < size) {
            visibleAreaMat[i][j] = Ki.Black;
            if (setup.token === 'AE') visibleAreaMat[i][j] = 0;
          }
        });
      });

      moveProps.forEach((m: MoveProp) => {
        const i = SGF_LETTERS.indexOf(m.value[0]);
        const j = SGF_LETTERS.indexOf(m.value[1]);
        if (i >= 0 && j >= 0 && i < size && j < size) {
          visibleAreaMat[i][j] = Ki.Black;
        }
      });

      return true;
    });
  }

  const markupProps = currentNode.model.markupProps;
  markupProps.forEach((m: MarkupProp) => {
    const token = m.token;
    const values = m.values;
    values.forEach(value => {
      const i = SGF_LETTERS.indexOf(value[0]);
      const j = SGF_LETTERS.indexOf(value[1]);
      if (i < 0 || j < 0) return;
      if (i < size && j < size) {
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
            mark = value.split(':')[1];
          }
        }
        markup[i][j] = mark;
      }
    });
  });

  // if (
  //   li !== undefined &&
  //   lj !== undefined &&
  //   li >= 0 &&
  //   lj >= 0 &&
  //   !markup[li][lj]
  // ) {
  //   markup[li][lj] = Markup.Current;
  // }

  return {mat, visibleAreaMat, markup, numMarkup};
};

/**
 * Finds a property in the given node based on the provided token.
 * @param node The node to search for the property.
 * @param token The token of the property to find.
 * @returns The found property or null if not found.
 */
export const findProp = (node: TNode, token: string) => {
  if (!node) return;
  if (MOVE_PROP_LIST.includes(token)) {
    return node.model.moveProps.find((p: MoveProp) => p.token === token);
  }
  if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
    return node.model.nodeAnnotationProps.find(
      (p: NodeAnnotationProp) => p.token === token
    );
  }
  if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
    return node.model.moveAnnotationProps.find(
      (p: MoveAnnotationProp) => p.token === token
    );
  }
  if (ROOT_PROP_LIST.includes(token)) {
    return node.model.rootProps.find((p: RootProp) => p.token === token);
  }
  if (SETUP_PROP_LIST.includes(token)) {
    return node.model.setupProps.find((p: SetupProp) => p.token === token);
  }
  if (MARKUP_PROP_LIST.includes(token)) {
    return node.model.markupProps.find((p: MarkupProp) => p.token === token);
  }
  if (GAME_INFO_PROP_LIST.includes(token)) {
    return node.model.gameInfoProps.find(
      (p: GameInfoProp) => p.token === token
    );
  }
  return null;
};

/**
 * Finds properties in a given node based on the provided token.
 * @param node - The node to search for properties.
 * @param token - The token to match against the properties.
 * @returns An array of properties that match the provided token.
 */
export const findProps = (node: TNode, token: string) => {
  if (MOVE_PROP_LIST.includes(token)) {
    return node.model.moveProps.filter((p: MoveProp) => p.token === token);
  }
  if (NODE_ANNOTATION_PROP_LIST.includes(token)) {
    return node.model.nodeAnnotationProps.filter(
      (p: NodeAnnotationProp) => p.token === token
    );
  }
  if (MOVE_ANNOTATION_PROP_LIST.includes(token)) {
    return node.model.moveAnnotationProps.filter(
      (p: MoveAnnotationProp) => p.token === token
    );
  }
  if (ROOT_PROP_LIST.includes(token)) {
    return node.model.rootProps.filter((p: RootProp) => p.token === token);
  }
  if (SETUP_PROP_LIST.includes(token)) {
    return node.model.setupProps.filter((p: SetupProp) => p.token === token);
  }
  if (MARKUP_PROP_LIST.includes(token)) {
    return node.model.markupProps.filter((p: MarkupProp) => p.token === token);
  }
  if (GAME_INFO_PROP_LIST.includes(token)) {
    return node.model.gameInfoProps.filter(
      (p: GameInfoProp) => p.token === token
    );
  }
  return [];
};

export const genMove = (
  node: TNode,
  onRight: (path: string) => void,
  onWrong: (path: string) => void,
  onVariant: (path: string) => void,
  onOffPath: (path: string) => void
): TNode | undefined => {
  let nextNode;
  const getPath = (node: TNode) => {
    const newPath = compact(
      node.getPath().map(n => n.model.moveProps[0]?.toString())
    ).join(';');
    return newPath;
  };

  const checkResult = (node: TNode) => {
    if (node.hasChildren()) return;

    const path = getPath(node);
    if (isRightNode(node)) {
      if (onRight) onRight(path);
    } else if (isVariantNode(node)) {
      if (onVariant) onVariant(path);
    } else {
      if (onWrong) onWrong(path);
    }
  };

  if (node.hasChildren()) {
    const rightNodes = node.children.filter((n: TNode) => inRightPath(n));
    const wrongNodes = node.children.filter((n: TNode) => inWrongPath(n));
    const variantNodes = node.children.filter((n: TNode) => inVariantPath(n));

    nextNode = node;

    if (inRightPath(node) && rightNodes.length > 0) {
      nextNode = sample(rightNodes);
    } else if (inWrongPath(node) && wrongNodes.length > 0) {
      nextNode = sample(wrongNodes);
    } else if (inVariantPath(node) && variantNodes.length > 0) {
      nextNode = sample(variantNodes);
    } else if (isRightNode(node)) {
      onRight(getPath(nextNode));
    } else {
      onWrong(getPath(nextNode));
    }
    if (nextNode) checkResult(nextNode);
  } else {
    checkResult(node);
  }
  return nextNode;
};

export const extractBoardSize = (node: TNode, defaultBoardSize = 19) => {
  const root = node.getPath()[0];
  const size = Math.min(
    parseInt(String(findProp(root, 'SZ')?.value || defaultBoardSize)),
    MAX_BOARD_SIZE
  );
  return size;
};

export const getFirstToMoveColorFromRoot = (
  root: TNode | undefined | null,
  defaultMoveColor: Ki = Ki.Black
) => {
  if (root) {
    const setupNode = root.first(n => isSetupNode(n));
    if (setupNode) {
      const firstMoveNode = setupNode.first(n => isMoveNode(n));
      if (!firstMoveNode) return defaultMoveColor;
      return getMoveColor(firstMoveNode);
    }
  }
  // console.warn('Default first to move color', defaultMoveColor);
  return defaultMoveColor;
};

export const getFirstToMoveColorFromSgf = (
  sgf: string,
  defaultMoveColor: Ki = Ki.Black
) => {
  const sgfParser = new Sgf(sgf);
  if (sgfParser.root)
    getFirstToMoveColorFromRoot(sgfParser.root, defaultMoveColor);
  // console.warn('Default first to move color', defaultMoveColor);
  return defaultMoveColor;
};

export const getMoveColor = (node: TNode, defaultMoveColor: Ki = Ki.Black) => {
  const moveProp = node.model?.moveProps?.[0];
  switch (moveProp?.token) {
    case 'W':
      return Ki.White;
    case 'B':
      return Ki.Black;
    default:
      // console.warn('Default move color is', defaultMoveColor);
      return defaultMoveColor;
  }
};
