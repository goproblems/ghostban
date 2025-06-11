type Comparator<T> = (a: T, b: T) => number;
interface TreeModelConfig<T> {
    childrenPropertyName?: string;
    modelComparatorFn?: Comparator<T>;
}
declare class Node<T> {
    config: TreeModelConfig<T>;
    model: T;
    children: Node<T>[];
    parent?: Node<T>;
    constructor(config: TreeModelConfig<T>, model: T);
    isRoot(): boolean;
    hasChildren(): boolean;
    addChild(child: Node<T>): Node<T>;
    getPath(): Node<T>[];
    getIndex(): number;
    walk(fn: (node: Node<T>) => boolean | void): void;
    first(fn: (node: Node<T>) => boolean): Node<T> | undefined;
    all(fn: (node: Node<T>) => boolean): Node<T>[];
    drop(): this;
}
declare class TreeModel<T> {
    config: TreeModelConfig<T>;
    constructor(config?: TreeModelConfig<T>);
    parse(model: T): Node<T>;
}
export { TreeModel, Node, TreeModelConfig };
