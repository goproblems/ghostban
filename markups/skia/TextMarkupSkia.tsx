import React from 'react';
import {useFont, Text, Color} from '@shopify/react-native-skia';
import {Ki} from '~/ghostban/types';

const roboto = require('~/assets/fonts/OpenSans-Bold.ttf');

export const TextMarkup = ({
  kind,
  x,
  y,
  r,
  text,
  color,
}: {
  kind: Ki;
  x: number;
  y: number;
  r: number;
  text: string;
  color?: Color;
}) => {
  const c = color ?? kind === Ki.Black ? 0xffffffff : 'black';
  const fontSize = r;
  const font = useFont(roboto, r);

  if (font === null) return <></>;

  const textWidth = font.getTextWidth(text);

  return (
    <>
      <Text
        text={text.toString()}
        x={x - textWidth / 2 - 0.5}
        y={y + fontSize / 2 - 1}
        font={font}
        color={c}
      />
    </>
  );
};
