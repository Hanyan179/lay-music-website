# MCP前端工具一键配置脚本
# 作者：AI助手
# 用途：为前端开发配置强大的MCP工具套件

Write-Host "🚀 开始配置MCP前端工具套件..." -ForegroundColor Green

# 检查Node.js
Write-Host "📋 检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js未安装，请先安装Node.js (版本 >= 16)" -ForegroundColor Red
    exit 1
}

# 检查npm
try {
    $npmVersion = npm --version  
    Write-Host "✅ npm版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm未安装" -ForegroundColor Red
    exit 1
}

# 创建Cursor配置目录
Write-Host "📁 创建Cursor配置目录..." -ForegroundColor Yellow
$cursorConfigDir = "C:\Users\$env:USERNAME\.cursor"
if (!(Test-Path $cursorConfigDir)) {
    New-Item -Path $cursorConfigDir -ItemType Directory -Force | Out-Null
    Write-Host "✅ 已创建目录: $cursorConfigDir" -ForegroundColor Green
} else {
    Write-Host "✅ 配置目录已存在" -ForegroundColor Green
}

# 复制MCP配置文件
Write-Host "📄 配置MCP服务器..." -ForegroundColor Yellow
$mcpConfigPath = "$cursorConfigDir\mcp.json"
if (Test-Path "mcp-config.json") {
    Copy-Item "mcp-config.json" $mcpConfigPath -Force
    Write-Host "✅ MCP配置文件已复制到Cursor" -ForegroundColor Green
} else {
    Write-Host "❌ 找不到mcp-config.json文件" -ForegroundColor Red
    exit 1
}

# 下载Browser Tools扩展
Write-Host "🔧 下载Browser Tools Chrome扩展..." -ForegroundColor Yellow
if (Test-Path "browser-tools-temp") {
    Remove-Item "browser-tools-temp" -Recurse -Force
}

try {
    git clone https://github.com/AgentDeskAI/browser-tools-mcp.git browser-tools-temp 2>$null
    Write-Host "✅ Browser Tools扩展源码已下载" -ForegroundColor Green
} catch {
    Write-Host "❌ 下载失败，请确保git已安装并可访问GitHub" -ForegroundColor Red
}

# 安装必要的npm包
Write-Host "📦 预安装MCP工具包..." -ForegroundColor Yellow
$packages = @(
    "@agentdeskai/browser-tools-mcp@latest",
    "@agentdeskai/browser-tools-server@latest", 
    "@modelcontextprotocol/inspector@latest",
    "@anguske/mcp-playwright-visual-test@latest",
    "@modelcontextprotocol/server-web-search@latest",
    "@modelcontextprotocol/server-filesystem@latest"
)

foreach ($package in $packages) {
    Write-Host "📦 安装 $package..." -ForegroundColor Cyan
    try {
        # 使用npx预安装，这样首次运行会更快
        npx -y $package --help 2>$null | Out-Null
        Write-Host "✅ $package 已准备就绪" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ $package 预安装失败，首次使用时会自动下载" -ForegroundColor Yellow
    }
}

# 显示Chrome扩展安装说明
Write-Host "`n🌐 Chrome扩展安装步骤:" -ForegroundColor Magenta
Write-Host "1. 打开Chrome浏览器" -ForegroundColor White
Write-Host "2. 访问 chrome://extensions/" -ForegroundColor White
Write-Host "3. 开启右上角的'开发者模式'" -ForegroundColor White
Write-Host "4. 点击'加载已解压的扩展程序'" -ForegroundColor White
Write-Host "5. 选择目录: $(Get-Location)\browser-tools-temp\chrome-extension" -ForegroundColor White

# 显示启动说明
Write-Host "`n🚀 启动MCP服务器:" -ForegroundColor Magenta
Write-Host "1. 在新的PowerShell窗口中运行:" -ForegroundColor White
Write-Host "   npx @agentdeskai/browser-tools-server@latest" -ForegroundColor Cyan
Write-Host "2. 重启Cursor IDE" -ForegroundColor White
Write-Host "3. 在Cursor中应该能看到MCP工具的绿色状态指示器" -ForegroundColor White

# 显示测试命令
Write-Host "`n🧪 测试命令示例:" -ForegroundColor Magenta
Write-Host "在Cursor中尝试以下命令:" -ForegroundColor White
Write-Host '• "请帮我截图并分析 https://threejs.org 的首页设计"' -ForegroundColor Cyan
Write-Host '• "请使用Browser Tools分析这个网站的技术栈"' -ForegroundColor Cyan
Write-Host '• "请运行性能审计并提供优化建议"' -ForegroundColor Cyan

# 显示故障排除信息
Write-Host "`n🔧 故障排除:" -ForegroundColor Magenta
Write-Host "• 如果MCP服务器无法启动，请检查端口3025是否被占用" -ForegroundColor White
Write-Host "• 如果Chrome扩展无法连接，请确保开发者工具已打开" -ForegroundColor White
Write-Host "• 详细说明请查看 'MCP前端工具配置指南.md'" -ForegroundColor White

Write-Host "`n🎉 MCP前端工具套件配置完成！" -ForegroundColor Green
Write-Host "📚 查看详细使用指南: MCP前端工具配置指南.md" -ForegroundColor Yellow

# 询问是否立即启动Browser Tools服务器
$response = Read-Host "`n是否现在启动Browser Tools服务器？(y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "🚀 启动Browser Tools服务器..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx @agentdeskai/browser-tools-server@latest"
    Write-Host "✅ Browser Tools服务器已在新窗口中启动" -ForegroundColor Green
    Write-Host "🔄 请重启Cursor IDE以完成配置" -ForegroundColor Yellow
} 