import {describe, expect, test} from '@jest/globals';
import {Sgf} from '../core/sgf';

describe('SGF with Escaped Characters', () => {
  test('should parse SGF with escaped brackets and verify root comment preserves spaces', () => {
    const complexSgfWithEscapes = `(;AP[goproblems]AB[dq]AB[cp]AB[eq]AB[jg]AW[dp]AW[ji]AB[ii]AB[ij]AW[ik]AW[jk]AB[ki]AB[kj]AB[kk]AW[jj]AW[qp]AW[oq]AB[dd]AW[pd]AW[cq]LB[do:A]LB[co:T]C[Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [diagram:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] [senseis:Hane\\] [p#37\\] @adum](;B[do];W[ep];B[fp];W[eo]AB[en]AW[fo]AB[go]AW[fn]AB[fm]AW[gn]AB[hn]AW[gm]AB[gl]AW[hm]AB[im]AW[hl](;B[hk];W[il](;B[jl];W[jh](;B[ih];W[kh];B[lh];W[kg]AB[kf]AW[lg]AB[mg]AW[lf]AB[le]AW[mf]AB[nf]AW[me]AB[md]AW[ne]AB[oe]AW[nd]AB[nc]AW[od]C[White has escaped.])(;B[kh];W[ih];B[hh];W[ig]AB[if]AW[hg]AB[gg]AW[hf]AB[he]AW[gf]AB[ff]AW[ge]AB[gd]AW[fe]AB[ee]AW[fd](;B[fc]C[White is caught :)RIGHT])(;B[ed];W[fc]C[White has escaped.])))(;B[jh];W[jl](;B[kl];W[jm]C[White will escape now.](;B[jn];W[in];B[km];W[ho])(;B[km];W[in];B[jn];W[ho]))(;B[jm];W[kl](;B[ll];W[km]AB[kn]AW[lm]AB[mm]AW[ln]AB[lo]AW[mn]AB[nn]AW[mo]AB[mp]AW[no]AB[oo]AW[np]AB[nq]AW[op]C[White has escaped.])(;B[km];W[ll]C[White has escaped.]))(;B[km];W[fl]C[White has escaped now.])))(;B[il];W[hk]C[White has escaped.]))(;B[co]C[Wrong - White can be caught in the ladder. Navigate the solution to find out how.]))`;

    const sgf = new Sgf(complexSgfWithEscapes);

    expect(sgf.root).not.toBeNull();

    if (sgf.root) {
      const rootComments = sgf.root.model.nodeAnnotationProps.filter(
        (prop: any) => prop.token === 'C'
      );
      expect(rootComments.length).toBe(1);

      const rootComment = rootComments[0].value;

      console.log('Root comment:', JSON.stringify(rootComment));
      console.log('Comment length:', rootComment.length);
      console.log('Contains spaces:', rootComment.includes(' '));

      // The comment SHOULD contain spaces because our space preservation is working
      const hasSpaces = rootComment.includes(' ');

      // Verify spaces are preserved (this shows our improvement is working)
      expect(hasSpaces).toBe(true);
      console.log('✅ Root comment correctly preserves spaces');

      // Verify the content is correctly preserved with spaces
      expect(rootComment).toContain('Play A if you think White');
      expect(rootComment).toContain('can be caught');
      expect(rootComment).toContain('or at T if you think White');
      expect(rootComment).toContain('Title aaa - list 1 - list 2');
      expect(rootComment).toContain('labels=[ac:@\\'); // Should contain escaped content

      // After fixing escaped bracket parsing, the comment should be complete
      expect(rootComment).toContain(
        'labels=[ac:@\\]\\] [senseis:Hane\\] [p#37\\] @adum'
      );
      expect(rootComment).not.toMatch(/labels=\[ac:@\\$/); // Should NOT end with @\ (not truncated)
    }
  });

  test('debug buildPropertyValueRanges with escaped brackets', () => {
    const {buildPropertyValueRanges} = require('../core/helpers');

    const testCases = [
      'C[This is a normal comment]',
      'C[This has an escaped bracket \\] inside]',
      'C[Multiple \\] escaped \\] brackets]',
      'C[First]C[Second with \\] escape]',
      'C[Start]AB[aa]C[End with \\] escape]',
    ];

    testCases.forEach((sgf: string, i: number) => {
      console.log(`\nTest case ${i + 1}: ${sgf}`);
      const ranges = buildPropertyValueRanges(sgf);
      console.log('Ranges:', ranges);

      // Show what each range extracts
      ranges.forEach((range: any, j: number) => {
        const value = sgf.slice(range[0], range[1]);
        console.log(`  Range ${j}: "${value}" (${range[0]}-${range[1]})`);
      });
    });
  });

  test('debug SGF parser regex', () => {
    const testString = 'C[This has an escaped bracket \\] inside]';
    console.log('Testing SGF parser regex on:', testString);

    // This is the regex used in SGF parser
    const sgfRegex = /\w+(\[[^\]]*?\](?:\r?\n?\s[^\]]*?)*){1,}/g;
    const matches = [...testString.matchAll(sgfRegex)];

    console.log(
      'SGF parser matches:',
      matches.map(m => m[0])
    );

    // This is the regex used in NodeAnnotationProp.from()
    if (matches.length > 0) {
      const propString = matches[0][0];
      console.log('Testing NodeAnnotationProp regex on:', propString);

      const propRegex = /([A-Z]*)\[([\s\S]*?)\]/;
      const propMatch = propString.match(propRegex);

      if (propMatch) {
        console.log('Token:', propMatch[1]);
        console.log('Value:', JSON.stringify(propMatch[2]));
      }
    }
  });

  test('debug insideProp logic', () => {
    const {buildPropertyValueRanges, isInAnyRange} = require('../core/helpers');

    const testSgf = 'C[Comment with \\] escape];B[aa]';
    console.log('Testing SGF:', testSgf);

    // Check what ranges buildPropertyValueRanges returns
    const ranges = buildPropertyValueRanges(testSgf);
    console.log('Property value ranges:', ranges);

    // Check each character position
    for (let i = 0; i < testSgf.length; i++) {
      const char = testSgf[i];
      const insideProp = isInAnyRange(i, ranges);
      console.log(`Position ${i}: '${char}' -> insideProp: ${insideProp}`);
    }
  });

  test('debug SGF parsing flow', () => {
    const testSgf = ';C[Comment with \\] escape];B[aa]';
    console.log('Full SGF:', testSgf);

    // Simulate what happens in SGF parser
    const {buildPropertyValueRanges, isInAnyRange} = require('../core/helpers');
    const inNodeRanges = buildPropertyValueRanges(testSgf).sort(
      (a: any, b: any) => a[0] - b[0]
    );
    console.log('Property value ranges:', inNodeRanges);

    let nodeStart = 0;
    for (let i = 0; i < testSgf.length; i++) {
      const c = testSgf[i];
      const insideProp = isInAnyRange(i, inNodeRanges);

      if (c === ';' && !insideProp) {
        if (nodeStart > 0) {
          const content = testSgf.slice(nodeStart, i);
          console.log(`Found node content: "${content}"`);

          // Test the regex that extracts properties (updated regex)
          const regex = /\w+(?:\[(?:[^\]\\]|\\.)*\])+/g;
          const matches = [...content.matchAll(regex)];
          console.log(
            'Regex matches:',
            matches.map(m => m[0])
          );
        }
        nodeStart = i + 1;
      }
    }

    // Handle the last node
    if (nodeStart < testSgf.length) {
      const content = testSgf.slice(nodeStart);
      console.log(`Final node content: "${content}"`);

      const regex = /\w+(?:\[(?:[^\]\\]|\\.)*\])+/g;
      const matches = [...content.matchAll(regex)];
      console.log(
        'Final regex matches:',
        matches.map(m => m[0])
      );
    }
  });

  test('test multiline handling', () => {
    console.log('Testing multiline SGF content...');

    // Test multiline content
    const multilineContent = `C[First line
Second line
Third line with \\] escape]`;

    console.log('Multiline content:', JSON.stringify(multilineContent));

    // Test our simplified regex
    const regex = /\w+(?:\[(?:[^\]\\]|\\.)*\])+/g;
    const matches = [...multilineContent.matchAll(regex)];

    console.log(
      'Matches:',
      matches.map(m => m[0])
    );

    if (matches.length > 0) {
      console.log('Full match:', JSON.stringify(matches[0][0]));

      // Test if NodeAnnotationProp.from can handle it
      const {NodeAnnotationProp} = require('../core/props');
      const prop = NodeAnnotationProp.from(matches[0][0]);
      console.log('Parsed value:', JSON.stringify(prop.value));
    }
  });

  test('debug buildPropertyValueRanges with complex escapes', () => {
    const simpleSgf =
      '(;C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end])';

    console.log('Testing SGF:', simpleSgf);

    const {buildPropertyValueRanges} = require('../core/helpers');

    // Test with default keys (C, TM, GN, PC)
    const ranges = buildPropertyValueRanges(simpleSgf);
    console.log('Property value ranges:', ranges);

    // Show what each range contains
    ranges.forEach((range: any, index: any) => {
      const [start, end] = range;
      const content = simpleSgf.slice(start, end);
      console.log(`Range ${index}: [${start}, ${end}] = "${content}"`);
    });

    // Test the specific property content extraction
    console.log('\nTesting property content directly:');
    const propertyContent =
      'C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end]';

    const regex = RegExp(/\w+(?:\[(?:[^\]\\]|\\.)*\])+/g);
    const matches = [...propertyContent.matchAll(regex)];

    console.log('Matches:', matches.length);
    matches.forEach((match, index) => {
      console.log(`Match ${index}:`, match[0]);
    });
  });

  test('debug toSgf serialization', () => {
    // Create a simple SGF with just the problematic comment
    const simpleSgf =
      '(;C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end])';

    console.log('Original SGF:', simpleSgf);
    console.log('Original length:', simpleSgf.length);

    const parsed = new Sgf(simpleSgf);

    if (parsed.root) {
      console.log('Root node exists');

      const comments = parsed.root.model.nodeAnnotationProps.filter(
        (prop: any) => prop.token === 'C'
      );
      console.log('Number of C properties:', comments.length);

      if (comments.length > 0) {
        console.log('Comment value:', JSON.stringify(comments[0].value));
        console.log('Comment toString():', comments[0].toString());
      }
    }

    const regenerated = parsed.toSgf();
    console.log('Regenerated SGF:', regenerated);
    console.log('Regenerated length:', regenerated.length);

    // Check if they match
    console.log('Match:', simpleSgf === regenerated);
  });

  test('debug NodeAnnotationProp.from with complex nested content', () => {
    // Test the exact string that's causing problems
    const complexPropString =
      'C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end]';

    console.log('Testing prop string:', complexPropString);

    // Import the NodeAnnotationProp class
    const {NodeAnnotationProp} = require('../core/props');

    // Test the from() method directly
    const prop = NodeAnnotationProp.from(complexPropString);

    console.log('Parsed token:', prop.token);
    console.log('Parsed value:', JSON.stringify(prop.value));
    console.log('Value length:', prop.value.length);

    // Test what the regex matches
    const TOKEN_REGEX_WITH_ESCAPES = new RegExp(
      /([A-Z]*)\[((?:[^\]\\]|\\.)*)\]/
    );
    const match = complexPropString.match(TOKEN_REGEX_WITH_ESCAPES);

    if (match) {
      console.log('Direct regex match:');
      console.log('  Full match:', match[0]);
      console.log('  Token:', match[1]);
      console.log('  Value:', match[2]);
      console.log('  Value length:', match[2].length);
    }

    expect(prop.token).toBe('C');
    // The value should be the complete nested content without duplication
    expect(prop.value).toBe(
      'Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end'
    );
  });

  test('debug regex matching for nested escapes', () => {
    const content =
      'C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end]';
    const regex = RegExp(/\w+(?:\[(?:[^\]\\]|\\.)*\])+/g);

    console.log('Testing content:', content);
    console.log('Using regex:', regex);

    const matches = [...content.matchAll(regex)];
    console.log('Number of matches:', matches.length);

    matches.forEach((match, index) => {
      console.log(`Match ${index}:`, match[0]);
      console.log(`  Index: ${match.index}`);
      console.log(`  Length: ${match[0].length}`);
    });

    // Also test what TOKEN_REGEX_WITH_ESCAPES would match
    matches.forEach((match, index) => {
      const TOKEN_REGEX_WITH_ESCAPES = new RegExp(
        /([A-Z]*)\[((?:[^\]\\]|\\.)*)\]/
      );
      const tokenMatch = match[0].match(TOKEN_REGEX_WITH_ESCAPES);
      if (tokenMatch) {
        console.log(`Token match ${index}:`, {
          token: tokenMatch[1],
          value: tokenMatch[2],
        });
      }
    });
  });

  test('test complex nested SGF escapes', () => {
    // Simplified test for the problematic part
    const testSgf = `(;C[Play A. [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] end])`;

    console.log('Test SGF:', testSgf);

    const sgf = new Sgf(testSgf);
    const regenerated = sgf.toSgf();

    console.log('Original length:', testSgf.length);
    console.log('Regenerated length:', regenerated.length);

    if (sgf.root) {
      const commentProps = sgf.root.model.nodeAnnotationProps.filter(
        (prop: any) => prop.token === 'C'
      );
      if (commentProps.length > 0) {
        console.log('Parsed comment:', JSON.stringify(commentProps[0].value));
      }
    }

    console.log('Original:', testSgf);
    console.log('Regenerated:', regenerated);

    expect(sgf.root).not.toBeNull();
  });

  test('NodeAnnotationProp toString should escape unescaped brackets', () => {
    const {NodeAnnotationProp} = require('../core/props');

    // Test case 1: Value with unescaped bracket should be escaped
    const prop1 = new NodeAnnotationProp('C', 'Comment with ] bracket');
    console.log('Unescaped input value:', prop1.value);
    console.log('toString() output:', prop1.toString());

    // The output should escape the ] bracket
    expect(prop1.toString()).toBe('C[Comment with \\] bracket]');

    // Test case 2: Value with already escaped bracket should remain unchanged
    const prop2 = new NodeAnnotationProp(
      'C',
      'Comment with \\] already escaped'
    );
    console.log('Already escaped input value:', prop2.value);
    console.log('toString() output:', prop2.toString());

    // The output should keep the escape as is
    expect(prop2.toString()).toBe('C[Comment with \\] already escaped]');

    // Test case 3: Mixed case - some escaped, some not
    const prop3 = new NodeAnnotationProp(
      'C',
      'Mix: ] unescaped and \\] escaped'
    );
    console.log('Mixed input value:', prop3.value);
    console.log('toString() output:', prop3.toString());

    // Should escape only the unescaped bracket
    expect(prop3.toString()).toBe('C[Mix: \\] unescaped and \\] escaped]');

    // Test case 4: Multiple unescaped brackets
    const prop4 = new NodeAnnotationProp('C', 'Multiple ] ] brackets');
    console.log('Multiple unescaped input value:', prop4.value);
    console.log('toString() output:', prop4.toString());

    // Should escape all unescaped brackets
    expect(prop4.toString()).toBe('C[Multiple \\] \\] brackets]');
  });

  test('round-trip with programmatically created unescaped bracket values', () => {
    // Test round-trip: create SGF with unescaped brackets → toSgf() → parse → verify

    // Create an SGF manually with unescaped brackets in the value
    const {NodeAnnotationProp} = require('../core/props');
    const {TreeModel} = require('../core/tree');

    // Create a node with unescaped bracket in comment
    const tree = new TreeModel();
    const rootNode = tree.parse({
      id: 'test',
      name: 'test',
      index: 0,
      number: 0,
      moveProps: [],
      setupProps: [],
      rootProps: [],
      markupProps: [],
      gameInfoProps: [],
      nodeAnnotationProps: [
        new NodeAnnotationProp('C', 'Test comment with ] unescaped bracket'),
      ],
      moveAnnotationProps: [],
      customProps: [],
    });

    // Create SGF instance and test toSgf()
    const sgf = new (require('../core/sgf').Sgf)();
    sgf.setRoot(rootNode);

    const sgfString = sgf.toSgf();
    console.log('Generated SGF:', sgfString);

    // The SGF should have escaped the bracket
    expect(sgfString).toBe('(;C[Test comment with \\] unescaped bracket])');

    // Now parse it back and verify the value is correct
    const parsedSgf = new (require('../core/sgf').Sgf)(sgfString);

    expect(parsedSgf.root).not.toBeNull();
    if (parsedSgf.root) {
      const comments = parsedSgf.root.model.nodeAnnotationProps.filter(
        (prop: any) => prop.token === 'C'
      );
      expect(comments.length).toBe(1);

      // The parsed value should preserve the escaped state
      // (the .value contains the SGF-escaped content)
      const parsedComment = comments[0].value;
      console.log('Parsed comment value:', parsedComment);
      expect(parsedComment).toBe('Test comment with \\] unescaped bracket');
    }
  });

  test('round-trip test with unescaped bracket values', () => {
    const complexSgfWithEscapes = `(;AP[goproblems]AB[dq]AB[cp]AB[eq]AB[jg]AW[dp]AW[ji]AB[ii]AB[ij]AW[ik]AW[jk]AB[ki]AB[kj]AB[kk]AW[jj]AW[qp]AW[oq]AB[dd]AW[pd]AW[cq]LB[do:A]LB[co:T]C[Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [diagram\\:sgf=(;SZ[13\\]AW[aa\\]AB[cb\\]C[foo\\]) labels=[ac:@\\]\\] [senseis:Hane\\] [p#37\\] @adum](;B[do];W[ep];B[fp];W[eo]AB[en]AW[fo]AB[go]AW[fn]AB[fm]AW[gn]AB[hn]AW[gm]AB[gl]AW[hm]AB[im]AW[hl](;B[hk];W[il](;B[jl];W[jh](;B[ih];W[kh];B[lh];W[kg]AB[kf]AW[lg]AB[mg]AW[lf]AB[le]AW[mf]AB[nf]AW[me]AB[md]AW[ne]AB[oe]AW[nd]AB[nc]AW[od]C[White has escaped.])(;B[kh];W[ih];B[hh];W[ig]AB[if]AW[hg]AB[gg]AW[hf]AB[he]AW[gf]AB[ff]AW[ge]AB[gd]AW[fe]AB[ee]AW[fd](;B[fc]C[White is caught :)RIGHT])(;B[ed];W[fc]C[White has escaped.])))(;B[jh];W[jl](;B[kl];W[jm]C[White will escape now.](;B[jn];W[in];B[km];W[ho])(;B[km];W[in];B[jn];W[ho]))(;B[jm];W[kl](;B[ll];W[km]AB[kn]AW[lm]AB[mm]AW[ln]AB[lo]AW[mn]AB[nn]AW[mo]AB[mp]AW[no]AB[oo]AW[np]AB[nq]AW[op]C[White has escaped.])(;B[km];W[ll]C[White has escaped.]))(;B[km];W[fl]C[White has escaped now.])))(;B[il];W[hk]C[White has escaped.]))(;B[co]C[Wrong - White can be caught in the ladder. Navigate the solution to find out how.]))`;

    console.log('Original SGF length:', complexSgfWithEscapes.length);

    // Parse the SGF
    const sgf = new Sgf(complexSgfWithEscapes);

    // Convert back to SGF
    const regeneratedSgf = sgf.toSgf();

    console.log('Regenerated SGF length:', regeneratedSgf.length);

    // Log the differences if any
    if (complexSgfWithEscapes === regeneratedSgf) {
      console.log(
        '✅ Round-trip successful: Original and regenerated SGF are identical'
      );
    } else {
      console.log('❌ Round-trip failed: Original and regenerated SGF differ');

      // Find the first difference
      let diffIndex = -1;
      for (
        let i = 0;
        i < Math.min(complexSgfWithEscapes.length, regeneratedSgf.length);
        i++
      ) {
        if (complexSgfWithEscapes[i] !== regeneratedSgf[i]) {
          diffIndex = i;
          break;
        }
      }

      if (diffIndex >= 0) {
        const start = Math.max(0, diffIndex - 50);
        const end = Math.min(complexSgfWithEscapes.length, diffIndex + 50);

        console.log(`First difference at position ${diffIndex}:`);
        console.log(
          'Original around diff:',
          JSON.stringify(complexSgfWithEscapes.slice(start, end))
        );
        console.log(
          'Regenerated around diff:',
          JSON.stringify(regeneratedSgf.slice(start, end))
        );
      } else if (complexSgfWithEscapes.length !== regeneratedSgf.length) {
        console.log(
          `Length difference: Original=${complexSgfWithEscapes.length}, Regenerated=${regeneratedSgf.length}`
        );
      }

      // Also check if the root comment is parsed correctly
      if (sgf.root) {
        const rootComments = sgf.root.model.nodeAnnotationProps.filter(
          (prop: any) => prop.token === 'C'
        );
        if (rootComments.length > 0) {
          console.log(
            'Parsed root comment:',
            JSON.stringify(rootComments[0].value)
          );
        }
      }
    }

    // The test assertion - now we can be strict about round-trip consistency
    expect(sgf.root).not.toBeNull();
    expect(regeneratedSgf).toBe(complexSgfWithEscapes);
  });
});
