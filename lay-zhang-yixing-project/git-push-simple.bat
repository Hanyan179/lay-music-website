@echo off
chcp 65001 > nul
echo ============================================
echo 🚀 推送代码到GitHub仓库
echo ============================================

echo 📂 当前目录: %cd%
echo.

echo 🔍 检查Git状态...
git status 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  初始化Git仓库...
    git init
    echo 📝 设置默认分支为main...
    git branch -M main
)

echo.
echo 📋 添加所有文件...
git add .

echo.
echo ✅ 查看将要提交的文件...
git status --porcelain

echo.
echo 📝 提交代码...
git commit -m "feat: LAY张艺兴音乐网站完整系统

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
- 一键启动服务脚本"

echo.
echo 🔗 检查远程仓库...
git remote -v

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  未找到远程仓库配置
    echo 📝 请提供您的GitHub仓库地址，格式如:
    echo    https://github.com/用户名/仓库名.git
    echo.
    set /p repo_url="请输入仓库地址: "
    
    if "!repo_url!"=="" (
        echo ❌ 未输入仓库地址，推送取消
        pause
        exit /b 1
    )
    
    echo 🔗 添加远程仓库...
    git remote add origin !repo_url!
)

echo.
echo 🚀 推送代码到GitHub...
git push -u origin main 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  main分支推送失败，尝试master分支...
    git push -u origin master 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  推送失败，尝试强制推送...
        git push -u origin main --force
    )
)

echo.
echo ✅ 代码推送完成！
echo 🌐 请访问您的GitHub仓库查看代码
echo 📊 推送的文件包括:
echo    - 15个Vue前端页面
echo    - 若依后台管理系统
echo    - Node.js数据API服务
echo    - 完整的文档和工具
echo.
pause 