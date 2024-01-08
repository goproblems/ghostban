import {describe, expect, test} from '@jest/globals';
import {calcVisibleArea} from '../helper';

test('calcVisibleArea should be correct in top left position', () => {
  const mat = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, -1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let extent = 1;
  const visibleAreaRectangle = calcVisibleArea(mat, extent, true);
  expect(visibleAreaRectangle).toEqual([
    [1, 5],
    [1, 4],
  ]);

  const visibleAreaSquare = calcVisibleArea(mat, extent, false);
  expect(visibleAreaSquare).toEqual([
    [1, 5],
    [1, 5],
  ]);
});

test('calcVisibleArea should be correct in top left position', () => {
  const mat = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let extent = 1;
  const visibleAreaSquare = calcVisibleArea(mat, extent, false);
  expect(visibleAreaSquare).toEqual([
    [0, 3],
    [1, 4],
  ]);
});

test('calcVisibleArea should be correct in top right position', () => {
  const mat = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const extent = 1;
  const visibleAreaRectangle = calcVisibleArea(mat, extent, true);
  expect(visibleAreaRectangle).toEqual([
    [1, 6],
    [4, 7],
  ]);

  const visibleAreaSquare = calcVisibleArea(mat, extent, false);
  expect(visibleAreaSquare).toEqual([
    [1, 6],
    [3, 8],
  ]);
});

test('calcVisibleArea should be correct in bottom left position', () => {
  const mat = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const extent = 1;
  const visibleAreaRectangle = calcVisibleArea(mat, extent, false);
  expect(visibleAreaRectangle).toEqual([
    [3, 8],
    [0, 5],
  ]);
});

test('calcVisibleArea should be correct in bottom right position', () => {
  const mat = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, -1, 0],
  ];

  const extent = 1;
  const visibleAreaRectangle = calcVisibleArea(mat, extent, false);
  expect(visibleAreaRectangle).toEqual([
    [5, 8],
    [5, 8],
  ]);
});
