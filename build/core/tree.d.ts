import { SgfNode } from './types';
type Comparator<T> = (a: T, b: T) => number;
interface TreeModelConfig<T> {
    childrenPropertyName?: string;
    modelComparatorFn?: Comparator<T>;
}
declare class TNode {
    config: TreeModelConfig<SgfNode>;
    model: SgfNode;
    children: TNode[];
    parent?: TNode;
    constructor(config: TreeModelConfig<SgfNode>, model: SgfNode);
    isRoot(): boolean;
    hasChildren(): boolean;
    addChild(child: TNode): TNode;
    addChildAtIndex(child: TNode, index: number): TNode;
    getPath(): TNode[];
    getIndex(): number;
    setIndex(index: number): this;
    walk(fn: (node: TNode) => boolean | void): void;
    first(fn: (node: TNode) => boolean): TNode | undefined;
    all(fn: (node: TNode) => boolean): TNode[];
    drop(): this;
}
declare class TreeModel {
    config: TreeModelConfig<SgfNode>;
    constructor(config?: TreeModelConfig<SgfNode>);
    parse(model: SgfNode): TNode;
}
export { TreeModel, TNode, TreeModelConfig };
