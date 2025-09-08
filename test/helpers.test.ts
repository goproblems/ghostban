import {describe, expect, test} from '@jest/globals';
import {calcVisibleArea} from '../helper';
import {buildPropertyValueRanges} from '../core/helpers';

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

describe('buildPropertyValueRanges', () => {
  test('should handle simple comment without escaping', () => {
    const sgf = ';C[Simple comment]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([[3, 17]]); // "Simple comment"
  });

  test('should handle escaped closing bracket', () => {
    const sgf = ';C[Comment with escaped \\] bracket]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([[3, 34]]); // "Comment with escaped \\] bracket"
  });

  test('should handle multiple escaped brackets', () => {
    const sgf = ';C[First \\] and second \\] brackets]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([[3, 34]]); // "First \\] and second \\] brackets"
  });

  test('should stop at first unescaped closing bracket (nested brackets case)', () => {
    const sgf = ';C[Play A if [diagram:sgf=(;SZ[13])] more content]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    // Should stop at the first ']' after "diagram:sgf=(;SZ[13"
    expect(ranges).toEqual([[3, 33]]); // "Play A if [diagram:sgf=(;SZ[13"
  });

  test('should handle complex example with escaped brackets', () => {
    const sgf =
      ';C[Play A if you think White can be caught\\] or continue reading]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([[3, 64]]); // Full content until the real closing bracket
  });

  test('should handle escaped backslash followed by bracket', () => {
    const sgf = ';C[This has escaped backslash \\\\] end]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    // The first ] after \\\\ should close the comment because \\ escapes itself
    expect(ranges).toEqual([[3, 32]]); // "This has escaped backslash \\\\"
  });

  test('should handle multiple properties', () => {
    const sgf = ';C[Comment with \\] bracket]GN[Game name]';
    const ranges = buildPropertyValueRanges(sgf, ['C', 'GN']);
    expect(ranges).toEqual([
      [3, 26], // "Comment with \\] bracket"
      [30, 39], // "Game name"
    ]);
  });

  test('should handle empty content', () => {
    const sgf = ';C[]GN[Test]';
    const ranges = buildPropertyValueRanges(sgf, ['C', 'GN']);
    expect(ranges).toEqual([
      [3, 3], // Empty content for C
      [7, 11], // "Test"
    ]);
  });

  test('should return empty array for no matches', () => {
    const sgf = ';B[dd]W[pd]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([]);
  });

  test('should handle real-world complex example with markdown and special markers', () => {
    const sgf =
      ';C[Play A if you think White can be caught\\] or at T if you think White will escape. # Title aaa - list 1 - list 2]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    expect(ranges).toEqual([[3, 114]]); // Full content until the real closing bracket

    // Verify the content by extracting it
    const content = sgf.slice(3, 114);
    expect(content).toBe(
      'Play A if you think White can be caught\\] or at T if you think White will escape. # Title aaa - list 1 - list 2'
    );
  });

  test('should demonstrate nested bracket issue (expected behavior)', () => {
    const sgf =
      ';C[Play A if you think White can be caught or at T if you think White will escape. [diagram:sgf=(;SZ[13]AW[aa]AB[cb]C[foo]) labels=[ac:@]] [senseis:Hane] [p#37] @adum]';
    const ranges = buildPropertyValueRanges(sgf, ['C']);
    // Should find two C properties:
    // 1. The main comment that stops at first unescaped ']' which is after '[13'
    // 2. The nested C[foo] property
    expect(ranges).toEqual([
      [3, 103], // Main comment stops at ']' after '[13'
      [118, 121], // Nested 'foo' property
    ]);

    // Verify the first range content
    const content1 = sgf.slice(3, 103);
    expect(content1).toBe(
      'Play A if you think White can be caught or at T if you think White will escape. [diagram:sgf=(;SZ[13'
    );

    // Verify the second range content
    const content2 = sgf.slice(118, 121);
    expect(content2).toBe('foo');
  });
});
