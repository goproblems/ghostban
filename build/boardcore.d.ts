export declare const execCapture: (mat: number[][], i: number, j: number, ki: number) => number[][];
export declare const canMove: (mat: number[][], i: number, j: number, ki: number) => boolean;
export declare const showKi: (array: number[][], steps: string[], isCaptured?: boolean) => {
    arrangement: number[][];
    hasMoved: boolean;
};
