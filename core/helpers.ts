import TreeModel from 'tree-model';
import {RootProp} from './props';
import {SgfNode} from './types';

const tree: TreeModel = new TreeModel();

export function isCharacterInNode(
  sgf: string,
  n: number,
  nodes = ['C', 'TM', 'GN']
) {
  const res = nodes.map(node => {
    const indexOf = sgf.slice(0, n).lastIndexOf(node);
    if (indexOf === -1) return false;

    const startIndex = indexOf + node.length;
    const endIndex = sgf.indexOf(']', startIndex);

    if (endIndex === -1) return false;

    return n >= startIndex && n <= endIndex;
  });

  return res.includes(true);
}
