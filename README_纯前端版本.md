# 宿命回响 - 纯前端版本

## 🎯 项目简介

宿命回响（Fate Echoes）纯前端版本是一个基于Vue3 + TypeScript + Vite + Tailwind CSS的互动式人生选择游戏。

### ✨ 特性

- **纯前端运行**：无需后端服务器和数据库
- **本地数据存储**：使用LocalStorage保存游戏状态
- **响应式设计**：支持各种设备屏幕
- **现代技术栈**：Vue3 + TypeScript + Vite + Tailwind CSS
- **组件化架构**：可维护和可扩展的代码结构

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 可复用组件（如需要）
├── router/          # 路由配置
├── stores/          # Pinia状态管理
├── types/           # TypeScript类型定义
├── views/           # 页面组件
│   ├── Home.vue     # 首页
│   ├── Books.vue    # 书籍列表
│   ├── BookDetail.vue # 书籍详情
│   └── GamePlay.vue # 游戏界面
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## 🎮 功能特性

### 数据管理
- 使用 Pinia 进行状态管理
- 静态数据存储在 stores/dataStore.ts
- 用户数据（游戏状态、点赞记录）存储在浏览器 LocalStorage

### 游戏功能
- **书籍浏览**：查看所有可用的人生故事书籍
- **书籍详情**：查看书籍信息、时间线预览、关键抉择
- **游戏体验**：进行人生选择，体验不同的故事路径
- **进度保存**：自动保存游戏进度，可随时继续
- **统计功能**：记录游玩次数和点赞数

### 页面路由
- `/` - 首页
- `/books` - 书籍列表
- `/book/:id` - 书籍详情
- `/play/:id` - 游戏界面

## 📝 数据结构

### 书籍数据
```typescript
interface CharacterBook {
  id: number
  title: string
  description: string
  author: string
  startYear: number
  endYear: number
  primaryColor: string
  // ... 其他字段
}
```

### 游戏事件
```typescript
interface PersonalChoiceEvent {
  id: number
  bookId: number
  year: number
  eventCode: string
  question: string
  description: string
  options: ChoiceOption[]
  // ... 其他字段
}
```

## 🔧 自定义和扩展

### 添加新书籍

1. 在 `src/stores/dataStore.ts` 中的 `STATIC_DATA.books` 数组添加新书籍
2. 在 `STATIC_DATA.timelineEvents` 添加时间线事件
3. 在 `STATIC_DATA.personalChoiceEvents` 添加人生抉择事件

### 修改样式

项目使用 Tailwind CSS，可以：
- 在组件中直接使用 Tailwind 类名
- 在 `src/assets/main.css` 中添加自定义样式
- 在 `tailwind.config.js` 中配置主题

### 添加新功能

1. 在 `src/types/index.ts` 中定义新的类型
2. 在 `src/stores/dataStore.ts` 中添加相关状态和方法
3. 创建新的Vue组件
4. 在路由中注册新页面

## 🌐 部署

### 静态网站部署

构建后的 `dist` 目录可以部署到任何静态网站托管服务：

- Netlify
- Vercel
- GitHub Pages
- 阿里云OSS
- 腾讯云COS

### 本地服务器

```bash
# 使用http-server
npm install -g http-server
http-server dist

# 或使用Python
cd dist
python -m http.server 8080
```

## 🔄 从数据库版本迁移

如果你有之前的数据库版本，可以：

1. 导出数据库中的书籍和事件数据为JSON格式
2. 将数据复制到 `src/stores/dataStore.ts` 中的 `STATIC_DATA` 对象
3. 根据需要调整数据结构以匹配TypeScript类型定义

## 📱 移动端适配

项目已针对移动端进行优化：
- 响应式布局适配各种屏幕尺寸
- 触摸友好的交互设计
- 移动端优化的导航和按钮大小

## 🐛 常见问题

### Q: 游戏进度丢失了怎么办？
A: 游戏进度保存在浏览器的LocalStorage中，清理浏览器数据会导致进度丢失。可以提醒用户定期备份或使用云存储。

### Q: 如何添加音效和背景音乐？
A: 可以在组件中使用HTML5 Audio API，在选择和事件触发时播放音效。

### Q: 如何支持多语言？
A: 可以使用Vue I18n插件，将文本内容抽取到语言文件中。

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！ 