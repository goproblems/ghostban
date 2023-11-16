import TreeModel from 'tree-model';
import {RootProp} from './props';
import {SgfNode} from './types';

const tree: TreeModel = new TreeModel();

const initRootProps = [
  'FF[4]',
  'GM[1]',
  'CA[UTF-8]',
  'AP[ghostgo:0.1.0]',
  'SZ[19]',
  'ST[0]',
].map(p => RootProp.from(p));

export const initialRoot = () =>
  tree.parse({
    id: 'root',
    name: 0,
    index: 0,
    number: 0,
    rootProps: initRootProps,
    moveProps: [],
    setupProps: [],
    markupProps: [],
    gameInfoProps: [],
    nodeAnnotationProps: [],
    moveAnnotationProps: [],
    customProps: [],
  });

export const isCharacterSurroundedBySquareBrackets = (
  str: string,
  position: number
): boolean => {
  if (position < 0 || position >= str.length) {
    return false;
  }

  let openBracketIndex = -1;
  let closeBracketIndex = -1;

  for (let i = position; i >= 0; i--) {
    if (str[i] === '[') {
      openBracketIndex = i;
      break;
    }
  }

  for (let i = position; i < str.length; i++) {
    if (str[i] === ']') {
      closeBracketIndex = i;
      break;
    }
  }

  if (
    openBracketIndex !== -1 &&
    closeBracketIndex !== -1 &&
    openBracketIndex < closeBracketIndex
  ) {
    console.log(str[position]);
    return true;
  }

  return false;
};

export function checkInComment(sgf: string, n: number) {
  const indexOfC = sgf.indexOf('C[');
  if (indexOfC === -1) {
    return false;
  }

  const commentStartIndex = indexOfC + 2;
  const commentEndIndex = sgf.indexOf(']', commentStartIndex);

  if (commentEndIndex === -1) {
    return false;
  }

  return n >= commentStartIndex && n <= commentEndIndex;
}
