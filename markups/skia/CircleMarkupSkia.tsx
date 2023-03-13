import React from 'react';
import {Circle, Color, SkiaMutableValue} from '@shopify/react-native-skia';
import {Ki} from '~/ghostban/types';

export const CircleMarkup = ({
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
  const size = r * 0.75;
  const c = color ?? kind === Ki.Black ? 0xffffffff : 'black';

  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={size}
        color={c}
        style={'stroke'}
        strokeWidth={0.5}
      />
    </>
  );
};
