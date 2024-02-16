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

test('Parse SGF with newline between the token and values', () => {
  const sgf = `
(;
AW [ea][eb][bc][ec][dd][fd][de][af][bf][cf][df]
AB [da][bb][db][dc][ae][be][ce]
SZ[19]
C[black to live.]

   (;B[cc]
      (;W[cd] C[CHOICE]
         (;B[ac]
            (;W[bd] C[CHOICE]
               (;B[ca]
                  (;W[ab] C[CHOICE] ;B[aa] ;W[ad] ;B[ab] C[RIGHT correct.])
                  (;W[ad] C[CHOICE]
                     (;B[ab] C[RIGHT correct.])
                     (;B[aa] ;W[ab] C[oops. ko. black can do better.])
                  )
               )
               (;B[ab]
                  (;W[ba] C[CHOICE] C[black dies.])
                  (;W[ca] C[CHOICE] C[black dies.])
               )
            )
            (;W[ca] C[CHOICE]
               (;B[bd] C[RIGHT correct.])
               (;B[cb] ;W[bd]
                  (;B[ba] ;W[ab] C[black dies.])
                  (;B[ab] ;W[ba] C[black dies.])
               )
            )
         )
         (;B[ca] ;W[ab]
            (;B[aa] ;W[ac] C[black dies.])
            (;B[ac] ;W[ad] ;B[aa] ;W[ba] C[ko. black can do better.])
         )
         (;B[ab]
            (;W[ba] C[CHOICE] ;B[ac] ;W[bd] C[black dies.])
            (;W[ca] C[CHOICE] ;B[cb] ;W[ba] ;B[ac] ;W[bd] C[black dies.])
         )
      )
      (;W[ca] C[CHOICE]
         (;B[ac] ;W[cd] ;B[bd] C[RIGHT correct.])
         (;B[cd] ;W[ab]
            (;B[ba] C[RIGHT correct.])
            (;B[cb] ;W[ba] ;B[aa] ;W[ba]
               (;B[ac] ;W[ad] C[seki. black can do better.])
               (;B[ad] ;W[ac] C[seki. black can do better.])
               (;B[ca] ;W[ad] ;B[aa] C[ko. black can do better.])
            )
            (;B[bd] ;W[ac]
               (;B[ba] C[RIGHT correct.])
               (;B[cb] ;W[ba] ;B[aa] ;W[ba] C[seki. black can do better.])
            )
         )
         (;B[bd]
            (;W[cd] C[CHOICE] ;B[ac] C[RIGHT correct.])
            (;W[ac] C[CHOICE]
               (;B[ab] C[RIGHT correct.])
               (;B[cd] C[RIGHT correct.])
               (;B[cb] ;W[ab]
                  (;B[cd] ;W[ba] ;B[aa] ;W[ba] C[seki. black can do better.])
                  (;B[ba] ;W[cd] C[black dies.])
               )
               (;B[ba] ;W[cd] ;B[cb] ;W[ab] C[black dies.])
            )
         )
      )
   )
   (;B[ac] ;W[cc]
      (;B[cb] ;W[cd] C[black dies.])
      (;B[cd]
         (;W[cb] C[CHOICE] C[black dies.])
         (;W[bd] C[CHOICE] C[black dies.])
         (;W[ad] C[CHOICE] C[black dies.])
      )
   )

   (;B[cd] ;W[cc]
      (;B[cb]
         (;W[ad] C[CHOICE] C[black dies.])
         (;W[bd] C[CHOICE] C[black dies.])
      )
      (;B[ac] ;W[cb] C[black dies.])
   )
   (;B[cb] ;W[cd] ;B[ab] ;W[ba] C[black dies.])
)
  `;

  const sgfParser = new Sgf(sgf);
  expect(sgfParser.toSgf()).toEqual(
    '(;SZ[19]AW[ea][eb][bc][ec][dd][fd][de][af][bf][cf][df]AB[da][bb][db][dc][ae][be][ce]C[black to live.](;B[cc](;W[cd]C[CHOICE](;B[ac](;W[bd]C[CHOICE](;B[ca](;W[ab]C[CHOICE];B[aa];W[ad];B[ab]C[RIGHT correct.])(;W[ad]C[CHOICE](;B[ab]C[RIGHT correct.])(;B[aa];W[ab]C[oops. ko. black can do better.])))(;B[ab](;W[ba]C[CHOICE]C[black dies.])(;W[ca]C[CHOICE]C[black dies.])))(;W[ca]C[CHOICE](;B[bd]C[RIGHT correct.])(;B[cb];W[bd](;B[ba];W[ab]C[black dies.])(;B[ab];W[ba]C[black dies.]))))(;B[ca];W[ab](;B[aa];W[ac]C[black dies.])(;B[ac];W[ad];B[aa];W[ba]C[ko. black can do better.]))(;B[ab](;W[ba]C[CHOICE];B[ac];W[bd]C[black dies.])(;W[ca]C[CHOICE];B[cb];W[ba];B[ac];W[bd]C[black dies.])))(;W[ca]C[CHOICE](;B[ac];W[cd];B[bd]C[RIGHT correct.])(;B[cd];W[ab](;B[ba]C[RIGHT correct.])(;B[cb];W[ba];B[aa];W[ba](;B[ac];W[ad]C[seki. black can do better.])(;B[ad];W[ac]C[seki. black can do better.])(;B[ca];W[ad];B[aa]C[ko. black can do better.]))(;B[bd];W[ac](;B[ba]C[RIGHT correct.])(;B[cb];W[ba];B[aa];W[ba]C[seki. black can do better.])))(;B[bd](;W[cd]C[CHOICE];B[ac]C[RIGHT correct.])(;W[ac]C[CHOICE](;B[ab]C[RIGHT correct.])(;B[cd]C[RIGHT correct.])(;B[cb];W[ab](;B[cd];W[ba];B[aa];W[ba]C[seki. black can do better.])(;B[ba];W[cd]C[black dies.]))(;B[ba];W[cd];B[cb];W[ab]C[black dies.])))))(;B[ac];W[cc](;B[cb];W[cd]C[black dies.])(;B[cd](;W[cb]C[CHOICE]C[black dies.])(;W[bd]C[CHOICE]C[black dies.])(;W[ad]C[CHOICE]C[black dies.])))(;B[cd];W[cc](;B[cb](;W[ad]C[CHOICE]C[black dies.])(;W[bd]C[CHOICE]C[black dies.]))(;B[ac];W[cb]C[black dies.]))(;B[cb];W[cd];B[ab];W[ba]C[black dies.]))'
  );
});
