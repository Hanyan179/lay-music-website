# 🚀 前端MCP工具套件

专为前端开发、网站设计分析、Three.js、WebGL等技术量身定制的MCP工具组合。

## ⚡ 快速开始

### 一键配置
```powershell
# 在PowerShell中运行
.\setup-mcp-tools.ps1
```

### 手动配置
1. **复制MCP配置**
   ```powershell
   Copy-Item "mcp-config.json" "C:\Users\$env:USERNAME\.cursor\mcp.json"
   ```

2. **下载Chrome扩展**
   ```powershell
   git clone https://github.com/AgentDeskAI/browser-tools-mcp.git browser-tools-temp
   ```

3. **加载Chrome扩展**
   - 访问 `chrome://extensions/`
   - 开启开发者模式
   - 加载 `browser-tools-temp/chrome-extension` 目录

4. **启动MCP服务器**
   ```powershell
   npx @agentdeskai/browser-tools-server@latest
   ```

5. **重启Cursor IDE**

## 🛠️ 包含的工具

| 工具 | 功能 | 用途 |
|------|------|------|
| **Browser Tools MCP** | 网页截图、DOM分析、性能审计 | 分析网站设计和技术实现 |
| **Playwright Visual Test** | 自动化UI测试、视觉比较 | 复现和测试网站效果 |
| **MCP Inspector** | 可视化调试界面 | 调试和开发MCP工具 |
| **Web Search** | 实时网络搜索 | 获取设计灵感和技术参考 |
| **File System** | 文件操作 | 管理项目文件 |

## 📖 使用示例

### 网站设计分析
```
"请帮我截图并分析 https://threejs.org 的首页设计"
```

### 技术栈分析
```
"请分析 https://webglsamples.org 的WebGL实现和技术栈"
```

### 性能优化
```
"请使用Performance Audit分析这个Three.js项目的渲染性能"
```

## 📁 文件说明

- `mcp-config.json` - MCP服务器配置文件
- `setup-mcp-tools.ps1` - 一键配置脚本
- `MCP前端工具配置指南.md` - 详细配置和使用指南

## 🔧 故障排除

1. **MCP服务器无法启动** → 检查端口3025是否被占用
2. **Chrome扩展无法连接** → 确保开发者工具已打开
3. **截图功能无法使用** → 重启Chrome和Browser Tools服务器

## 📚 更多资源

- [详细配置指南](./MCP前端工具配置指南.md)
- [Browser Tools GitHub](https://github.com/AgentDeskAI/browser-tools-mcp)
- [MCP官方文档](https://modelcontextprotocol.io)

---

**配置完成后，您将拥有一个强大的前端分析和开发助手！** 🎉 