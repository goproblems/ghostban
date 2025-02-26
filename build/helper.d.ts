import TreeModel from 'tree-model';
import { SgfNode, SgfNodeOptions } from './core/types';
import { SetupProp, MoveProp, CustomProp, SgfPropBase, NodeAnnotationProp, GameInfoProp, MoveAnnotationProp, RootProp, MarkupProp } from './core/props';
import { Analysis, Ki, MoveInfo, ProblemAnswerType as PAT, RootInfo, PathDetectionStrategy } from './types';
import { Center } from './types';
import { canMove, execCapture } from './boardcore';
export { canMove, execCapture };
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
export declare const isRootNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isSetupNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isAnswerNode: (n: TreeModel.Node<SgfNode>, kind: PAT) => boolean;
export declare const isChoiceNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isTargetNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isForceNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isPreventMoveNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isRightNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isFirstRightNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const isVariantNode: (n: TreeModel.Node<SgfNode>) => any;
export declare const isWrongNode: (n: TreeModel.Node<SgfNode>) => boolean;
export declare const inPath: (node: TreeModel.Node<SgfNode>, detectionMethod: (n: TreeModel.Node<SgfNode>) => boolean, strategy: PathDetectionStrategy | undefined, preNodes: TreeModel.Node<SgfNode>[] | undefined, postNodes: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inRightPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inFirstRightPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inFirstBranchRightPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inChoicePath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inTargetPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inVariantPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const inWrongPath: (node: TreeModel.Node<SgfNode>, strategy?: PathDetectionStrategy, preNodes?: TreeModel.Node<SgfNode>[] | undefined, postNodes?: TreeModel.Node<SgfNode>[] | undefined) => boolean;
export declare const getNodeNumber: (n: TreeModel.Node<SgfNode>, parent?: TreeModel.Node<SgfNode>) => number;
export declare const calcSHA: (node: TreeModel.Node<SgfNode> | null | undefined, moveProps?: MoveProp[]) => any;
export declare const __calcSHA_Deprecated: (node: TreeModel.Node<SgfNode> | null | undefined, moveProps?: any, setupProps?: any) => any;
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
export declare const offsetA1Move: (move: string, ox?: number, oy?: number) => string;
export declare const reverseOffsetA1Move: (move: string, mat: number[][], analysis: Analysis, boardSize?: number) => string;
export declare const calcScoreDiffText: (rootInfo?: RootInfo | null, currInfo?: MoveInfo | RootInfo | null, fixed?: number, reverse?: boolean) => string;
export declare const calcWinrateDiffText: (rootInfo?: RootInfo | null, currInfo?: MoveInfo | RootInfo | null, fixed?: number, reverse?: boolean) => string;
export declare const calcScoreDiff: (rootInfo: RootInfo, currInfo: MoveInfo | RootInfo) => number;
export declare const calcWinrateDiff: (rootInfo: RootInfo, currInfo: MoveInfo | RootInfo) => number;
export declare const calcAnalysisPointColor: (rootInfo: RootInfo, moveInfo: MoveInfo) => string;
export declare const extractPAI: (n: TreeModel.Node<SgfNode>) => any;
export declare const extractAnswerType: (n: TreeModel.Node<SgfNode>) => PAT | undefined;
export declare const extractPI: (n: TreeModel.Node<SgfNode>) => any;
export declare const initNodeData: (sha: string, number?: number) => SgfNode;
/**
 * Creates the initial root node of the tree.
 *
 * @param rootProps - The root properties.
 * @returns The initial root node.
 */
export declare const initialRootNode: (rootProps?: string[]) => TreeModel.Node<{
    id: string;
    name: number;
    index: number;
    number: number;
    rootProps: RootProp[];
    moveProps: never[];
    setupProps: never[];
    markupProps: never[];
    gameInfoProps: never[];
    nodeAnnotationProps: never[];
    moveAnnotationProps: never[];
    customProps: never[];
}>;
/**
 * Builds a new tree node with the given move, parent node, and additional properties.
 *
 * @param move - The move to be added to the node.
 * @param parentNode - The parent node of the new node. Optional.
 * @param props - Additional properties to be added to the new node. Optional.
 * @returns The newly created tree node.
 */
export declare const buildMoveNode: (move: string, parentNode?: TreeModel.Node<SgfNode>, props?: SgfNodeOptions) => TreeModel.Node<{
    id: string;
    name: string;
    number: number;
    moveProps: MoveProp[];
    setupProps: SetupProp[];
    rootProps: RootProp[];
    markupProps: MarkupProp[];
    gameInfoProps: GameInfoProp[];
    nodeAnnotationProps: NodeAnnotationProp[];
    moveAnnotationProps: MoveAnnotationProp[];
    customProps: CustomProp[];
    index?: number | undefined;
}>;
export declare const getLastIndex: (root: TreeModel.Node<SgfNode>) => any;
export declare const cutMoveNodes: (root: TreeModel.Node<SgfNode>, returnRoot?: boolean) => TreeModel.Node<SgfNode>;
export declare const getRoot: (node: TreeModel.Node<SgfNode>) => TreeModel.Node<SgfNode>;
export declare const zeros: (size: [number, number]) => number[][];
export declare const empty: (size: [number, number]) => string[][];
export declare const calcMost: (mat: number[][], boardSize?: number) => {
    leftMost: number;
    rightMost: number;
    topMost: number;
    bottomMost: number;
};
export declare const calcCenter: (mat: number[][], boardSize?: number) => Center.TopRight | Center.TopLeft | Center.BottomLeft | Center.BottomRight | Center.Center;
export declare const calcBoardSize: (mat: number[][], boardSize?: number, extent?: number) => number[];
export declare const calcPartialArea: (mat: number[][], extent?: number, boardSize?: number) => [[number, number], [number, number]];
export declare const calcAvoidMovesForPartialAnalysis: (partialArea: [[number, number], [number, number]], boardSize?: number) => string[];
export declare const calcTsumegoFrame: (mat: number[][], extent: number, boardSize?: number, komi?: number, turn?: Ki, ko?: boolean) => number[][];
export declare const calcOffset: (mat: number[][]) => {
    x: number;
    y: number;
};
export declare const reverseOffset: (mat: number[][], bx?: number, by?: number, boardSize?: number) => {
    x: number;
    y: number;
};
export declare function calcVisibleArea(mat: number[][] | undefined, extent: number, allowRectangle?: boolean): number[][];
export declare function move(mat: number[][], i: number, j: number, ki: number): number[][];
export declare function showKi(mat: number[][], steps: string[], isCaptured?: boolean): {
    arrangement: number[][];
    hasMoved: boolean;
};
export declare const handleMove: (mat: number[][], i: number, j: number, turn: Ki, currentNode: TreeModel.Node<SgfNode>, onAfterMove: (node: TreeModel.Node<SgfNode>, isMoved: boolean) => void) => void;
/**
 * Clear stone from the currentNode
 * @param currentNode
 * @param value
 */
export declare const clearStoneFromCurrentNode: (currentNode: TreeModel.Node<SgfNode>, value: string) => void;
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
export declare const addStoneToCurrentNode: (currentNode: TreeModel.Node<SgfNode>, mat: number[][], i: number, j: number, ki: Ki) => boolean;
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
export declare const addMoveToCurrentNode: (currentNode: TreeModel.Node<SgfNode>, mat: number[][], i: number, j: number, ki: Ki) => any;
export declare const calcPreventMoveMatForDisplayOnly: (node: TreeModel.Node<SgfNode>, defaultBoardSize?: number) => number[][];
export declare const calcPreventMoveMat: (node: TreeModel.Node<SgfNode>, defaultBoardSize?: number) => number[][];
/**
 * Calculates the markup matrix for variations in a given SGF node.
 *
 * @param node - The SGF node to calculate the markup for.
 * @param policy - The policy for handling the markup. Defaults to 'append'.
 * @returns The calculated markup for the variations.
 */
export declare const calcVariationsMarkup: (node: TreeModel.Node<SgfNode>, policy?: 'append' | 'prepend' | 'replace', defaultBoardSize?: number) => string[][];
export declare const detectST: (node: TreeModel.Node<SgfNode>) => {
    showVariationsMarkup: boolean;
    showChildrenMarkup: boolean;
    showSiblingsMarkup: boolean;
};
/**
 * Calculates the mat and markup arrays based on the currentNode and defaultBoardSize.
 * @param currentNode The current node in the tree.
 * @param defaultBoardSize The default size of the board (optional, default is 19).
 * @returns An object containing the mat/visibleAreaMat/markup/numMarkup arrays.
 */
export declare const calcMatAndMarkup: (currentNode: TreeModel.Node<SgfNode>, defaultBoardSize?: number) => {
    mat: number[][];
    visibleAreaMat: number[][];
    markup: string[][];
    numMarkup: string[][];
};
/**
 * Finds a property in the given node based on the provided token.
 * @param node The node to search for the property.
 * @param token The token of the property to find.
 * @returns The found property or null if not found.
 */
export declare const findProp: (node: TreeModel.Node<SgfNode>, token: string) => any;
/**
 * Finds properties in a given node based on the provided token.
 * @param node - The node to search for properties.
 * @param token - The token to match against the properties.
 * @returns An array of properties that match the provided token.
 */
export declare const findProps: (node: TreeModel.Node<SgfNode>, token: string) => any;
export declare const genMove: (node: TreeModel.Node<SgfNode>, onRight: (path: string) => void, onWrong: (path: string) => void, onVariant: (path: string) => void, onOffPath: (path: string) => void) => TreeModel.Node<SgfNode>;
export declare const extractBoardSize: (node: TreeModel.Node<SgfNode>, defaultBoardSize?: number) => number;
export declare const getFirstToMoveColorFromRoot: (root: TreeModel.Node<SgfNode> | undefined | null, defaultMoveColor?: Ki) => Ki;
export declare const getFirstToMoveColorFromSgf: (sgf: string, defaultMoveColor?: Ki) => Ki;
export declare const getMoveColor: (node: TreeModel.Node<SgfNode>, defaultMoveColor?: Ki) => Ki;
