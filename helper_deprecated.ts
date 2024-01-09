import TreeModel from 'tree-model';
import {calcMost} from './helper';
import {SgfNode} from './core/types';
import sha256 from 'crypto-js/sha256';

import {Center} from './types';

import {canMove, execCapture} from './boardcore';
export {canMove, execCapture};
export const calcCenter = (mat: number[][], boardSize = 19) => {
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  const top = topMost < boardSize - 1 - bottomMost;
  const left = leftMost < boardSize - 1 - rightMost;
  if (top && left) return Center.TopLeft;
  if (!top && left) return Center.BottomLeft;
  if (top && !left) return Center.TopRight;
  if (!top && !left) return Center.BottomRight;
  return Center.Center;
};

export const calcBoardSize = (
  mat: number[][],
  boardSize = 19,
  extent = 2
): number[] => {
  const result = [19, 19];
  const center = calcCenter(mat);
  const {leftMost, rightMost, topMost, bottomMost} = calcMost(mat, boardSize);
  if (center === Center.TopLeft) {
    result[0] = rightMost + extent + 1;
    result[1] = bottomMost + extent + 1;
  }
  if (center === Center.TopRight) {
    result[0] = boardSize - leftMost + extent;
    result[1] = bottomMost + extent + 1;
  }
  if (center === Center.BottomLeft) {
    result[0] = rightMost + extent + 1;
    result[1] = boardSize - topMost + extent;
  }
  if (center === Center.BottomRight) {
    result[0] = boardSize - leftMost + extent;
    result[1] = boardSize - topMost + extent;
  }
  result[0] = Math.min(result[0], boardSize);
  result[1] = Math.min(result[1], boardSize);

  return result;
};

export const calcSHA_deprecated = (
  node: TreeModel.Node<SgfNode> | null | undefined,
  moveProps: any = [],
  setupProps: any = []
) => {
  let nodeType = 'r';
  if (moveProps.length > 0) nodeType = 'm';
  if (setupProps.length > 0) nodeType = 's';

  let n = `${nodeType}`;
  if (moveProps.length > 0) n += `${moveProps[0].token}${moveProps[0].value}`;

  let fullname = n;
  if (node) {
    fullname =
      node
        .getPath()
        .map((n: TreeModel.Node<SgfNode>) => n.model.id)
        .join('=>') +
      '=>' +
      n;
  }

  const sha = sha256(fullname).toString().slice(0, 6);
  return sha;
};

export const calcSpaceAndScaledPadding = (
  size: number,
  padding: number,
  boardSize: number
) => {
  const newSpace = (size - padding * 2) / boardSize;
  return {space: newSpace, scaledPadding: padding + newSpace / 2};
};

// export const calcTransform = (
//   size: number,
//   mat: number[][],
//   options: GhostBanOptions
// ) => {
//   const {boardSize, extent, padding, zoom} = options;
//   const zoomedVisibleArea = calcVisibleArea(mat, extent);
//   const va = zoom
//     ? zoomedVisibleArea
//     : [
//         [0, 18],
//         [0, 18],
//       ];

//   const zoomedBoardSize = va[0][1] - va[0][0] + 1;
//   const {space} = calcSpaceAndScaledPadding(size, padding, boardSize);
//   // const scale = 1 / (zoomedBoardSize / boardSize);
//   const scale = size / (zoomedBoardSize * space + padding);
//   const clip = {
//     x: 0,
//     y: 0,
//     width: zoom ? size / scale : size,
//     height: zoom ? size / scale : size,
//   };
//   const transform: any = [];

//   if (
//     zoom &&
//     !(va[0][0] === 0 && va[0][1] === 18 && va[1][0] === 0 && va[1][1] === 18)
//   ) {
//     let offsetX = 0;
//     let offsetY = 0;
//     // const offset = this.options.padding;
//     const offset = padding * scale;

//     // This offset formula is not accurate, just try many time
//     // const offset = (padding * scale - (space * scale) / 2.5) * scale;

//     switch (center) {
//       case Center.TopLeft:
//         break;
//       case Center.TopRight:
//         clip.x = size - size / scale;
//         offsetX = va[0][0] * space * scale + offset;
//         break;
//       case Center.BottomLeft:
//         clip.y = size - size / scale;
//         offsetY = va[1][0] * space * scale + offset;
//         break;
//       case Center.BottomRight:
//         clip.x = size - size / scale;
//         clip.y = size - size / scale;
//         offsetX = va[0][0] * space * scale + offset;
//         offsetY = va[1][0] * space * scale + offset;
//         break;
//     }

//     return {
//       va,
//       scale,
//       translateX: -offsetX,
//       translateY: -offsetY,
//       center,
//       clip,
//       space,
//       // transform: [{translateX: -offsetX, translateY: -offsetY}, {scale}],
//       transform: [
//         {
//           translateX: -offsetX,
//           // translateX: 0,
//         },
//         {
//           translateY: -offsetY,
//           // translateY: 0,
//         },
//         {scale},
//       ],
//     };
//   } else {
//     return {
//       va,
//       scale: 1,
//       translateX: 0,
//       translateY: 0,
//       center,
//       clip,
//       space,
//       transform,
//     };
//   }
// };
