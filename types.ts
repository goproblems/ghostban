/**
 * Theme property keys for type-safe access to theme configuration
 */
export enum ThemePropertyKey {
  PositiveNodeColor = 'positiveNodeColor',
  NegativeNodeColor = 'negativeNodeColor',
  NeutralNodeColor = 'neutralNodeColor',
  DefaultNodeColor = 'defaultNodeColor',
  WarningNodeColor = 'warningNodeColor',
  ShadowColor = 'shadowColor',
  BoardLineColor = 'boardLineColor',
  ActiveColor = 'activeColor',
  InactiveColor = 'inactiveColor',
  BoardBackgroundColor = 'boardBackgroundColor',
  FlatBlackColor = 'flatBlackColor',
  FlatBlackColorAlt = 'flatBlackColorAlt',
  FlatWhiteColor = 'flatWhiteColor',
  FlatWhiteColorAlt = 'flatWhiteColorAlt',
  BoardEdgeLineWidth = 'boardEdgeLineWidth',
  BoardLineWidth = 'boardLineWidth',
  BoardLineExtent = 'boardLineExtent',
  StarSize = 'starSize',
  MarkupLineWidth = 'markupLineWidth',
  HighlightColor = 'highlightColor',
}

/**
 * Theme context for markup rendering
 */
export type ThemeContext = {
  theme: Theme;
  themeOptions: ThemeOptions;
};

export type CustomMarkupRenderer = (args: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  s: number;
  ki: Ki;
  themeContext: ThemeContext;
  value: string;
}) => void;

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
  analysisPointTheme: AnalysisPointTheme;
  coordinate: boolean;
  interactive: boolean;
  background: boolean;
  showAnalysis: boolean;
  showOwnership: boolean;
  adaptiveBoardLine: boolean;
  themeOptions: ThemeOptions;
  themeResources: ThemeResources;
  moveSound: boolean;
  adaptiveStarSize: boolean;
  mobileIndicatorOffset: number;
  forceAnalysisBoardSize?: number;
  customMarkupRenderers?: Record<string, CustomMarkupRenderer>;
};

export type GhostBanOptionsParams = {
  boardSize?: number;
  size?: number;
  dynamicPadding?: boolean;
  padding?: number;
  zoom?: boolean;
  extent?: number;
  theme?: Theme;
  analysisPointTheme?: AnalysisPointTheme;
  coordinate?: boolean;
  interactive?: boolean;
  background?: boolean;
  showAnalysis?: boolean;
  showOwnership?: boolean;
  adaptiveBoardLine?: boolean;
  themeOptions?: Partial<ThemeOptions>;
  themeResources?: ThemeResources;
  moveSound?: boolean;
  adaptiveStarSize?: boolean;
  forceAnalysisBoardSize?: number;
  mobileIndicatorOffset?: number;
  customMarkupRenderers?: Record<string, CustomMarkupRenderer>;
};

export type ThemeConfig = {
  positiveNodeColor: string;
  negativeNodeColor: string;
  neutralNodeColor: string;
  defaultNodeColor: string;
  warningNodeColor: string;
  shadowColor: string;
  boardLineColor: string;
  activeColor: string;
  inactiveColor: string;
  boardBackgroundColor: string;
  // Markup colors for flat themes
  flatBlackColor: string;
  flatBlackColorAlt: string;
  flatWhiteColor: string;
  flatWhiteColorAlt: string;
  // Board display properties
  boardEdgeLineWidth: number;
  boardLineWidth: number;
  boardLineExtent: number;
  starSize: number;
  markupLineWidth: number;
  highlightColor: string;
  stoneRatio: number;
};

export type ThemeOptions = {
  [key in Theme]?: Partial<ThemeConfig>;
} & {
  default: ThemeConfig;
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
  humanPolicy?: number[];
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
  weight: number;
};

export type RootInfo = {
  // currentPlayer is not officially part of the GTP results but it is helpful to have it here to avoid passing it through the arguments
  currentPlayer: string;
  scoreLead: number;
  scoreSelfplay: number;
  scoreStdev: number;
  utility: number;
  visits: number;
  winrate: number;
  weight?: number;
  rawStWrError?: number;
  rawStScoreError?: number;
  rawVarTimeLeft?: number;
  // GTP results don't include the following fields
  lcb?: number;
  symHash?: string;
  thisHash?: string;
};

export type AnalysisPointOptions = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  r: number;
  rootInfo: RootInfo;
  moveInfo: MoveInfo;
  policyValue?: number;
  theme?: AnalysisPointTheme;
  outlineColor?: string;
  showOrder?: boolean;
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
  Dark = 'dark',
  Warm = 'warm',
  YunziMonkeyDark = 'yunzi_monkey_dark',
  HighContrast = 'high_contrast',
}

export enum AnalysisPointTheme {
  Default = 'default',
  Problem = 'problem',
  Scenario = 'scenario',
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

export enum Effect {
  None = '',
  Ban = 'ban',
  Dim = 'dim',
  Highlight = 'highlight',
}

export enum Markup {
  Current = 'cu',
  Circle = 'ci',
  CircleSolid = 'cis',
  Square = 'sq',
  SquareSolid = 'sqs',
  Triangle = 'tri',
  Cross = 'cr',
  GreenPlus = 'gplus',
  RedCross = 'rcross',
  YellowTriangle = 'ytri',
  Number = 'num',
  Letter = 'le',
  PositiveNode = 'pos',
  PositiveActiveNode = 'posa',
  PositiveDashedNode = 'posda',
  PositiveDottedNode = 'posdt',
  PositiveDashedActiveNode = 'posdaa',
  PositiveDottedActiveNode = 'posdta',
  NegativeNode = 'neg',
  NegativeActiveNode = 'nega',
  NegativeDashedNode = 'negda',
  NegativeDottedNode = 'negdt',
  NegativeDashedActiveNode = 'negdaa',
  NegativeDottedActiveNode = 'negdta',
  NeutralNode = 'neu',
  NeutralActiveNode = 'neua',
  NeutralDashedNode = 'neuda',
  NeutralDottedNode = 'neudt',
  NeutralDashedActiveNode = 'neudta',
  NeutralDottedActiveNode = 'neudaa',
  WarningNode = 'wa',
  WarningActiveNode = 'waa',
  WarningDashedNode = 'wada',
  WarningDottedNode = 'wadt',
  WarningDashedActiveNode = 'wadaa',
  WarningDottedActiveNode = 'wadta',
  DefaultNode = 'de',
  DefaultActiveNode = 'dea',
  DefaultDashedNode = 'deda',
  DefaultDottedNode = 'dedt',
  DefaultDashedActiveNode = 'dedaa',
  DefaultDottedActiveNode = 'dedta',
  Node = 'node',
  DashedNode = 'danode',
  DottedNode = 'dtnode',
  ActiveNode = 'anode',
  DashedActiveNode = 'danode',
  Highlight = 'hl',
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
