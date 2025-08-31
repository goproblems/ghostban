// 简单测试脚本来检查主题属性获取
const {GhostBan} = require('./build/index.js');

// 创建一个 GhostBan 实例来测试
const ghostban = new GhostBan({
  boardSize: 19,
  theme: 'Dark',
  themeOptions: {
    default: {
      flatBlackColor: '#000000',
      flatWhiteColor: '#FFFFFF',
      markupLineWidth: 2,
    },
    Dark: {
      flatBlackColor: '#CCCCCC', // 暗色主题应该使用较亮的颜色
      flatWhiteColor: '#333333', // 暗色主题应该使用较暗的颜色
      markupLineWidth: 3,
    },
  },
});

console.log('Testing theme property access...');

// 测试 getThemeProperty 方法
const darkBlack = ghostban.getThemeProperty('flatBlackColor');
const darkWhite = ghostban.getThemeProperty('flatWhiteColor');
const lineWidth = ghostban.getThemeProperty('markupLineWidth');

console.log('Dark theme flatBlackColor:', darkBlack);
console.log('Dark theme flatWhiteColor:', darkWhite);
console.log('Dark theme markupLineWidth:', lineWidth);

// 检查是否获取到了暗色主题的值，而不是默认值
if (darkBlack === '#CCCCCC' && darkWhite === '#333333' && lineWidth === 3) {
  console.log('✅ Theme properties are correctly retrieved from Dark theme');
} else {
  console.log(
    '❌ Theme properties are using default values instead of Dark theme'
  );
  console.log(
    'Expected: flatBlackColor=#CCCCCC, flatWhiteColor=#333333, markupLineWidth=3'
  );
  console.log(
    `Got: flatBlackColor=${darkBlack}, flatWhiteColor=${darkWhite}, markupLineWidth=${lineWidth}`
  );
}
