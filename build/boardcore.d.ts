export declare const sgfToPos: (str: string) => {
    x: number;
    y: number;
    ki: number;
};
export declare const execCapture: (mat: number[][], i: number, j: number, ki: number) => number[][];
export declare const canMove: (mat: number[][], i: number, j: number, ki: number) => boolean;
export declare const showKi: (array: number[][], steps: string[], isCaptured?: boolean) => {
    arrangement: number[][];
    hasMoved: boolean;
};
