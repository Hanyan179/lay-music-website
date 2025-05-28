# 宿命回响 (Fate Echoes)

一个基于角色创建和命运模拟的游戏系统。

## 项目简介

宿命回响是一个独特的角色创建和命运模拟游戏，玩家可以创建自己的角色，并通过不同的选择来体验不同的人生轨迹。游戏包含丰富的属性系统、事件系统和随机机制，为玩家提供沉浸式的游戏体验。

## 主要特性

- 详细的属性系统（家世基础、形象资质、身体机能、学习天赋、机遇感知）
- 丰富的随机事件系统
- 真实的社会阶层模拟
- 多样化的人生选择
- 独特的机遇感知机制

## 技术栈

- 前端：React + TypeScript + TailwindCSS
- 构建工具：Vite
- 状态管理：Zustand
- UI组件：Shadcn/ui

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/[your-username]/fate-echoes.git
```

2. 安装依赖
```bash
cd fate-echoes
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建项目
```bash
npm run build
```

## 项目结构

```
fate-echoes/
├── src/
│   ├── components/    # UI组件
│   ├── hooks/        # 自定义Hook
│   ├── stores/       # 状态管理
│   ├── types/        # TypeScript类型定义
│   └── utils/        # 工具函数
├── public/           # 静态资源
└── docs/            # 项目文档
```

## 文档

详细的文档可以在 `docs` 目录下找到：
- [属性系统说明](docs/attributes.md)
- [事件系统说明](docs/events/README.md)
- [游戏机制说明](docs/mechanics/README.md)
- [术语说明](docs/terms/README.md)

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目。

## 许可证

本项目采用 MIT 许可证。 