import {GhostBan} from './ghostban';
import {Theme, ThemeOptions} from './types';

// 测试默认的 themeOptions
const defaultGhostBan = new GhostBan();
console.log('Default themeOptions:', defaultGhostBan.options.themeOptions);

// 测试自定义 themeOptions
const customThemeOptions: Partial<ThemeOptions> = {
  [Theme.Dark]: {
    shadowColor: '#333',
    boardLineColor: '#444',
    activeColor: '#111',
    boardBackgroundColor: '#222',
  },
  [Theme.Flat]: {
    shadowColor: '#000',
    boardLineColor: '#555',
  },
};

const customGhostBan = new GhostBan({
  themeOptions: customThemeOptions,
});

console.log('Custom themeOptions:', customGhostBan.options.themeOptions);

// 测试部分覆盖 themeOptions
const partialGhostBan = new GhostBan({
  themeOptions: {
    [Theme.Warm]: {
      shadowColor: '#000',
      activeColor: '#purple',
    },
  },
});

console.log('Partial themeOptions:', partialGhostBan.options.themeOptions);

// 测试 setOptions 方法
partialGhostBan.setOptions({
  themeOptions: {
    [Theme.Dark]: {
      shadowColor: '#orange',
    },
  },
});

console.log('After setOptions:', partialGhostBan.options.themeOptions);
