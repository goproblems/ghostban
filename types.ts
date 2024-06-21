/**
 * Options for configuring GhostBan.
 */
export type GhostBanOptions = {
  boardSize: number;
  size?: number;
  dynamicPadding: boolean;
  padding: number;
  zoom?: boolean;
  extent: number;
  theme: Theme;
  coordinate: boolean;
  interactive: boolean;
  background: boolean;
  showAnalysis: boolean;
  boardEdgeLineWidth: number;
  boardLineWidth: number;
  boardLineExtent: number;
  themeFlatBoardColor: string;
  positiveNodeColor: string;
  negativeNodeColor: string;
  neutralNodeColor: string;
  defaultNodeColor: string;
  themeResources: ThemeResources;
  moveSound: boolean;
  starSize: number;
};

export type GhostBanOptionsParams = {
  boardSize?: number;
  size?: number;
  dynamicPadding?: boolean;
  padding?: number;
  zoom?: boolean;
  extent?: number;
  theme?: Theme;
  coordinate?: boolean;
  interactive?: boolean;
  background?: boolean;
  showAnalysis?: boolean;
  boardEdgeLineWidth?: number;
  boardLineWidth?: number;
  themeFlatBoardColor?: string;
  positiveNodeColor?: string;
  negativeNodeColor?: string;
  neutralNodeColor?: string;
  defaultNodeColor?: string;
  themeResources?: ThemeResources;
  moveSound?: boolean;
  starSize?: number;
};

export type ThemeResources = {
  [key in Theme]: {board?: string; blacks: string[]; whites: string[]};
};

export type ConsumedAnalysis = {
  results: Analysis[];
  params: AnalysisParams | null;
};

export type Analyses = {
  results: Analysis[];
  params: AnalysisParams | null;
};

export type Analysis = {
  id: string;
  isDuringSearch: boolean;
  moveInfos: MoveInfo[];
  rootInfo: RootInfo;
  policy: number[];
  ownership: number[];
  turnNumber: number;
};

export type AnalysisParams = {
  id: string;
  initialPlayer: string;
  moves: any[];
  rules: string;
  komi: string;
  boardXSize: number;
  boardYSize: number;
  includePolicy: boolean;
  priority: number;
  maxVisits: number;
};

export type MoveInfo = {
  isSymmetryOf: string;
  lcb: number;
  move: string;
  order: number;
  prior: number;
  pv: string[];
  scoreLead: number;
  scoreMean: number;
  scoreSelfPlay: number;
  scoreStdev: number;
  utility: number;
  utilityLcb: number;
  visits: number;
  winrate: number;
};

export type RootInfo = {
  currentPlayer: string;
  lcb: number;
  scoreLead: number;
  scoreSelfplay: number;
  scoreStdev: number;
  symHash: string;
  thisHash: string;
  utility: number;
  visits: number;
  winrate: number;
};

export enum Ki {
  Black = 1,
  White = -1,
  Empty = 0,
}

export enum Theme {
  BlackAndWhite = 'black_and_white',
  Flat = 'flat',
  Subdued = 'subdued',
  ShellStone = 'shell_stone',
  SlateAndShell = 'slate_and_shell',
  Walnut = 'walnut',
  Photorealistic = 'photorealistic',
}

export enum Center {
  Left = 'l',
  Right = 'r',
  Top = 't',
  Bottom = 'b',
  TopRight = 'tr',
  TopLeft = 'tl',
  BottomLeft = 'bl',
  BottomRight = 'br',
  Center = 'c',
}

export enum Markup {
  Current = 'cu',
  Circle = 'ci',
  CircleSolid = 'cis',
  Square = 'sq',
  SquareSolid = 'sqs',
  Triangle = 'tri',
  Cross = 'cr',
  Number = 'num',
  Letter = 'le',
  PositiveNode = 'pos',
  NegativeNode = 'neg',
  NeutralNode = 'neu',
  Node = 'node',

  None = '',
}

export enum Cursor {
  None = '',
  BlackStone = 'b',
  WhiteStone = 'w',
  Circle = 'c',
  Square = 's',
  Triangle = 'tri',
  Cross = 'cr',
  Clear = 'cl',
  Text = 't',
}

export enum ProblemAnswerType {
  Right = '1',
  Wrong = '2',
  Variant = '3',
}

export enum PathDetectionStrategy {
  Post = 'post',
  Pre = 'pre',
  Both = 'both',
}
