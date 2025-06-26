# LAY张艺兴音乐网站 - Git推送脚本
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🚀 推送代码到GitHub仓库" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📂 当前目录: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# 检查Git状态
Write-Host "🔍 检查Git状态..." -ForegroundColor Blue
try {
    git status | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Git仓库未初始化"
    }
}
catch {
    Write-Host "⚠️  初始化Git仓库..." -ForegroundColor Yellow
    git init
    Write-Host "📝 设置默认分支为main..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""
Write-Host "📋 添加所有文件..." -ForegroundColor Blue
git add .

Write-Host ""
Write-Host "✅ 查看将要提交的文件..." -ForegroundColor Green
git status --porcelain

Write-Host ""
Write-Host "📝 提交代码..." -ForegroundColor Blue

$commitMessage = @"
feat: LAY张艺兴音乐网站完整系统

✨ 功能特性:
- Vue 3 + TypeScript 前端展示页面 (15个页面)
- 若依后台管理系统集成  
- Node.js 数据API服务 (端口8082)
- MySQL数据库支持

🎵 核心功能:
- 音乐数据管理和展示
- 时间线功能 (LAY张艺兴重要事件)
- 留言墙系统
- 用户认证和权限控制
- 3D效果和动画
- 移动端适配

🔧 技术栈:
- 前端: Vue 3, Vite, TypeScript, Tailwind CSS, Three.js
- 后端: Node.js, Express, MySQL  
- 管理: 若依框架 (Vue 2 + Element UI)

📚 文档和工具:
- 完整的启动脚本和使用指南
- API测试和验证工具
- 一键启动服务脚本
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "🔗 检查远程仓库..." -ForegroundColor Blue
$remoteCheck = git remote -v 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($remoteCheck)) {
    Write-Host ""
    Write-Host "⚠️  未找到远程仓库配置" -ForegroundColor Yellow
    Write-Host "📝 请提供您的GitHub仓库地址，格式如:" -ForegroundColor Yellow
    Write-Host "   https://github.com/用户名/仓库名.git" -ForegroundColor Gray
    Write-Host ""
    
    $repoUrl = Read-Host "请输入仓库地址"
    
    if ([string]::IsNullOrEmpty($repoUrl)) {
        Write-Host "❌ 未输入仓库地址，推送取消" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    
    Write-Host "🔗 添加远程仓库..." -ForegroundColor Blue
    git remote add origin $repoUrl
}

Write-Host ""
Write-Host "🚀 推送代码到GitHub..." -ForegroundColor Green

# 尝试推送到main分支
git push -u origin main 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  main分支推送失败，尝试master分支..." -ForegroundColor Yellow
    git push -u origin master 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  推送失败，尝试强制推送..." -ForegroundColor Yellow
        git push -u origin main --force
    }
}

Write-Host ""
Write-Host "✅ 代码推送完成！" -ForegroundColor Green
Write-Host "🌐 请访问您的GitHub仓库查看代码" -ForegroundColor Cyan
Write-Host "📊 推送的文件包括:" -ForegroundColor Yellow
Write-Host "   - 15个Vue前端页面" -ForegroundColor Gray
Write-Host "   - 若依后台管理系统" -ForegroundColor Gray  
Write-Host "   - Node.js数据API服务" -ForegroundColor Gray
Write-Host "   - 完整的文档和工具" -ForegroundColor Gray
Write-Host ""

Read-Host "按任意键退出" 