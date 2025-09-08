import {describe, expect, test} from '@jest/globals';
import {Sgf} from '../core/sgf';

describe('SGF Complex Parsing - C tag NodeAnnotation', () => {
  test('should correctly parse C tags in complex SGF with nested branches', () => {
    const complexSgf = `(;AP[goproblems]AB[dq]AB[cp]AB[eq]AB[jg]AW[dp]AW[ji]AB[ii]AB[ij]AW[ik]AW[jk]AB[ki]AB[kj]AB[kk]AW[jj]AW[qp]AW[oq]AB[dd]AW[pd]AW[cq]LB[do:A]LB[co:T]C[Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [senseis:Hane] [p#37] @adum](;B[do];W[ep];B[fp];W[eo]AB[en]AW[fo]AB[go]AW[fn]AB[fm]AW[gn]AB[hn]AW[gm]AB[gl]AW[hm]AB[im]AW[hl](;B[hk];W[il](;B[jl];W[jh](;B[ih];W[kh];B[lh];W[kg]AB[kf]AW[lg]AB[mg]AW[lf]AB[le]AW[mf]AB[nf]AW[me]AB[md]AW[ne]AB[oe]AW[nd]AB[nc]AW[od]C[White has escaped.])(;B[kh];W[ih];B[hh];W[ig]AB[if]AW[hg]AB[gg]AW[hf]AB[he]AW[gf]AB[ff]AW[ge]AB[gd]AW[fe]AB[ee]AW[fd](;B[fc]C[White is caught :)RIGHT])(;B[ed];W[fc]C[White has escaped.])))(;B[jh];W[jl](;B[kl];W[jm]C[White will escape now.](;B[jn];W[in];B[km];W[ho])(;B[km];W[in];B[jn];W[ho]))(;B[jm];W[kl](;B[ll];W[km]AB[kn]AW[lm]AB[mm]AW[ln]AB[lo]AW[mn]AB[nn]AW[mo]AB[mp]AW[no]AB[oo]AW[np]AB[nq]AW[op]C[White has escaped.])(;B[km];W[ll]C[White has escaped.]))(;B[km];W[fl]C[White has escaped now.])))(;B[il];W[hk]C[White has escaped.]))(;B[co]C[Wrong - White can be caught in the ladder. Navigate the solution to find out how.]))`;

    const sgf = new Sgf(complexSgf);

    // Verify that the SGF was parsed successfully
    expect(sgf.root).not.toBeNull();

    // Collect all nodes with C (comment) properties
    const nodesWithComments: any[] = [];

    function walkTree(node: any) {
      if (node.model.nodeAnnotationProps.length > 0) {
        const commentProps = node.model.nodeAnnotationProps.filter(
          (prop: any) => prop.token === 'C'
        );
        if (commentProps.length > 0) {
          nodesWithComments.push({
            node: node,
            comments: commentProps.map((prop: any) => prop.value),
          });
        }
      }

      // Walk all children
      node.children.forEach((child: any) => walkTree(child));
    }

    if (sgf.root) {
      walkTree(sgf.root);
    }

    // Verify we found the expected comments
    expect(nodesWithComments.length).toBeGreaterThan(0);

    // Check specific comments (noting that spaces may be removed during parsing)
    const commentTexts = nodesWithComments.flatMap(item => item.comments);

    // Root comment (spaces might be removed, so check for the truncated version)
    const rootComment = commentTexts.find(
      comment =>
        comment.includes('PlayAifyouthinkWhite') ||
        comment.includes('Play A if you think White')
    );
    expect(rootComment).toBeDefined();
    expect(rootComment).toContain('senseis:Hane');
    expect(rootComment).not.toContain('p#37'); // Should be truncated before this
    expect(rootComment).not.toContain('@adum'); // Should be truncated before this

    // Various ending comments
    expect(commentTexts).toContain('White has escaped.');
    expect(commentTexts).toContain('White is caught :)RIGHT');
    expect(commentTexts).toContain('White will escape now.');
    expect(commentTexts).toContain('White has escaped now.');
    expect(commentTexts).toContain(
      'Wrong - White can be caught in the ladder. Navigate the solution to find out how.'
    );

    console.log('Found comments:');
    commentTexts.forEach((comment, index) => {
      console.log(`${index + 1}. "${comment}"`);
    });
  });

  test('should handle complex nested SGF structure with proper node count', () => {
    const complexSgf = `(;AP[goproblems]AB[dq]AB[cp]AB[eq]AB[jg]AW[dp]AW[ji]AB[ii]AB[ij]AW[ik]AW[jk]AB[ki]AB[kj]AB[kk]AW[jj]AW[qp]AW[oq]AB[dd]AW[pd]AW[cq]LB[do:A]LB[co:T]C[Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [senseis:Hane] [p#37] @adum](;B[do];W[ep];B[fp];W[eo]AB[en]AW[fo]AB[go]AW[fn]AB[fm]AW[gn]AB[hn]AW[gm]AB[gl]AW[hm]AB[im]AW[hl](;B[hk];W[il](;B[jl];W[jh](;B[ih];W[kh];B[lh];W[kg]AB[kf]AW[lg]AB[mg]AW[lf]AB[le]AW[mf]AB[nf]AW[me]AB[md]AW[ne]AB[oe]AW[nd]AB[nc]AW[od]C[White has escaped.])(;B[kh];W[ih];B[hh];W[ig]AB[if]AW[hg]AB[gg]AW[hf]AB[he]AW[gf]AB[ff]AW[ge]AB[gd]AW[fe]AB[ee]AW[fd](;B[fc]C[White is caught :)RIGHT])(;B[ed];W[fc]C[White has escaped.])))(;B[jh];W[jl](;B[kl];W[jm]C[White will escape now.](;B[jn];W[in];B[km];W[ho])(;B[km];W[in];B[jn];W[ho]))(;B[jm];W[kl](;B[ll];W[km]AB[kn]AW[lm]AB[mm]AW[ln]AB[lo]AW[mn]AB[nn]AW[mo]AB[mp]AW[no]AB[oo]AW[np]AB[nq]AW[op]C[White has escaped.])(;B[km];W[ll]C[White has escaped.]))(;B[km];W[fl]C[White has escaped now.])))(;B[il];W[hk]C[White has escaped.]))(;B[co]C[Wrong - White can be caught in the ladder. Navigate the solution to find out how.]))`;

    const sgf = new Sgf(complexSgf);

    // Count total nodes
    let totalNodes = 0;
    let nodesWithMoves = 0;
    let nodesWithComments = 0;

    function countNodes(node: any) {
      totalNodes++;
      if (node.model.moveProps.length > 0) {
        nodesWithMoves++;
      }
      if (
        node.model.nodeAnnotationProps.some((prop: any) => prop.token === 'C')
      ) {
        nodesWithComments++;
      }

      node.children.forEach((child: any) => countNodes(child));
    }

    if (sgf.root) {
      countNodes(sgf.root);
    }

    console.log(`Total nodes: ${totalNodes}`);
    console.log(`Nodes with moves: ${nodesWithMoves}`);
    console.log(`Nodes with comments: ${nodesWithComments}`);

    // Basic sanity checks
    expect(totalNodes).toBeGreaterThan(10);
    expect(nodesWithMoves).toBeGreaterThan(5);
    expect(nodesWithComments).toBeGreaterThan(3);
  });

  test('should correctly identify truncated comment due to nested brackets', () => {
    const complexSgf = `(;AP[goproblems]AB[dq]AB[cp]AB[eq]AB[jg]AW[dp]AW[ji]AB[ii]AB[ij]AW[ik]AW[jk]AB[ki]AB[kj]AB[kk]AW[jj]AW[qp]AW[oq]AB[dd]AW[pd]AW[cq]LB[do:A]LB[co:T]C[Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [senseis:Hane] [p#37] @adum](;B[do];W[ep];B[fp];W[eo]AB[en]AW[fo]AB[go]AW[fn]AB[fm]AW[gn]AB[hn]AW[gm]AB[gl]AW[hm]AB[im]AW[hl](;B[hk];W[il](;B[jl];W[jh](;B[ih];W[kh];B[lh];W[kg]AB[kf]AW[lg]AB[mg]AW[lf]AB[le]AW[mf]AB[nf]AW[me]AB[md]AW[ne]AB[oe]AW[nd]AB[nc]AW[od]C[White has escaped.])(;B[kh];W[ih];B[hh];W[ig]AB[if]AW[hg]AB[gg]AW[hf]AB[he]AW[gf]AB[ff]AW[ge]AB[gd]AW[fe]AB[ee]AW[fd](;B[fc]C[White is caught :)RIGHT])(;B[ed];W[fc]C[White has escaped.])))(;B[jh];W[jl](;B[kl];W[jm]C[White will escape now.](;B[jn];W[in];B[km];W[ho])(;B[km];W[in];B[jn];W[ho]))(;B[jm];W[kl](;B[ll];W[km]AB[kn]AW[lm]AB[mm]AW[ln]AB[lo]AW[mn]AB[nn]AW[mo]AB[mp]AW[no]AB[oo]AW[np]AB[nq]AW[op]C[White has escaped.])(;B[km];W[ll]C[White has escaped.]))(;B[km];W[fl]C[White has escaped now.])))(;B[il];W[hk]C[White has escaped.]))(;B[co]C[Wrong - White can be caught in the ladder. Navigate the solution to find out how.]))`;

    const sgf = new Sgf(complexSgf);

    // Get the root node comment
    const rootNode = sgf.root;
    expect(rootNode).not.toBeNull();

    if (rootNode) {
      const commentProps = rootNode.model.nodeAnnotationProps.filter(
        (prop: any) => prop.token === 'C'
      );
      expect(commentProps.length).toBe(1);

      const commentValue = commentProps[0].value;
      console.log(`Root comment: "${commentValue}"`);

      // Due to the nested [senseis:Hane] [p#37] structure, the comment should be truncated
      // It should stop at the first unescaped ']' which comes from [senseis:Hane
      // Note: spaces might be removed during parsing
      const expectedTruncatedContent = commentValue.includes(' ')
        ? 'Play A if you think White can be caught or at T if you think White will escape. # Title aaa - list 1 - list 2 [senseis:Hane'
        : 'PlayAifyouthinkWhitecanbecaughtoratTifyouthinkWhitewillescape.#Titleaaa-list1-list2[senseis:Hane';

      expect(commentValue).toContain('senseis:Hane');
      expect(commentValue).not.toContain('[p#37]'); // This part should be cut off
      expect(commentValue).not.toContain('@adum'); // This part should be cut off

      // The exact truncation point depends on the parsing
      console.log(`Comment length: ${commentValue.length}`);
    }
  });
});
