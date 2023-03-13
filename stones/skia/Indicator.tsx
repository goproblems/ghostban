import React from 'react';
import {Circle, Color, SkiaMutableValue} from '@shopify/react-native-skia';

import {Ki} from '../../types';

export const Indicator = ({
  kind = Ki.Black,
  x,
  y,
  r,
  op = 1,
}: {
  kind: Ki;
  x: number | SkiaMutableValue<number>;
  y: number | SkiaMutableValue<number>;
  r: number;
  op?: number;
}) => {
  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={r}
        color={0xaaaaaaaa}
        style={'stroke'}
        strokeWidth={1}
      />
      <Circle
        cx={x}
        cy={y}
        r={r}
        color={kind === Ki.Black ? 0xaaaaaaaa : 0xffffffff}
        style={'fill'}
      />
    </>
  );
};
