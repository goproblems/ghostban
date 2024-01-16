import {describe, expect, test} from '@jest/globals';
import {Sgf} from '../core/sgf';

test('Parse SGF with newline in the middle of the sequene', () => {
  const sgf = `
(;CA[utf-8]AB[cr][cs][gq][gr][gs][dp][fp]AW[ep][bq][br][cp][co][cn][eo][en][gn]
[go][gp][hq][hr]AP[MultiGo:4.4.4]SZ[19]AB[cq]MULTIGOGM[0]

(;B[es];W[fr]
(;B[fq];W[er];B[eq];W[dr];B[dq]C[CHOICERIGHTSeki])
(;B[eq];W[fq])
(;B[er];W[fq]))
(;B[eq];W[fq]
(;B[fr];W[es])
(;B[er])
(;B[es];W[fr])
(;B[dq]))
(;B[fq];W[er];B[eq];W[dq];B[dr];W[es])
(;B[dq];W[er];B[eq];W[fq];B[fr];W[es])
(;B[er];W[fq]))
  `;

  const sgfParser = new Sgf(sgf);
  expect(sgfParser.toSgf()).toEqual(
    '(;CA[utf-8]AP[MultiGo:4.4.4]SZ[19]AB[cr][cs][gq][gr][gs][dp][fp]AW[ep][bq][br][cp][co][cn][eo][en][gn][go][gp][hq][hr]AB[cq](;B[es];W[fr](;B[fq];W[er];B[eq];W[dr];B[dq]C[CHOICERIGHTSeki])(;B[eq];W[fq])(;B[er];W[fq]))(;B[eq];W[fq](;B[fr];W[es])(;B[er])(;B[es];W[fr])(;B[dq]))(;B[fq];W[er];B[eq];W[dq];B[dr];W[es])(;B[dq];W[er];B[eq];W[fq];B[fr];W[es])(;B[er];W[fq]))'
  );
});
