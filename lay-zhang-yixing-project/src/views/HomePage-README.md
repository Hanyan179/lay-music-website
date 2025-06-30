# HomePage 组件说明

## 概述
HomePage组件是从 `codepen/home-page-playground` 项目转换而来的Vue 3组件，基于Paper Kit 2设计。

## 功能特性

### 1. 响应式导航栏
- 固定在页面顶部
- 滚动时自动切换透明/不透明状态
- 移动端汉堡菜单支持
- 社交媒体链接集成

### 2. 英雄区域
- 视差滚动背景效果
- 动态云朵动画
- 雾气装饰效果
- 响应式标题和副标题

### 3. 交互功能
- 防抖滚动处理
- 移动端友好的触摸交互
- 平滑的过渡动画效果

## 路由配置
组件已添加到路由系统中：
```typescript
{ path: '/home', name: 'HomePage', component: () => import('@/views/HomePage.vue') }
```

## 导航链接
在ArtistJourney.vue中已添加导航链接：
- 桌面端：顶部导航栏中的"主页"链接
- 移动端：移动菜单中的"主页"链接

## 文件结构
```
src/
├── views/
│   └── HomePage.vue          # 主组件文件
├── styles/
│   └── home-page.css         # 样式文件（从原始项目复制）
└── router/
    └── index.ts              # 路由配置（已更新）
```

## 技术栈
- Vue 3 Composition API
- TypeScript支持
- 响应式设计
- CSS3动画和过渡效果
- 视差滚动效果

## 使用方法
访问 `/home` 路径即可查看HomePage组件。

## 自定义配置
可以通过修改以下内容来自定义页面：

### 1. 品牌和链接
在HomePage.vue中修改：
- 品牌名称：`<a class="navbar-brand">`
- 社交媒体链接：更新href属性
- 登录按钮链接

### 2. 内容
- 主标题：修改`SITE TITLE`
- 副标题：修改`Headline`
- 背景图片：更新style中的backgroundImage

### 3. 样式
主要样式在 `src/styles/home-page.css` 中，可以根据需要进行自定义。

## 注意事项
1. CSS文件较大（172KB），包含完整的Paper Kit 2样式
2. 使用了外部CDN图片资源，建议替换为本地资源
3. 组件使用了防抖技术优化性能
4. 移动端响应式设计已优化 