import {cloneDeep} from 'lodash';
import {SGF_LETTERS} from './const';

// TODO: Duplicate with helpers.ts to avoid circular dependency
export const sgfToPos = (str: string) => {
  const ki = str[0] === 'B' ? 1 : -1;
  const tempStr = /\[(.*)\]/.exec(str);
  if (tempStr) {
    const pos = tempStr[1];
    const x = SGF_LETTERS.indexOf(pos[0]);
    const y = SGF_LETTERS.indexOf(pos[1]);
    return {x, y, ki};
  }
  return {x: -1, y: -1, ki: 0};
};

let liberties = 0;
let recursionPath: string[] = [];

/**
 * Calculates the size of a matrix.
 * @param mat The matrix to calculate the size of.
 * @returns An array containing the number of rows and columns in the matrix.
 */
const calcSize = (mat: number[][]) => {
  const rowsSize = mat.length;
  const columnsSize = mat.length > 0 ? mat[0].length : 0;
  return [rowsSize, columnsSize];
};

/**
 * Calculates the liberty of a stone on the board.
 * @param mat - The board matrix.
 * @param x - The x-coordinate of the stone.
 * @param y - The y-coordinate of the stone.
 * @param ki - The value of the stone.
 */
const calcLibertyCore = (mat: number[][], x: number, y: number, ki: number) => {
  const size = calcSize(mat);
  if (x >= 0 && x < size[1] && y >= 0 && y < size[0]) {
    if (mat[x][y] === ki && !recursionPath.includes(`${x},${y}`)) {
      recursionPath.push(`${x},${y}`);
      calcLibertyCore(mat, x - 1, y, ki);
      calcLibertyCore(mat, x + 1, y, ki);
      calcLibertyCore(mat, x, y - 1, ki);
      calcLibertyCore(mat, x, y + 1, ki);
    } else if (mat[x][y] === 0) {
      liberties += 1;
    }
  }
};

const calcLiberty = (mat: number[][], x: number, y: number, ki: number) => {
  const size = calcSize(mat);
  liberties = 0;
  recursionPath = [];

  if (x < 0 || y < 0 || x > size[1] - 1 || y > size[0] - 1) {
    return {
      liberty: 4,
      recursionPath: [],
    };
  }

  if (mat[x][y] === 0) {
    return {
      liberty: 4,
      recursionPath: [],
    };
  }
  calcLibertyCore(mat, x, y, ki);
  return {
    liberty: liberties,
    recursionPath,
  };
};

export const execCapture = (
  mat: number[][],
  i: number,
  j: number,
  ki: number
) => {
  const newArray = mat;
  const {liberty: libertyUp, recursionPath: recursionPathUp} = calcLiberty(
    mat,
    i,
    j - 1,
    ki
  );
  const {liberty: libertyDown, recursionPath: recursionPathDown} = calcLiberty(
    mat,
    i,
    j + 1,
    ki
  );
  const {liberty: libertyLeft, recursionPath: recursionPathLeft} = calcLiberty(
    mat,
    i - 1,
    j,
    ki
  );
  const {liberty: libertyRight, recursionPath: recursionPathRight} =
    calcLiberty(mat, i + 1, j, ki);
  if (libertyUp === 0) {
    recursionPathUp.forEach(item => {
      const coord = item.split(',');
      newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
    });
  }
  if (libertyDown === 0) {
    recursionPathDown.forEach(item => {
      const coord = item.split(',');
      newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
    });
  }
  if (libertyLeft === 0) {
    recursionPathLeft.forEach(item => {
      const coord = item.split(',');
      newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
    });
  }
  if (libertyRight === 0) {
    recursionPathRight.forEach(item => {
      const coord = item.split(',');
      newArray[parseInt(coord[0])][parseInt(coord[1])] = 0;
    });
  }
  return newArray;
};

const canCapture = (mat: number[][], i: number, j: number, ki: number) => {
  const {liberty: libertyUp, recursionPath: recursionPathUp} = calcLiberty(
    mat,
    i,
    j - 1,
    ki
  );
  const {liberty: libertyDown, recursionPath: recursionPathDown} = calcLiberty(
    mat,
    i,
    j + 1,
    ki
  );
  const {liberty: libertyLeft, recursionPath: recursionPathLeft} = calcLiberty(
    mat,
    i - 1,
    j,
    ki
  );
  const {liberty: libertyRight, recursionPath: recursionPathRight} =
    calcLiberty(mat, i + 1, j, ki);
  if (libertyUp === 0 && recursionPathUp.length > 0) {
    return true;
  }
  if (libertyDown === 0 && recursionPathDown.length > 0) {
    return true;
  }
  if (libertyLeft === 0 && recursionPathLeft.length > 0) {
    return true;
  }
  if (libertyRight === 0 && recursionPathRight.length > 0) {
    return true;
  }
  return false;
};

/**
 * Compare if two board states are completely identical
 */
export const boardStatesEqual = (
  board1: number[][],
  board2: number[][]
): boolean => {
  if (board1.length !== board2.length) return false;

  for (let i = 0; i < board1.length; i++) {
    if (board1[i].length !== board2[i].length) return false;
    for (let j = 0; j < board1[i].length; j++) {
      if (board1[i][j] !== board2[i][j]) return false;
    }
  }

  return true;
};

/**
 * Simulate the board state after making a move at specified position (including captures)
 */
export const simulateMoveWithCapture = (
  mat: number[][],
  i: number,
  j: number,
  ki: number
): number[][] => {
  const newMat = cloneDeep(mat);
  newMat[i][j] = ki;

  // Execute captures
  return execCapture(newMat, i, j, -ki);
};

export const canMove = (
  mat: number[][],
  i: number,
  j: number,
  ki: number,
  previousBoardState?: number[][] | null
) => {
  if (i < 0 || j < 0 || i >= mat.length || j >= (mat[0]?.length ?? 0)) {
    return false;
  }

  if (mat[i][j] !== 0) {
    return false;
  }

  // Simulate the board state after the move (including captures)
  const boardStateAfterMove = simulateMoveWithCapture(mat, i, j, ki);

  // Ko rule check: if the board state after move is identical to previous state, it violates ko rule
  if (
    previousBoardState &&
    boardStatesEqual(boardStateAfterMove, previousBoardState)
  ) {
    return false;
  }

  // Check suicide rule: if after placing the stone it has no liberties and cannot capture opponent stones, it's illegal
  const newArray = cloneDeep(mat);
  newArray[i][j] = ki;
  const {liberty} = calcLiberty(newArray, i, j, ki);

  if (canCapture(newArray, i, j, -ki)) {
    return true; // Can capture opponent stones, legal move
  }
  if (canCapture(newArray, i, j, ki)) {
    return false; // Own stones would be captured, illegal move
  }
  if (liberty === 0) {
    return false; // No liberties and cannot capture, illegal move
  }
  return true;
};

export const showKi = (
  array: number[][],
  steps: string[],
  isCaptured = true
) => {
  let newMat = cloneDeep(array);
  let hasMoved = false;
  steps.forEach(str => {
    const {
      x,
      y,
      ki,
    }: {
      x: number;
      y: number;
      ki: number;
    } = sgfToPos(str);
    if (isCaptured) {
      if (canMove(newMat, x, y, ki)) {
        newMat[x][y] = ki;
        newMat = execCapture(newMat, x, y, -ki);
        hasMoved = true;
      }
    } else {
      newMat[x][y] = ki;
      hasMoved = true;
    }
  });

  return {
    arrangement: newMat,
    hasMoved,
  };
};
