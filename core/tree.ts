import mergeSort from './mergesort';
import {SgfNode} from './types';

function findInsertIndex<T>(
  comparatorFn: (a: T, b: T) => number,
  arr: T[],
  el: T
): number {
  let i: number;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    if (comparatorFn(arr[i], el) > 0) {
      break;
    }
  }
  return i;
}

type Comparator<T> = (a: T, b: T) => number;

interface TreeModelConfig<T> {
  childrenPropertyName?: string;
  modelComparatorFn?: Comparator<T>;
}

class TNode {
  config: TreeModelConfig<SgfNode>;
  model: SgfNode;
  children: TNode[] = [];
  parent?: TNode;

  constructor(config: TreeModelConfig<SgfNode>, model: SgfNode) {
    this.config = config;
    this.model = model;
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  addChild(child: TNode): TNode {
    return addChild(this, child);
  }

  addChildAtIndex(child: TNode, index: number): TNode {
    if (this.config.modelComparatorFn) {
      throw new Error(
        'Cannot add child at index when using a comparator function.'
      );
    }

    const prop = this.config.childrenPropertyName || 'children';
    if (!(this.model as any)[prop]) {
      (this.model as any)[prop] = [];
    }

    const modelChildren = (this.model as any)[prop];

    if (index < 0 || index > this.children.length) {
      throw new Error('Invalid index.');
    }

    child.parent = this;
    modelChildren.splice(index, 0, child.model);
    this.children.splice(index, 0, child);

    return child;
  }

  getPath(): TNode[] {
    const path: TNode[] = [];
    let current: TNode | undefined = this;
    while (current) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  getIndex(): number {
    return this.isRoot() ? 0 : this.parent!.children.indexOf(this);
  }

  setIndex(index: number): this {
    if (this.config.modelComparatorFn) {
      throw new Error(
        'Cannot set node index when using a comparator function.'
      );
    }

    if (this.isRoot()) {
      if (index === 0) {
        return this;
      }
      throw new Error('Invalid index.');
    }

    if (!this.parent) {
      throw new Error('Node has no parent.');
    }

    const siblings = this.parent.children;
    const modelSiblings = (this.parent.model as any)[
      this.config.childrenPropertyName || 'children'
    ];

    const oldIndex = siblings.indexOf(this);

    if (index < 0 || index >= siblings.length) {
      throw new Error('Invalid index.');
    }

    siblings.splice(index, 0, siblings.splice(oldIndex, 1)[0]);
    modelSiblings.splice(index, 0, modelSiblings.splice(oldIndex, 1)[0]);

    return this;
  }

  walk(fn: (node: TNode) => boolean | void): void {
    const walkRecursive = (node: TNode): boolean => {
      if (fn(node) === false) return false;
      for (const child of node.children) {
        if (walkRecursive(child) === false) return false;
      }
      return true;
    };
    walkRecursive(this);
  }

  first(fn: (node: TNode) => boolean): TNode | undefined {
    let result: TNode | undefined;
    this.walk(node => {
      if (fn(node)) {
        result = node;
        return false;
      }
    });
    return result;
  }

  all(fn: (node: TNode) => boolean): TNode[] {
    const result: TNode[] = [];
    this.walk(node => {
      if (fn(node)) result.push(node);
    });
    return result;
  }

  drop(): this {
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      if (idx >= 0) {
        this.parent.children.splice(idx, 1);
        const prop = this.config.childrenPropertyName || 'children';
        (this.parent.model as any)[prop].splice(idx, 1);
      }
      this.parent = undefined;
    }
    return this;
  }
}

function addChild(parent: TNode, child: TNode): TNode {
  const prop = parent.config.childrenPropertyName || 'children';
  if (!(parent.model as any)[prop]) {
    (parent.model as any)[prop] = [];
  }

  const modelChildren = (parent.model as any)[prop];

  child.parent = parent;
  if (parent.config.modelComparatorFn) {
    const index = findInsertIndex(
      parent.config.modelComparatorFn,
      modelChildren,
      child.model
    );
    modelChildren.splice(index, 0, child.model);
    parent.children.splice(index, 0, child);
  } else {
    modelChildren.push(child.model);
    parent.children.push(child);
  }

  return child;
}

class TreeModel {
  config: TreeModelConfig<SgfNode>;

  constructor(config: TreeModelConfig<SgfNode> = {}) {
    this.config = {
      childrenPropertyName: config.childrenPropertyName || 'children',
      modelComparatorFn: config.modelComparatorFn,
    };
  }

  parse(model: SgfNode): TNode {
    if (typeof model !== 'object' || model === null) {
      throw new TypeError('Model must be of type object.');
    }

    const node = new TNode(this.config, model);
    const prop = this.config.childrenPropertyName!;
    const children = (model as any)[prop];

    if (Array.isArray(children)) {
      if (this.config.modelComparatorFn) {
        (model as any)[prop] = mergeSort(
          this.config.modelComparatorFn,
          children
        );
      }
      for (const childModel of (model as any)[prop]) {
        const childNode = this.parse(childModel);
        addChild(node, childNode);
      }
    }

    return node;
  }
}

export {TreeModel, TNode, TreeModelConfig};
