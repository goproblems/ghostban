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
