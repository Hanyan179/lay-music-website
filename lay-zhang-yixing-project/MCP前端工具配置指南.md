# MCP前端工具配置指南 - 2025年6月最新版

## 概述
本指南将帮助您配置最强大的MCP工具组合，专门用于前端开发、网站设计分析、Three.js、WebGL等技术。

## 推荐的前端MCP工具套件

### 1. **Browser Tools MCP** - 核心网站分析工具 ⭐⭐⭐⭐⭐
**功能特点：**
- 实时网页截图和视觉分析
- DOM元素检查和样式分析
- 控制台日志和网络请求监控
- 性能、SEO、可访问性审计
- 支持Chrome扩展集成

**适用场景：**
- 分析优秀网站的设计和交互
- 获取页面的技术实现细节
- 监控前端性能和错误

### 2. **Playwright Visual Test MCP** - UI视觉比较工具 ⭐⭐⭐⭐
**功能特点：**
- 自动化页面截图和比较
- 视觉回归测试
- 自动登录和页面交互
- 支持不同视窗大小测试

**适用场景：**
- 复现和测试网站效果
- 比较设计差异
- 自动化UI测试

### 3. **MCP Inspector** - 开发调试工具 ⭐⭐⭐⭐
**功能特点：**
- 可视化MCP服务器调试
- 浏览器界面测试工具
- 实时工具状态监控

**适用场景：**
- 调试MCP工具
- 开发自定义前端工具

### 4. **Web Search MCP** - 网络搜索工具 ⭐⭐⭐
**功能特点：**
- 实时网络搜索
- 获取最新前端技术信息
- 查找设计灵感和技术参考

**适用场景：**
- 搜索前端技术实现方案
- 获取设计灵感
- 查找技术文档

## 配置步骤

### 第一步：准备环境
1. **确保Node.js已安装** (版本 ≥ 16)
```powershell
node --version
npm --version
```

2. **安装Chrome浏览器** (最新版本)

3. **确保Cursor IDE已更新** (版本 ≥ 0.45)

### 第二步：配置Cursor MCP
1. **复制配置文件**
```powershell
# 复制项目中的mcp-config.json到Cursor配置目录
Copy-Item "mcp-config.json" "C:\Users\hanse\.cursor\mcp.json"
```

2. **或手动创建配置**
在 `C:\Users\hanse\.cursor\mcp.json` 中粘贴项目根目录的配置内容

### 第三步：安装Browser Tools Chrome扩展
1. **下载扩展程序**
```powershell
# 下载Browser Tools扩展源码
git clone https://github.com/AgentDeskAI/browser-tools-mcp.git browser-tools-temp
```

2. **加载扩展到Chrome**
- 打开Chrome，访问 `chrome://extensions/`
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择 `browser-tools-temp/chrome-extension` 目录

### 第四步：启动MCP服务器
1. **启动Browser Tools服务器**
```powershell
npx @agentdeskai/browser-tools-server@latest
```

2. **重启Cursor IDE**
重启后您应该在MCP设置中看到绿色状态指示器

### 第五步：测试功能
1. **基础测试**
在Cursor中输入：
```
"请帮我截图并分析 https://threejs.org 的首页设计"
```

2. **高级测试**
```
"请使用Browser Tools分析 https://webglsamples.org 的WebGL实现，获取其技术栈和性能数据"
```

## 高级使用技巧

### 网站设计分析工作流
1. **获取整体设计**
```
"请截图 [目标网站] 并分析其布局结构、色彩搭配和视觉层次"
```

2. **技术栈分析**
```
"请分析 [目标网站] 的技术栈，包括前端框架、CSS框架、JavaScript库"
```

3. **交互效果分析**
```
"请分析 [目标网站] 的动画效果和交互实现方式"
```

### Three.js/WebGL项目分析
1. **性能分析**
```
"请使用Performance Audit分析这个Three.js项目的渲染性能"
```

2. **代码结构分析**
```
"请分析控制台中Three.js的加载和初始化过程"
```

3. **资源优化建议**
```
"请分析WebGL应用的资源加载情况并提供优化建议"
```

## 故障排除

### 常见问题
1. **MCP服务器无法启动**
   - 检查Node.js版本
   - 确保端口3025未被占用
   - 重启Cursor IDE

2. **Chrome扩展无法连接**
   - 检查扩展是否正确加载
   - 确保Chrome开发者工具已打开
   - 检查Browser Tools面板是否可见

3. **截图功能无法使用**
   - 确保Browser Tools服务器正在运行
   - 检查Chrome扩展权限
   - 重启Chrome浏览器

### 端口配置
- Browser Tools Server: 3025
- MCP Inspector Client: 6274  
- MCP Inspector Server: 6277

### 性能优化建议
1. **只启用需要的MCP服务器**
2. **定期清理截图缓存目录**
3. **在不使用时关闭Browser Tools服务器**

## 安全注意事项
1. **仅在受信任的网站上使用这些工具**
2. **注意不要在MCP工具中输入敏感信息**
3. **定期更新MCP服务器版本**
4. **使用MCPScan.ai检查MCP服务器安全性**

## 更多资源
- [Browser Tools MCP GitHub](https://github.com/AgentDeskAI/browser-tools-mcp)
- [MCP官方文档](https://modelcontextprotocol.io)
- [Cursor MCP配置指南](https://cursor.directory/mcp)
- [MCPScan.ai - MCP安全扫描](https://mcpscan.ai)

---

**配置完成后，您将拥有一个强大的前端分析和开发助手，能够帮助您更好地理解和复现优秀的网站设计效果！** 