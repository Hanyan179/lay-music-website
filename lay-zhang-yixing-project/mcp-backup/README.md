# MCP配置同步说明

## 当前备份内容
- `global-mcp.json` - 全局MCP配置文件

## 在其他设备上恢复配置

### Windows设备
```powershell
# 创建目录并复制配置
New-Item -Path "$env:USERPROFILE\.cursor" -ItemType Directory -Force
Copy-Item "global-mcp.json" "$env:USERPROFILE\.cursor\mcp.json"
```

### macOS/Linux设备
```bash
# 创建目录并复制配置
mkdir -p ~/.cursor
cp global-mcp.json ~/.cursor/mcp.json
```

### 项目级配置（如果需要）
```bash
# Windows
mkdir .cursor
copy project-mcp.json .cursor\mcp.json

# macOS/Linux
mkdir -p .cursor
cp project-mcp.json .cursor/mcp.json
```

## 重要提醒
1. 恢复配置后需要重启Cursor
2. 确保MCP服务器已安装（如果配置中有引用）
3. 检查路径是否正确（特别是跨平台时）

## 常用MCP服务器安装
```bash
# 文件系统服务器
npm install -g @modelcontextprotocol/server-filesystem

# Git服务器  
npm install -g @modelcontextprotocol/server-git

# 数据库服务器
npm install -g @modelcontextprotocol/server-postgres
``` 