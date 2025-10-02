export declare const sgfToPos: (str: string) => {
    x: number;
    y: number;
    ki: number;
};
export declare const execCapture: (mat: number[][], i: number, j: number, ki: number) => number[][];
/**
 * Compare if two board states are completely identical
 */
export declare const boardStatesEqual: (board1: number[][], board2: number[][]) => boolean;
/**
 * Simulate the board state after making a move at specified position (including captures)
 */
export declare const simulateMoveWithCapture: (mat: number[][], i: number, j: number, ki: number) => number[][];
export declare const canMove: (mat: number[][], i: number, j: number, ki: number, previousBoardState?: number[][] | null) => boolean;
export declare const showKi: (array: number[][], steps: string[], isCaptured?: boolean) => {
    arrangement: number[][];
    hasMoved: boolean;
};
