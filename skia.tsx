import React from 'react';
import {Line, useFont, Circle, Text, Color} from '@shopify/react-native-skia';
import {
  a1ToPos,
  calcScoreDiff,
  calcScoreDiffText,
  calcSpaceAndScaledPadding,
  calcVisibleArea,
  reverseOffset,
} from './helper';
import {Analysis, GhostBanOptions, Ki, Markup, RootInfo, Theme} from './types';
import {A1_LETTERS, A1_NUMBERS} from './const';
import {FlatStone, AnalysisPoint} from './stones';
import {create, meanDependencies, stdDependencies} from 'mathjs';
import {CircleMarkup, CrossMarkup, TextMarkup} from './markups/skia';

const config = {};
const {std, mean} = create({meanDependencies, stdDependencies}, config);
const roboto = require('~/assets/fonts/Roboto.ttf');

export const BoardStars = ({
  mat,
  size,
  boardOptions,
}: {
  mat: number[][];
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const {padding, boardSize, extend, zoom} = boardOptions;
  const {visibleArea: zoomedVisibleArea} = calcVisibleArea(
    mat,
    boardSize,
    extend,
  );
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );
  const va = zoom
    ? zoomedVisibleArea
    : [
        [0, 18],
        [0, 18],
      ];
  const stars: JSX.Element[] = [];
  [3, 9, 15].forEach(i => {
    [3, 9, 15].forEach(j => {
      if (i > va[0][0] && i < va[0][1] && j > va[1][0] && j < va[1][1]) {
        stars.push(
          <Circle
            key={`star-${i}${j}`}
            cx={i * space + scaledPadding}
            cy={j * space + scaledPadding}
            r={2}
            color={'black'}
          />,
        );
      }
    });
  });
  return <>{stars}</>;
};

export const Markups = ({
  mat,
  markup,
  size,
  boardOptions,
}: {
  mat: number[][];
  markup: string[][];
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const markups: JSX.Element[] = [];
  const {padding, boardSize, theme} = boardOptions;
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );

  for (let i = 0; i < markup.length; i++) {
    for (let j = 0; j < markup[i].length; j++) {
      const ki = mat[i][j];
      const value = markup[i][j];
      const x = scaledPadding + i * space;
      const y = scaledPadding + j * space;

      const ratio = 0.45;

      if (value === Markup.Cross) {
        markups.push(
          <CrossMarkup
            key={`crm-${x}-${y}`}
            kind={ki}
            x={x}
            y={y}
            r={space * ratio}
          />,
        );
      } else if (value === Markup.Current) {
        markups.push(
          <CircleMarkup
            key={`cim-${x}-${y}`}
            kind={ki}
            x={x}
            y={y}
            r={space * ratio}
          />,
        );
      } else if (value === Markup.Current) {
        markups.push(
          <TextMarkup
            key={`tm-${x}${y}`}
            kind={ki}
            x={x}
            y={y}
            r={space * ratio}
            text={value}
          />,
        );
      } else if (value !== '') {
        markups.push(
          <TextMarkup
            key={`tm-${x}${y}`}
            kind={ki}
            x={x}
            y={y}
            r={space * ratio}
            text={value}
          />,
        );
      }
    }
  }
  return <>{markups}</>;
};

export const Stones = ({
  mat,
  size,
  boardOptions,
}: {
  mat: number[][];
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const stones: JSX.Element[] = [];
  const {padding, boardSize, theme} = boardOptions;
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      const value = mat[i][j];
      if (value !== 0) {
        const x = scaledPadding + i * space;
        const y = scaledPadding + j * space;

        const ratio = 0.45;
        // if (
        //   options.theme !== Theme.Subdued &&
        //   options.theme !== Theme.BlackAndWhite &&
        //   options.theme !== Theme.Flat
        // ) {
        //   ctx.shadowOffsetX = 3;
        //   ctx.shadowOffsetY = 3;
        //   ctx.shadowColor = '#555';
        //   ctx.shadowBlur = 8;
        // } else {
        //   ctx.shadowOffsetX = 0;
        //   ctx.shadowOffsetY = 0;
        //   ctx.shadowBlur = 0;
        // }
        switch (theme) {
          case Theme.BlackAndWhite:
          case Theme.Flat: {
            stones.push(
              <FlatStone
                key={`st-${i}-${j}`}
                kind={value}
                x={x}
                y={y}
                r={space * ratio}
              />,
            );
            break;
          }
          // default: {
          //   const blacks = RESOURCES[theme].blacks.map(i => images[i]);
          //   const whites = RESOURCES[theme].whites.map(i => images[i]);
          //   const r = space * ratio;
          //   const mod = i + 10 + j;
          //   stone = new ImageStone(
          //     ctx,
          //     x,
          //     y,
          //     r,
          //     value,
          //     mod,
          //     blacks,
          //     whites,
          //   );
          // }
        }
      }
    }
  }
  return <>{stones}</>;
};

export const BoardLines = ({
  mat,
  size,
  boardOptions,
}: {
  mat: number[][];
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const {padding, boardSize, extend, zoom} = boardOptions;
  const {visibleArea: zoomedVisibleArea} = calcVisibleArea(
    mat,
    boardSize,
    extend,
  );
  const va = zoom
    ? zoomedVisibleArea
    : [
        [0, 18],
        [0, 18],
      ];
  const lines: JSX.Element[] = [];
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );
  const strokeWidth = 0.5;
  for (let i = va[0][0]; i <= va[0][1]; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        strokeWidth={strokeWidth}
        p1={{
          x: i * space + scaledPadding,
          y: scaledPadding + va[1][0] * space,
        }}
        p2={{
          x: i * space + scaledPadding,
          y: space * va[1][1] + scaledPadding,
        }}
      />,
    );
  }

  for (let i = va[1][0]; i <= va[1][1]; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        strokeWidth={strokeWidth}
        p1={{
          x: va[0][0] * space + scaledPadding,
          y: i * space + scaledPadding,
        }}
        p2={{
          x: va[0][1] * space + scaledPadding,
          y: i * space + scaledPadding,
        }}
      />,
    );
  }
  return <>{lines}</>;
};

export const BoardCoordinate = ({
  mat,
  size,
  boardOptions,
}: {
  mat: number[][];
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const {padding, boardSize, extend, zoom} = boardOptions;
  const {visibleArea: zoomedVisibleArea} = calcVisibleArea(
    mat,
    boardSize,
    extend,
  );
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );
  const va = zoom
    ? zoomedVisibleArea
    : [
        [0, 18],
        [0, 18],
      ];
  const font = useFont(roboto, space / 2.7);
  const offset = space / 3;
  const texts: JSX.Element[] = [];

  if (font === null) return <></>;

  A1_LETTERS.forEach((l, index) => {
    if (index >= va[0][0] && index <= va[0][1]) {
      const textWidth = font.getTextWidth(l);
      const x = space * index + scaledPadding;

      texts.push(
        <Text
          key={`up-${l}`}
          text={l}
          x={x}
          y={0 + offset + textWidth / 2}
          font={font}
          color="black"
        />,
      );

      texts.push(
        <Text
          key={`down-${l}`}
          text={l}
          x={x}
          y={size - offset + textWidth / 2}
          font={font}
          color="black"
        />,
      );
    }
  });
  A1_NUMBERS.forEach((n: number, index) => {
    if (index >= va[1][0] && index <= va[1][1]) {
      const textWidth = font.getTextWidth(n.toString());
      const y = space * index + scaledPadding;
      texts.push(
        <Text
          key={`ch-${n.toString()}`}
          text={n.toString()}
          x={offset - textWidth / 2}
          y={y}
          font={font}
          color="black"
        />,
      );
      texts.push(
        <Text
          key={`cv-${n.toString()}`}
          text={n.toString()}
          x={size - offset - textWidth / 2}
          y={y}
          font={font}
          color="black"
        />,
      );
    }
  });
  return <>{texts}</>;
};

export const AnalysisPoints = ({
  mat,
  analysis,
  size,
  boardOptions,
}: {
  mat: number[][];
  analysis: Analysis;
  size: number;
  boardOptions: GhostBanOptions;
}) => {
  const {padding, boardSize} = boardOptions;

  const points: JSX.Element[] = [];
  const {space, scaledPadding} = calcSpaceAndScaledPadding(
    size,
    padding,
    boardSize,
  );
  const {rootInfo} = analysis;

  analysis.moveInfos.forEach(m => {
    if (m.move === 'pass') return;
    const idObj = JSON.parse(analysis.id);
    const {x: ox, y: oy} = reverseOffset(mat, idObj.bx, idObj.by);
    let {x: i, y: j} = a1ToPos(m.move);
    i += ox;
    j += oy;
    if (mat[i][j] !== 0) return;
    const x = scaledPadding + i * space;
    const y = scaledPadding + j * space;
    const ratio = 0.48;

    const {prior, order} = m;
    const score = calcScoreDiff(rootInfo, m);

    let pColor: Color;
    if (
      prior >= 0.5 ||
      (prior >= 0.1 && order < 3 && score > -0.3) ||
      order === 0 ||
      score >= 0
    ) {
      pColor = 'rgba(136, 170, 60, 1)';
    } else if (
      (prior > 0.05 && score > -0.5) ||
      (prior > 0.01 && score > -0.1)
    ) {
      pColor = 'rgba(206, 210, 83, 1)';
    } else if (prior > 0.01 && score > -1) {
      pColor = 'rgba(242, 217, 60, 1)';
    } else {
      pColor = 'rgba(236, 146, 73, 1)';
    }
    if (m.visits > 50 && score > -1 && (prior > 0.01 || order < 5)) {
      const scoreText = calcScoreDiffText(rootInfo, m);
      // const winrate =
      //   rootInfo.currentPlayer === 'B' ? m.winrate : 1 - m.winrate;
      //       const order = moveInfo.order;
      points.push(
        <AnalysisPoint
          key={`ap-${x}-${y}`}
          x={x}
          y={y}
          r={space * ratio}
          color={pColor}
          text={scoreText}
        />,
      );
    } else {
      points.push(
        <Circle
          key={`ap-${x}-${y}`}
          cx={x}
          cy={y}
          r={space * 0.25}
          color={pColor}
        />,
      );
    }
  });
  return <>{points}</>;
};
