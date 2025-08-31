// 测试不同主题的板子背景颜色
import {GhostBan} from './ghostban';
import {Theme} from './types';

// 测试默认的主题颜色
console.log('=== 测试默认主题颜色 ===');

const blackAndWhite = new GhostBan({theme: Theme.BlackAndWhite});
console.log(
  'BlackAndWhite boardBackgroundColor:',
  (blackAndWhite as any).getThemeProperty('boardBackgroundColor')
);

const flat = new GhostBan({theme: Theme.Flat});
console.log(
  'Flat boardBackgroundColor:',
  (flat as any).getThemeProperty('boardBackgroundColor')
);

const warm = new GhostBan({theme: Theme.Warm});
console.log(
  'Warm boardBackgroundColor:',
  (warm as any).getThemeProperty('boardBackgroundColor')
);

const dark = new GhostBan({theme: Theme.Dark});
console.log(
  'Dark boardBackgroundColor:',
  (dark as any).getThemeProperty('boardBackgroundColor')
);

// 测试自定义主题颜色
console.log('\n=== 测试自定义主题颜色 ===');

const customGhostBan = new GhostBan({
  theme: Theme.Dark,
  themeOptions: {
    [Theme.Dark]: {
      boardBackgroundColor: '#custom-dark-bg',
      activeColor: '#custom-active',
    },
    [Theme.Flat]: {
      boardBackgroundColor: '#custom-flat-bg',
    },
  },
});

console.log(
  'Custom Dark boardBackgroundColor:',
  (customGhostBan as any).getThemeProperty('boardBackgroundColor')
);
console.log(
  'Custom Dark activeColor:',
  (customGhostBan as any).getThemeProperty('activeColor')
);

// 切换主题测试
customGhostBan.setTheme(Theme.Flat);
console.log(
  'After switching to Flat boardBackgroundColor:',
  (customGhostBan as any).getThemeProperty('boardBackgroundColor')
);
