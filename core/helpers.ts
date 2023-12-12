import TreeModel from 'tree-model';
import {RootProp} from './props';
import {SgfNode} from './types';

const tree: TreeModel = new TreeModel();

export const initialRoot = (
  rootProps = [
    'FF[4]',
    'GM[1]',
    'CA[UTF-8]',
    'AP[ghostgo:0.1.0]',
    'SZ[19]',
    'ST[0]',
  ]
) => {
  return tree.parse({
    id: 'root',
    name: 0,
    index: 0,
    number: 0,
    rootProps: rootProps.map(p => RootProp.from(p)),
    moveProps: [],
    setupProps: [],
    markupProps: [],
    gameInfoProps: [],
    nodeAnnotationProps: [],
    moveAnnotationProps: [],
    customProps: [],
  });
};

export function isCharacterInNode(
  sgf: string,
  n: number,
  nodes = ['C', 'TM', 'GN']
) {
  const res = nodes.map(node => {
    const indexOf = sgf.indexOf(node);
    if (indexOf === -1) return false;

    const startIndex = indexOf + node.length;
    const endIndex = sgf.indexOf(']', startIndex);

    if (endIndex === -1) return false;

    return n >= startIndex && n <= endIndex;
  });

  return res.includes(true);
}
