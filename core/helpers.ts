export function isCharacterInNode(
  sgf: string,
  n: number,
  nodes = ['C', 'TM', 'GN']
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

export function buildNodeRanges(
  sgf: string,
  keys: string[] = ['C', 'TM', 'GN']
): Range[] {
  const ranges: Range[] = [];
  const pattern = new RegExp(`\\b(${keys.join('|')})\\[([^\\]]*)\\]`, 'g');

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(sgf)) !== null) {
    const start = match.index + match[1].length + 1;
    const end = start + match[2].length;
    ranges.push([start, end]);
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
