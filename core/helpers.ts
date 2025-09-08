import {filter, findLastIndex} from 'lodash';
import {TNode} from './tree';
import {MoveProp, SgfPropBase} from './props';

const SparkMD5 = require('spark-md5');

export const calcHash = (
  node: TNode | null | undefined,
  moveProps: MoveProp[] = []
): string => {
  let fullname = 'n';
  if (moveProps.length > 0) {
    fullname += `${moveProps[0].token}${moveProps[0].value}`;
  }
  if (node) {
    const path = node.getPath();
    if (path.length > 0) {
      fullname = path.map(n => n.model.id).join('=>') + `=>${fullname}`;
    }
  }

  return SparkMD5.hash(fullname).slice(0, 6);
};

export function isCharacterInNode(
  sgf: string,
  n: number,
  nodes = ['C', 'TM', 'GN', 'PC']
): boolean {
  const pattern = new RegExp(`(${nodes.join('|')})\\[([^\\]]*)\\]`, 'g');
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(sgf)) !== null) {
    const contentStart = match.index + match[1].length + 1; // +1 for the '['
    const contentEnd = contentStart + match[2].length;
    if (n >= contentStart && n <= contentEnd) {
      return true;
    }
  }

  return false;
}

type Range = [number, number];

export function buildPropertyValueRanges(
  sgf: string,
  keys: string[] = ['C', 'TM', 'GN', 'PC']
): Range[] {
  const ranges: Range[] = [];
  const pattern = new RegExp(`\\b(${keys.join('|')})\\[`, 'g');

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(sgf)) !== null) {
    const propStart = match.index;
    const valueStart = propStart + match[1].length + 1; // +1 for '['

    // Check if this match is inside any existing range
    const isInsideExistingRange = ranges.some(
      ([start, end]) => propStart >= start && propStart <= end
    );

    if (isInsideExistingRange) {
      continue; // Skip this match as it's inside another property value
    }

    // Find the first unescaped closing bracket
    let i = valueStart;
    let escaped = false;

    while (i < sgf.length) {
      const char = sgf[i];

      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === ']') {
        // Found unescaped closing bracket
        break;
      }

      i++;
    }

    if (i < sgf.length) {
      ranges.push([valueStart, i]);
    }
  }

  return ranges;
}

export function isInAnyRange(index: number, ranges: Range[]): boolean {
  // ranges must be sorted
  let left = 0;
  let right = ranges.length - 1;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const [start, end] = ranges[mid];

    if (index < start) {
      right = mid - 1;
    } else if (index > end) {
      left = mid + 1;
    } else {
      return true;
    }
  }

  return false;
}

export const getDeduplicatedProps = (targetProps: SgfPropBase[]) => {
  return filter(
    targetProps,
    (prop: SgfPropBase, index: number) =>
      index ===
      findLastIndex(
        targetProps,
        (lastPro: SgfPropBase) =>
          prop.token === lastPro.token && prop.value === lastPro.value
      )
  );
};

export const isMoveNode = (n: TNode) => {
  return n.model.moveProps.length > 0;
};

export const isRootNode = (n: TNode) => {
  return n.model.rootProps.length > 0 || n.isRoot();
};

export const isSetupNode = (n: TNode) => {
  return n.model.setupProps.length > 0;
};

export const getNodeNumber = (n: TNode, parent?: TNode) => {
  const path = n.getPath();
  let movesCount = path.filter(n => isMoveNode(n)).length;
  if (parent) {
    movesCount += parent.getPath().filter(n => isMoveNode(n)).length;
  }
  return movesCount;
};
