# 项目目录结构

```
lay-zhang-yixing-project/
├── backend/                           # Java Spring Boot 后端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/                  # Java 源码
│   │   │   └── resources/             # 配置文件
│   │   └── test/                      # 测试文件
│   ├── target/                        # 编译输出目录
│   ├── pom.xml                        # Maven 配置
│   ├── .project                       # Eclipse 项目配置
│   └── start-backend.bat              # 后端启动脚本
├── src/                               # Vue3 前端源码
│   ├── api/                           # API 接口封装
│   │   ├── admin.js                   # 后台管理 API
│   │   ├── index.js                   # 通用 API 配置
│   │   └── timeline.ts                # 时间轴 API
│   ├── components/                    # Vue 组件
│   │   ├── timeline/                  # 时间轴相关组件
│   │   ├── three/                     # Three.js 3D 组件
│   │   └── EnterButton.vue            # 进入按钮组件
│   ├── database/                      # 本地数据库文件
│   ├── models/                        # 数据模型定义
│   ├── router/                        # Vue 路由配置
│   │   ├── index.ts                   # 主路由配置
│   │   └── index备份.js               # 路由备份文件
│   ├── store/                         # Pinia 状态管理
│   │   ├── index.js                   # 全局状态
│   │   └── timeline.ts                # 时间轴状态
│   ├── types/                         # TypeScript 类型定义
│   ├── utils/                         # 工具函数
│   ├── views/                         # 页面组件
│   │   ├── AdminDashboard.vue         # 后台管理仪表盘
│   │   ├── AdminLogin.vue             # 后台登录页
│   │   ├── ArtistJourney.vue          # 艺人旅程页面
│   │   ├── Home.vue                   # 首页
│   │   ├── Landing3D.vue              # 3D 着陆页
│   │   ├── Timeline3D.vue             # 3D 时间轴页面
│   │   ├── TimelinePage.vue           # 时间轴页面包装器
│   │   └── YearDetail.vue             # 年份详情页
│   ├── App.vue                        # 根组件
│   ├── env.d.ts                       # 环境变量类型定义
│   ├── main.js                        # 应用入口文件
│   └── style.css                      # 全局样式
├── public/                            # 静态资源
│   ├── artist-journey/                # 艺人旅程相关资源
│   ├── img/                           # 图片资源
│   ├── lottie/                        # Lottie 动画文件
│   └── video/                         # 视频资源
├── docs/                              # 项目文档
│   └── PROJECT_TREE.md                # 项目目录结构（本文件）
├── logs/                              # 日志文件目录
├── scripts/                           # 脚本文件目录
├── node_modules/                      # npm 依赖包
├── dist/                              # 构建输出目录
├── .cursor/                           # Cursor 编辑器配置
├── .idea/                             # IntelliJ IDEA 配置
├── .vscode/                           # VS Code 配置
├── .gitignore                         # Git 忽略文件配置
├── index.html                         # HTML 入口文件
├── package.json                       # npm 包配置
├── package-lock.json                  # npm 依赖锁定文件
├── pnpm-lock.yaml                     # pnpm 依赖锁定文件
├── postcss.config.js                  # PostCSS 配置
├── tailwind.config.js                 # TailwindCSS 配置
├── tsconfig.json                      # TypeScript 配置
├── tsconfig.node.json                 # Node.js TypeScript 配置
├── vite.config.js                     # Vite 构建配置
├── README.md                          # 项目说明文档
├── artist-journey-complete.html       # 完整艺人旅程 HTML
├── debug-login-test.html              # 登录调试测试页面
├── query                              # 查询文件
├── start-backend.bat                  # 后端启动批处理
├── start-frontend.bat                 # 前端启动批处理
├── start-system.ps1                   # 系统启动 PowerShell 脚本
├── temp-backend-server.js             # 临时后端服务器
├── test-login-api.html                # 登录 API 测试页面
├── IDE快捷键参考.md                    # IDE 快捷键参考
├── 启动说明.md                        # 项目启动说明
├── 后台管理系统说明文档.md              # 后台系统文档
├── 数据库使用说明.md                   # 数据库使用说明
├── 测试结果.md                        # 测试结果记录
├── 项目启动指南.md                     # 项目启动指南
└── 项目整理说明.md                     # 项目整理说明
```

## 关键目录说明

### 前端核心目录
- **src/views/**: 页面组件，包含所有主要页面
- **src/components/**: 可复用组件，按功能分类
- **src/api/**: API 接口封装，与后端通信
- **src/store/**: Pinia 状态管理
- **src/router/**: Vue Router 路由配置

### 后端核心目录
- **backend/src/main/java/**: Java 源码
- **backend/src/main/resources/**: 配置文件和静态资源
- **backend/pom.xml**: Maven 依赖管理

### 静态资源
- **public/**: 公共静态资源，构建时会复制到 dist 目录
- **public/img/**: 图片资源
- **public/video/**: 视频资源

### 配置文件
- **vite.config.js**: Vite 构建工具配置（端口 3004）
- **tailwind.config.js**: TailwindCSS 样式框架配置
- **tsconfig.json**: TypeScript 编译配置
- **package.json**: npm 包管理和脚本配置

### 文档目录
- **docs/**: 项目相关文档
- 各种 `.md` 文件: 项目说明和使用指南

## 端口配置
- **前端开发服务器**: 3004 (Vite)
- **后端服务器**: 8080 (Spring Boot)
- **API 基址**: http://localhost:8080/api 