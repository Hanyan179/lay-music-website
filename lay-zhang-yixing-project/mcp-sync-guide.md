# MCP配置同步指南

## 当前配置状态
- **全局配置位置**: `c:\Users\hanse\.cursor\mcp.json`
- **项目配置位置**: `.cursor\mcp.json` (不存在)

## 同步方案

### 1. 导出当前配置
```bash
# 查看当前全局配置
type "c:\Users\hanse\.cursor\mcp.json"

# 如果有项目配置，也导出
if (Test-Path ".cursor\mcp.json") { type ".cursor\mcp.json" }
```

### 2. 在其他设备上同步

#### Windows设备
```bash
# 创建用户目录下的配置文件
New-Item -Path "$env:USERPROFILE\.cursor" -ItemType Directory -Force
Copy-Item "mcp-config-backup.json" "$env:USERPROFILE\.cursor\mcp.json"
```

#### macOS/Linux设备
```bash
# 创建用户目录下的配置文件
mkdir -p ~/.cursor
cp mcp-config-backup.json ~/.cursor/mcp.json
```

### 3. 项目级配置同步
```bash
# 在每个项目中创建配置
mkdir -p .cursor
cp mcp-project-config.json .cursor/mcp.json
```

## 推荐配置模板

### 全局配置示例
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"],
      "env": {}
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."],
      "env": {}
    }
  }
}
```

### 项目特定配置示例
```json
{
  "mcpServers": {
    "project-tools": {
      "command": "node",
      "args": ["./scripts/mcp-server.js"],
      "env": {
        "PROJECT_ROOT": "."
      }
    }
  }
}
```

## 自动同步脚本

### 备份配置脚本
```powershell
# backup-mcp-config.ps1
$configPath = "$env:USERPROFILE\.cursor\mcp.json"
$backupPath = ".\mcp-config-backup.json"

if (Test-Path $configPath) {
    Copy-Item $configPath $backupPath
    Write-Host "MCP配置已备份到: $backupPath"
} else {
    Write-Host "未找到MCP配置文件"
}
```

### 恢复配置脚本
```powershell
# restore-mcp-config.ps1
$backupPath = ".\mcp-config-backup.json"
$configPath = "$env:USERPROFILE\.cursor\mcp.json"

if (Test-Path $backupPath) {
    New-Item -Path "$env:USERPROFILE\.cursor" -ItemType Directory -Force
    Copy-Item $backupPath $configPath
    Write-Host "MCP配置已恢复到: $configPath"
} else {
    Write-Host "未找到备份文件: $backupPath"
}
```

## 常用MCP服务器

### 文件系统服务器
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

### Git服务器
```bash
npm install -g @modelcontextprotocol/server-git
```

### 数据库服务器
```bash
npm install -g @modelcontextprotocol/server-postgres
```

## 注意事项
1. 敏感信息（API密钥）建议使用环境变量
2. 项目配置会覆盖全局配置
3. 路径需要根据操作系统调整
4. 配置更改后需要重启Cursor 