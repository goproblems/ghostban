import React from 'react';
import {Line, Color, SkiaMutableValue} from '@shopify/react-native-skia';
import {Ki} from '~/ghostban/types';

export const SquareMarkup = ({
  kind,
  x,
  y,
  r,
  color,
}: {
  kind: Ki;
  x: number;
  y: number;
  r: number;
  color?: Color;
}) => {
  const size = r * 0.5;
  const c = color ?? kind === Ki.Black ? 0xffffffff : 'black';

  return (
    <>
      {/* <Line
        p1={{x: x - size, y: y - size}}
        p2={{x: x + size, y: y + size}}
        color={c}
      />
      <Line
        p1={{x: x + size, y: y - size}}
        p2={{x: x - size, y: y + size}}
        color={c}
      /> */}
    </>
  );
};
