import TreeModel from 'tree-model';
import { SgfNode, SgfNodeOptions } from './core/types';
import { SetupProp, MoveProp, CustomProp, SgfPropBase, NodeAnnotationProp } from './core/props';
import { Analysis, GhostBanOptions, Ki, MoveInfo, ProblemAnswerType as PAT, RootInfo } from './types';
import { Center } from './types';
export declare const calcDoubtfulMovesThresholdRange: (threshold: number) => {
    evil: {
        winrateRange: number[];
        scoreRange: number[];
    };
    bad: {
        winrateRange: number[];
        scoreRange: number[];
    };
    poor: {
        winrateRange: number[];
        scoreRange: number[];
    };
    ok: {
        winrateRange: number[];
        scoreRange: number[];
    };
    good: {
        winrateRange: number[];
        scoreRange: number[];
    };
    great: {
        winrateRange: number[];
        scoreRange: number[];
    };
};
export declare const round2: (v: number, scale?: number, fixed?: number) => string;
export declare const round3: (v: number, scale?: number, fixed?: number) => string;
export declare const getDeduplicatedProps: (targetProps: SgfPropBase[]) => SgfPropBase[];
export declare const isMoveNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isRooNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isSetupNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isAnswerNode: (n: TreeModel.Node<SgfNode>, kind: PAT) => boolean;
export declare const getNodeNumber: (n: TreeModel.Node<SgfNode>, parent?: TreeModel.Node<SgfNode>) => number;
export declare const calcSHA: (node: TreeModel.Node<SgfNode> | null | undefined, moveProps?: any, setupProps?: any) => string;
export declare const nFormatter: (num: number, fixed?: number) => string;
export declare const pathToIndexes: (path: TreeModel.Node<SgfNode>[]) => number[];
export declare const pathToInitialStones: (path: TreeModel.Node<SgfNode>[], xOffset?: number, yOffset?: number) => string[][];
export declare const pathToAiMoves: (path: TreeModel.Node<SgfNode>[], xOffset?: number, yOffset?: number) => any[][];
export declare const getIndexFromAnalysis: (a: Analysis) => any;
export declare const isMainPath: (node: TreeModel.Node<SgfNode>) => boolean;
export declare const sgfToPos: (str: string) => {
    x: number;
    y: number;
    ki: number;
};
export declare const sgfToA1: (str: string) => string;
export declare const a1ToPos: (move: string) => {
    x: number;
    y: number;
};
export declare const a1ToIndex: (move: string, boardSize?: number) => number;
export declare const sgfOffset: (sgf: any, offset?: number) => any;
export declare const a1ToSGF: (str: any, type?: string, offsetX?: number, offsetY?: number) => string;
export declare const posToSgf: (x: number, y: number, ki: number) => string;
export declare const matToPosition: (mat: number[][], xOffset?: number, yOffset?: number) => string;
export declare const matToListOfTuples: (mat: number[][], xOffset?: number, yOffset?: number) => string[][];
export declare const convertStoneTypeToString: (type: any) => "B" | "W";
export declare const convertStepsForAI: (steps: any, offset?: number) => string;
export declare const reverseOffsetA1Move: (move: string, mat: number[][], analysis: Analysis) => string;
export declare const calcScoreDiffText: (prev?: RootInfo | null, curr?: MoveInfo | RootInfo | null, fixed?: number, reverse?: boolean) => string;
export declare const calcWinrateDiffText: (prev?: RootInfo | null, curr?: MoveInfo | RootInfo | null, fixed?: number, reverse?: boolean) => string;
export declare const calcScoreDiff: (prevInfo: RootInfo, currInfo: MoveInfo | RootInfo) => number;
export declare const calcWinrateDiff: (prevInfo: RootInfo, currInfo: MoveInfo | RootInfo) => number;
export declare const extractPAI: (n: TreeModel.Node<SgfNode>) => any;
export declare const extractAnswerKind: (n: TreeModel.Node<SgfNode>) => PAT | undefined;
export declare const extractPI: (n: TreeModel.Node<SgfNode>) => any;
export declare const initNodeData: (sha: string, number?: number) => SgfNode;
export declare const buildMoveNode: (move: string, parentNode?: TreeModel.Node<SgfNode>, props?: SgfNodeOptions) => TreeModel.Node<{
    id: string;
    name: string;
    number: number;
    moveProps: MoveProp[];
    setupProps: SetupProp[];
    rootProps: import("./core/props").RootProp[];
    markupProps: import("./core/props").MarkupProp[];
    gameInfoProps: import("./core/props").GameInfoProp[];
    nodeAnnotationProps: NodeAnnotationProp[];
    moveAnnotationProps: import("./core/props").MoveAnnotationProp[];
    customProps: CustomProp[];
    index?: number | undefined;
}>;
export declare const getLastIndex: (root: TreeModel.Node<SgfNode>) => any;
export declare const cutMoveNodes: (root: TreeModel.Node<SgfNode>, returnRoot?: boolean) => TreeModel.Node<SgfNode>;
export declare const calcSpaceAndScaledPadding: (size: number, padding: number, boardSize: number) => {
    space: number;
    scaledPadding: number;
};
export declare const zeros: (size: [number, number]) => any[][];
export declare const empty: (size: [number, number]) => string[][];
export declare const calcMost: (mat: number[][], boardSize?: number) => {
    leftMost: number;
    rightMost: number;
    topMost: number;
    bottomMost: number;
};
export declare const calcCenter: (mat: number[][], boardSize?: number) => Center;
export declare const calcBoardSize: (mat: number[][], boardSize?: number, extend?: number) => number[];
export declare const calcPartialArea: (mat: number[][], extend?: number) => [[number, number], [number, number]];
export declare const calcOffset: (mat: number[][]) => {
    x: number;
    y: number;
};
export declare const reverseOffset: (mat: number[][], bx?: number, by?: number) => {
    x: number;
    y: number;
};
export declare const calcVisibleArea: (mat: number[][], boardSize?: number, extend?: number) => {
    visibleArea: number[][];
    center: Center;
};
export declare function canMove(mat: number[][], i: number, j: number, ki: number): boolean;
export declare function move(mat: number[][], i: number, j: number, ki: number): number[][];
export declare function showKi(mat: number[][], steps: string[], isPonnuki?: boolean): {
    arrangement: number[][];
    hasMoved: boolean;
};
export declare const calcTransform: (size: number, mat: number[][], options: GhostBanOptions) => {
    va: number[][];
    scale: number;
    translateX: number;
    translateY: number;
    center: Center;
    clip: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    space: number;
    transform: any;
};
export declare const handleMove: (mat: number[][], i: number, j: number, turn: Ki, currentNode: TreeModel.Node<SgfNode>, onAfterMove: (node: TreeModel.Node<SgfNode>, isMoved: boolean) => void) => void;
