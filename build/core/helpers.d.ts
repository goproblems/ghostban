export declare function isCharacterInNode(sgf: string, n: number, nodes?: string[]): boolean;
type Range = [number, number];
export declare function buildNodeRanges(sgf: string, keys?: string[]): Range[];
export declare function isInAnyRange(index: number, ranges: Range[]): boolean;
export {};
