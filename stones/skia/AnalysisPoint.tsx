import React from 'react';
import {Circle, Color, Text, useFont} from '@shopify/react-native-skia';

const roboto = require('~/assets/fonts/OpenSans-Bold.ttf');

export const AnalysisPoint = ({
  x,
  y,
  r,
  color,
  text,
}: {
  x: number;
  y: number;
  r: number;
  color: Color;
  text: string;
}) => {
  const fontSize = r * 0.8;
  const font = useFont(roboto, fontSize);

  if (font === null) return <></>;
  const textWidth = font.getTextWidth(text);

  return (
    <>
      <Circle cx={x} cy={y} r={r} color={color} />
      <Text
        text={text}
        x={x - textWidth / 2 - 1}
        y={y + fontSize / 2 - 1}
        font={font}
      />
    </>
  );
};
