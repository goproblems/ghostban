import React from 'react';
import {Circle, Color, SkiaMutableValue} from '@shopify/react-native-skia';

import {Ki} from '../../types';

export const FlatStone = ({
  kind = Ki.Black,
  x,
  y,
  r,
  op = 1,
  color,
}: {
  kind: Ki;
  x: number | SkiaMutableValue<number>;
  y: number | SkiaMutableValue<number>;
  r: number;
  color?: Color;
  op?: number;
}) => {
  const c = color ?? kind === Ki.Black ? 'black' : 0xffffffff;

  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={r}
        color={'black'}
        style={'stroke'}
        opacity={op}
        strokeWidth={1}
      />
      <Circle cx={x} cy={y} r={r} color={c} opacity={op} style={'fill'} />
    </>
  );
};
