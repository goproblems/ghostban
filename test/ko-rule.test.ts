import {describe, expect, test} from '@jest/globals';
import {
  canMove,
  execCapture,
  simulateMoveWithCapture,
  boardStatesEqual,
} from '../boardcore';
import {addMoveToCurrentNode} from '../helper';
import {Ki} from '../types';
import {TNode} from '../core/tree';

describe('Ko rule functionality', () => {
  test('canMove should allow move when no previous board state', () => {
    const mat = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0], // [2,2] is empty and has liberties
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    // Should be able to move when no previous state
    expect(canMove(mat, 2, 2, Ki.Black, null)).toBe(true);
  });

  test('canMove should prevent ko when board state would repeat', () => {
    // Create a realistic ko situation on the edge
    // This represents a position where white just captured a black stone at [1,2]
    // ○●○
    // ● ●  <- Empty at [1,2] where black stone was captured
    // ●●○
    const afterWhiteCapture = [
      [0, Ki.White, Ki.Black, Ki.White, 0],
      [0, Ki.Black, 0, Ki.Black, 0], // Empty at [1,2], black was captured
      [0, Ki.Black, Ki.Black, Ki.White, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    // This was the position before white's capture (with black stone at [1,2])
    // ○●○
    // ●●●  <- Black stone at [1,2]
    // ●●○
    const beforeWhiteCapture = [
      [0, Ki.White, Ki.Black, Ki.White, 0],
      [0, Ki.Black, Ki.Black, Ki.Black, 0], // Black stone at [1,2]
      [0, Ki.Black, Ki.Black, Ki.White, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    // Black tries to immediately recapture by playing at [1,2]
    // This would recreate the original position, so should be prevented by ko rule
    expect(canMove(afterWhiteCapture, 1, 2, Ki.Black, beforeWhiteCapture)).toBe(
      false
    );
  });

  test('boardStatesEqual should correctly compare board states', () => {
    const board1 = [
      [Ki.Black, Ki.White],
      [Ki.White, Ki.Black],
    ];

    const board2 = [
      [Ki.Black, Ki.White],
      [Ki.White, Ki.Black],
    ];

    const board3 = [
      [Ki.Black, Ki.White],
      [Ki.White, 0],
    ];

    expect(boardStatesEqual(board1, board2)).toBe(true);
    expect(boardStatesEqual(board1, board3)).toBe(false);
  });

  test('simulateMoveWithCapture should return correct board state after move and capture', () => {
    const mat = [
      [0, 0, 0, 0, 0],
      [0, Ki.Black, Ki.White, Ki.Black, 0],
      [0, Ki.White, 0, Ki.White, 0],
      [0, Ki.Black, Ki.White, Ki.Black, 0],
      [0, 0, 0, 0, 0],
    ];

    const result = simulateMoveWithCapture(mat, 2, 2, Ki.Black);

    // Should have black stone at [2,2]
    expect(result[2][2]).toBe(Ki.Black);

    // Should still have the surrounding stones
    expect(result[1][1]).toBe(Ki.Black);
    expect(result[1][2]).toBe(Ki.White);
    expect(result[2][1]).toBe(Ki.White);
    expect(result[2][3]).toBe(Ki.White);
  });

  test('canMove should handle suicide rule correctly', () => {
    const mat = [
      [0, 0, 0, 0, 0],
      [0, Ki.White, Ki.Black, 0, 0],
      [0, Ki.Black, 0, Ki.Black, 0], // [2,2] would be suicide for white
      [0, 0, Ki.Black, 0, 0],
      [0, 0, 0, 0, 0],
    ];

    // White playing at [2,2] would be suicide (no liberties, no captures)
    expect(canMove(mat, 2, 2, Ki.White, null)).toBe(false);

    // Black playing at [2,2] should be fine
    expect(canMove(mat, 2, 2, Ki.Black, null)).toBe(true);
  });

  test('addMoveToCurrentNode should respect ko rule when previousBoardState is provided', () => {
    // Create a simple root node for testing
    const rootNode = new TNode({}, {
      id: 'test',
      name: 'test',
      index: 0,
      number: 0,
      moveProps: [],
      setupProps: [],
      nodeAnnotationProps: [],
      moveAnnotationProps: [],
      markupProps: [],
      rootProps: [],
      gameInfoProps: [],
      customProps: []
    });

    // Create a ko situation where white just captured black at [1,2]
    const currentMat = [
      [0, Ki.White, Ki.Black, Ki.White, 0],
      [0, Ki.Black, 0, Ki.Black, 0],        // Empty at [1,2], black was captured
      [0, Ki.Black, Ki.Black, Ki.White, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];

    // The position before white's capture (with black stone at [1,2])
    const previousBoardState = [
      [0, Ki.White, Ki.Black, Ki.White, 0],
      [0, Ki.Black, Ki.Black, Ki.Black, 0],  // Black stone at [1,2]
      [0, Ki.Black, Ki.Black, Ki.White, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];

    // Black tries to immediately recapture at [1,2] - should be prevented by ko rule
    const nodeWithKo = addMoveToCurrentNode(rootNode, currentMat, 1, 2, Ki.Black, previousBoardState);
    expect(nodeWithKo).toBeUndefined(); // Should not create a node due to ko rule

    // Black should be able to play elsewhere
    const nodeElsewhere = addMoveToCurrentNode(rootNode, currentMat, 0, 0, Ki.Black, previousBoardState);
    expect(nodeElsewhere).toBeDefined(); // Should create a node for valid move

    // Without previous board state, the move should be allowed (backward compatibility)
    const nodeWithoutHistory = addMoveToCurrentNode(rootNode, currentMat, 1, 2, Ki.Black);
    expect(nodeWithoutHistory).toBeDefined(); // Should create a node when no ko check
  });
});
