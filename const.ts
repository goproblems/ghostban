import {chunk} from 'lodash';
import {Theme, ThemeConfig} from './types';

const settings = {cdn: 'https://s.shaowq.com'};

export const BASE_THEME_CONFIG: ThemeConfig = {
  positiveNodeColor: '#4d7c0f',
  negativeNodeColor: '#b91c1c',
  neutralNodeColor: '#a16207',
  defaultNodeColor: '#404040',
  warningNodeColor: '#ffdf20',
  shadowColor: '#555555',
  boardLineColor: '#000000',
  activeColor: '#000000',
  inactiveColor: '#666666',
  boardBackgroundColor: '#FFFFFF',
  flatBlackColor: '#000000',
  flatBlackColorAlt: '#000000', // Alternative, temporarily same as main color
  flatWhiteColor: '#FFFFFF',
  flatWhiteColorAlt: '#FFFFFF', // Alternative, temporarily same as main color
  boardEdgeLineWidth: 2,
  boardLineWidth: 1.2,
  boardLineExtent: 0.5,
  starSize: 3,
  markupLineWidth: 2,
  highlightColor: '#ffeb64',
  stoneRatio: 0.45,
};

export const MAX_BOARD_SIZE = 29;
export const DEFAULT_BOARD_SIZE = 19;
export const A1_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
];
export const A1_LETTERS_WITH_I = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
];
export const A1_NUMBERS = [
  19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];
export const SGF_LETTERS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
];
// export const BLANK_ARRAY = chunk(new Array(361).fill(0), 19);
export const DOT_SIZE = 3;
export const EXPAND_H = 5;
export const EXPAND_V = 5;
export const RESPONSE_TIME = 100;

export const DEFAULT_OPTIONS = {
  boardSize: 19,
  padding: 15,
  extent: 2,
  interactive: false,
  coordinate: true,
  theme: Theme.Flat,
  background: false,
  zoom: false,
  showAnalysis: false,
};

export const THEME_RESOURCES: {
  [key in Theme]: {
    board?: string;
    blacks: string[];
    whites: string[];
    lowRes?: {
      board?: string;
      blacks: string[];
      whites: string[];
    };
  };
} = {
  [Theme.BlackAndWhite]: {
    blacks: [],
    whites: [],
  },
  [Theme.Subdued]: {
    board: `${settings.cdn}/assets/theme/subdued/board.png`,
    blacks: [`${settings.cdn}/assets/theme/subdued/black.png`],
    whites: [`${settings.cdn}/assets/theme/subdued/white.png`],
  },
  [Theme.ShellStone]: {
    board: `${settings.cdn}/assets/theme/shell-stone/board.png`,
    blacks: [`${settings.cdn}/assets/theme/shell-stone/black.png`],
    whites: [
      `${settings.cdn}/assets/theme/shell-stone/white0.png`,
      `${settings.cdn}/assets/theme/shell-stone/white1.png`,
      `${settings.cdn}/assets/theme/shell-stone/white2.png`,
      `${settings.cdn}/assets/theme/shell-stone/white3.png`,
      `${settings.cdn}/assets/theme/shell-stone/white4.png`,
    ],
  },
  [Theme.SlateAndShell]: {
    board: `${settings.cdn}/assets/theme/slate-and-shell/board.png`,
    blacks: [
      `${settings.cdn}/assets/theme/slate-and-shell/slate1.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/slate2.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/slate3.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/slate4.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/slate5.png`,
    ],
    whites: [
      `${settings.cdn}/assets/theme/slate-and-shell/shell1.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/shell2.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/shell3.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/shell4.png`,
      `${settings.cdn}/assets/theme/slate-and-shell/shell5.png`,
    ],
  },
  [Theme.Walnut]: {
    board: `${settings.cdn}/assets/theme/walnut/board.jpg`,
    blacks: [`${settings.cdn}/assets/theme/walnut/black.png`],
    whites: [`${settings.cdn}/assets/theme/walnut/white.png`],
  },
  [Theme.Photorealistic]: {
    board: `${settings.cdn}/assets/theme/photorealistic/board.png`,
    blacks: [`${settings.cdn}/assets/theme/photorealistic/black.png`],
    whites: [`${settings.cdn}/assets/theme/photorealistic/white.png`],
  },
  [Theme.Flat]: {
    blacks: [],
    whites: [],
  },
  [Theme.Warm]: {
    blacks: [],
    whites: [],
  },
  [Theme.Dark]: {
    blacks: [],
    whites: [],
  },
  [Theme.YunziMonkeyDark]: {
    board: `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-Bo-V10_lessborder1920px.png`,
    blacks: [
      `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-B-v14-338px.png`,
    ],
    whites: [
      `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-W-v14-338px.png`,
    ],
    lowRes: {
      board: `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-Bo-V10_lessborder-960px.png`,
      blacks: [
        `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-B-v14-135px.png`,
      ],
      whites: [
        `${settings.cdn}/assets/theme/ymd/yunzi-monkey-dark/YMD-W-v14-135px.png`,
      ],
    },
  },
  [Theme.HighContrast]: {
    blacks: [],
    whites: [],
  },
};

export const LIGHT_GREEN_RGB = 'rgba(136, 170, 60, 1)';
export const LIGHT_YELLOW_RGB = 'rgba(206, 210, 83, 1)';
export const YELLOW_RGB = 'rgba(242, 217, 60, 1)';
export const LIGHT_RED_RGB = 'rgba(236, 146, 73, 1)';
