# Cursor IDE 前端项目启动指南

## 📋 项目概述

本项目是一个**张艺兴音乐主题网站**，基于 Vue3 + Vite + TypeScript 技术栈开发。

## 🛠️ 环境要求

- **Node.js**: 16.x 或更高版本
- **包管理器**: npm 或 pnpm (推荐使用 pnpm)
- **IDE**: Cursor IDE

## 🚀 在 Cursor 中启动前端项目

### 方法1：使用 Cursor 内置终端（推荐）

1. **打开集成终端**
   - 快捷键：`Ctrl + `` ` (反引号)
   - 或菜单：`Terminal` → `New Terminal`

2. **安装依赖**
   ```bash
   # 如果使用 npm
   npm install
   
   # 如果使用 pnpm（推荐）
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   # 使用 npm
   npm run dev
   
   # 使用 pnpm
   pnpm dev
   ```

### 方法2：使用 Cursor 的任务运行器

1. **打开命令面板**
   - 快捷键：`Ctrl + Shift + P`

2. **运行任务**
   - 输入 `Tasks: Run Task`
   - 选择 `npm: dev` 或相应的开发任务

### 方法3：使用批处理脚本

1. **在 Cursor 中打开终端**
2. **运行启动脚本**
   ```bash
   # Windows
   ./start-frontend.bat
   
   # 或直接运行
   start-frontend.bat
   ```

## 🔧 项目配置详解

### Package.json 脚本说明

```json
{
  "scripts": {
    "dev": "vite --port 3004 --strictPort",    // 开发模式，固定端口3004
    "build": "vite build",                      // 构建生产版本
    "preview": "vite preview",                  // 预览构建结果
    "serve": "vite preview --port 3000"        // 预览服务，端口3000
  }
}
```

### Vite 配置重点

**vite.config.ts** 中的关键配置：
```typescript
server: {
  port: 3004,              // 固定端口
  strictPort: true,        // 端口被占用时直接报错，不自动递增
  hmr: { 
    protocol: 'ws', 
    host: 'localhost', 
    port: 3004,
    overlay: false 
  },
  open: true               // 自动打开浏览器
}
```

## 🚨 端口号报错问题解决方案

### 问题1：端口被占用 (EADDRINUSE)

**错误信息示例：**
```
Error: listen EADDRINUSE: address already in use :::3004
```

#### 🔥 快速解决方案（推荐）

**方法1：一键解决脚本**
```bash
# 双击运行根目录下的脚本
quick-start.bat

# 或在PowerShell中运行
.\kill-port-3004.ps1 && npm run dev
```

**方法2：单行命令解决**
```bash
# Windows Command - 一行命令解决
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3004') do taskkill /PID %a /F && npm run dev

# PowerShell - 一行命令解决
Get-NetTCPConnection -LocalPort 3004 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force } && npm run dev
```

#### 解决方案A：查找并终止占用端口的进程

1. **查找占用进程**
   ```bash
   # Windows
   netstat -ano | findstr :3004
   
   # 或使用 PowerShell
   Get-NetTCPConnection -LocalPort 3004
   ```

2. **终止进程**
   ```bash
   # Windows - 根据PID终止进程
   taskkill /PID <进程ID> /F
   
   # 示例
   taskkill /PID 12345 /F
   ```

#### 解决方案B：修改端口配置

1. **临时修改端口**
   ```bash
   # 使用不同端口启动
   npx vite --port 3005
   
   # 或
   npm run dev -- --port 3005
   ```

2. **永久修改配置**
   
   修改 `vite.config.ts`:
   ```typescript
   server: {
     port: 3005,        // 改为其他端口
     strictPort: false, // 允许自动递增端口
     open: true
   }
   ```

#### 解决方案C：使用环境变量

1. **创建 .env.local 文件**
   ```env
   VITE_PORT=3005
   ```

2. **修改 vite.config.ts**
   ```typescript
   export default defineConfig({
     server: {
       port: Number(process.env.VITE_PORT) || 3004
     }
   })
   ```

### 问题2：权限不足

**错误信息示例：**
```
Error: listen EACCES: permission denied 0.0.0.0:80
```

**解决方案：**
- 使用大于1024的端口号
- 避免使用系统保留端口（80, 443等）

### 问题3：pnpm命令不可用

**错误信息示例：**
```
pnpm : 无法将"pnpm"项识别为 cmdlet、函数、脚本文件或可运行程序的名称
```

**解决方案：**

**方案1：安装pnpm（推荐）**
```bash
# 使用npm安装pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

**方案2：直接使用npm**
```bash
# 将所有pnpm命令替换为npm
npm install      # 替代 pnpm install
npm run dev      # 替代 pnpm dev
npm run build    # 替代 pnpm build
```

**方案3：使用npx运行pnpm**
```bash
# 临时使用pnpm
npx pnpm install
npx pnpm dev
```

### 问题4：防火墙阻止

**解决方案：**
1. **Windows 防火墙设置**
   - 控制面板 → 系统和安全 → Windows Defender 防火墙
   - 允许应用通过防火墙 → 添加 Node.js

2. **临时关闭防火墙测试**
   ```powershell
   # PowerShell (管理员模式)
   netsh advfirewall set allprofiles state off
   ```

## 🔍 端口管理最佳实践

### 1. 推荐端口范围
- **开发环境**: 3000-3999
- **测试环境**: 4000-4999
- **避免使用**: 80, 443, 8080 (常被其他服务占用)

### 2. 端口检测脚本

创建 `check-port.js`:
```javascript
const net = require('net');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 100; port++) {
    if (await checkPort(port)) {
      console.log(`可用端口: ${port}`);
      return port;
    }
  }
  throw new Error('未找到可用端口');
}

findAvailablePort(3004);
```

## 📱 访问地址说明

启动成功后，项目将在以下地址可访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端开发服务** | http://localhost:3004 | 主要访问地址 |
| **前端预览服务** | http://localhost:3000 | 构建预览 |
| **后端API服务** | http://localhost:8080 | 后端接口 |
| **后台管理** | http://localhost:3004/x-back | 管理员后台 |

## 🛠️ Cursor IDE 特色功能

### 1. 智能终端管理

- **多终端支持**: `Ctrl + Shift + `` ` 新建终端
- **终端分屏**: 右键终端标签 → Split Terminal
- **快速切换**: `Ctrl + PageUp/PageDown`

### 2. 实时错误检测

- Cursor 会实时显示编译错误
- 错误会在问题面板中展示 (`Ctrl + Shift + M`)

### 3. 热重载状态显示

- 底部状态栏显示 HMR 连接状态
- 文件变更自动触发重新编译

## 🔄 常见启动流程

### 标准启动步骤：

1. **打开项目**
   ```bash
   # 使用 Cursor 打开项目目录
   cursor .
   ```

2. **安装依赖** (首次启动)
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **验证启动**
   - 检查终端输出
   - 浏览器自动打开 http://localhost:3004
   - 确认页面正常加载

## 🚨 故障排除检查清单

### ✅ 启动前检查
- [ ] Node.js 版本 ≥ 16
- [ ] 依赖已安装 (`node_modules` 存在)
- [ ] 端口 3004 未被占用
- [ ] 网络连接正常

### ✅ 启动失败排查
- [ ] 查看终端错误信息
- [ ] 检查 `package.json` 脚本配置
- [ ] 清除缓存：`rm -rf node_modules package-lock.json && npm install`
- [ ] 尝试不同端口启动
- [ ] 重启 Cursor IDE

### ✅ 运行时问题
- [ ] 热重载是否正常工作
- [ ] API 请求是否成功 (检查 Network 面板)
- [ ] 控制台是否有 JavaScript 错误
- [ ] 代理配置是否正确

## 📞 技术支持

如果按照本指南仍然遇到问题，请检查：

1. **环境兼容性**
   - Node.js 版本兼容性
   - 依赖包版本冲突

2. **系统资源**
   - 内存使用情况
   - 磁盘空间是否充足

3. **网络环境**
   - 公司网络是否有限制
   - 代理设置是否正确

## 🎯 快速参考命令

### 🚀 一键启动（端口冲突自动解决）
```bash
# 方法1：双击运行 (Windows)
quick-start.bat

# 方法2：PowerShell一行命令
.\kill-port-3004.ps1 && npm run dev

# 方法3：Command一行命令
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3004') do taskkill /PID %a /F && npm run dev
```

### 📦 包管理器相关
```bash
# 安装依赖
npm install
# 注意：如果pnpm不可用，直接使用npm

# 启动项目
npm run dev

# 查看可用脚本
npm run

# 清理并重新安装
rmdir /s node_modules && npm install
```

### 🔧 端口管理
```bash
# 检查端口占用 (Windows)
netstat -ano | findstr :3004

# PowerShell查看端口占用
Get-NetTCPConnection -LocalPort 3004

# 强制终止进程 (Windows)
taskkill /PID <PID> /F

# PowerShell终止进程
Stop-Process -Id <PID> -Force
```

### 📋 常用调试命令
```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 清除npm缓存
npm cache clean --force

# 检查项目状态
npm ls
```

---

**🎵 祝您开发愉快！** 