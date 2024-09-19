import TreeModel from 'tree-model';
import { SgfNode } from './core/types';
import { Center } from './types';
import { canMove, execCapture } from './boardcore';
export { canMove, execCapture };
export declare const calcCenter: (mat: number[][], boardSize?: number) => Center.TopRight | Center.TopLeft | Center.BottomLeft | Center.BottomRight | Center.Center;
export declare const calcBoardSize: (mat: number[][], boardSize?: number, extent?: number) => number[];
export declare const calcSHA_deprecated: (node: TreeModel.Node<SgfNode> | null | undefined, moveProps?: any, setupProps?: any) => string;
export declare const calcSpaceAndScaledPadding: (size: number, padding: number, boardSize: number) => {
    space: number;
    scaledPadding: number;
};
