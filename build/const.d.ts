import { Theme, ThemeConfig } from './types';
export declare const DEFAULT_THEME_COLOR_CONFIG: ThemeConfig;
export declare const MAX_BOARD_SIZE = 29;
export declare const DEFAULT_BOARD_SIZE = 19;
export declare const A1_LETTERS: string[];
export declare const A1_LETTERS_WITH_I: string[];
export declare const A1_NUMBERS: number[];
export declare const SGF_LETTERS: string[];
export declare const DOT_SIZE = 3;
export declare const EXPAND_H = 5;
export declare const EXPAND_V = 5;
export declare const RESPONSE_TIME = 100;
export declare const DEFAULT_OPTIONS: {
    boardSize: number;
    padding: number;
    extent: number;
    interactive: boolean;
    coordinate: boolean;
    theme: Theme;
    background: boolean;
    zoom: boolean;
    showAnalysis: boolean;
};
export declare const THEME_RESOURCES: {
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
};
export declare const LIGHT_GREEN_RGB = "rgba(136, 170, 60, 1)";
export declare const LIGHT_YELLOW_RGB = "rgba(206, 210, 83, 1)";
export declare const YELLOW_RGB = "rgba(242, 217, 60, 1)";
export declare const LIGHT_RED_RGB = "rgba(236, 146, 73, 1)";
