# 张艺兴艺术家主页样式文件

## 文件结构

```
src/styles/
├── index.css          # 样式统一入口文件
├── variables.css      # CSS变量定义（颜色、字体、间距等）
├── layout.css         # 布局相关样式
├── components.css     # 组件样式（导航、卡片、按钮等）
├── animations.css     # 动画相关样式
├── backgrounds.css    # 背景效果样式
├── music.css          # 音乐相关样式
└── README.md          # 说明文档
```

## 使用方法

在Vue组件中导入：

```javascript
import '@/styles/index.css'
```

或者单独导入特定样式文件：

```javascript
import '@/styles/variables.css'
import '@/styles/components.css'
```

## 样式分类说明

### variables.css
- CSS变量定义
- 颜色系统（纯白简约色彩）
- 音乐主题色彩
- 字体系统
- 阴影系统
- 间距系统
- 动画函数

### layout.css
- 基础布局样式
- 容器系统
- 响应式布局
- 背景动画

### components.css
- 导航栏样式
- 音乐品牌标识
- 卡片系统
- 按钮样式

### animations.css
- 基础动画关键帧
- Hero标题动画
- 音频可视化动画
- 海浪背景动画
- 气泡动画
- 滚动动画

### backgrounds.css
- 粒子背景
- 海浪波纹背景
- 装饰性气泡
- 交互背景
- 艺术背景效果

### music.css
- 音频可视化器
- 音乐卡片
- 播放按钮
- 音乐播放器
- 专辑导航
- 成就标签

## 设计特点

- 纯白简约风格
- 音乐主题色彩系统
- 毛玻璃效果
- 丰富的动画效果
- 响应式设计
- 无障碍优化

## 维护说明

- 所有颜色使用CSS变量定义
- 动画使用统一的缓动函数
- 遵循响应式设计原则
- 支持暗黑模式（可扩展）
- 支持高对比度模式 