import { Center } from './types';
import { canMove, execCapture } from './boardcore';
export { canMove, execCapture };
export declare const calcCenter: (mat: number[][], boardSize?: number) => Center.TopRight | Center.TopLeft | Center.BottomLeft | Center.BottomRight | Center.Center;
export declare const calcBoardSize: (mat: number[][], boardSize?: number, extent?: number) => number[];
export declare const calcSpaceAndScaledPadding: (size: number, padding: number, boardSize: number) => {
    space: number;
    scaledPadding: number;
};
