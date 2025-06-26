@echo off
echo ============================================
echo 🚀 LAY张艺兴音乐网站 - GitHub代码推送
echo ============================================

echo 📂 当前目录: %cd%

echo.
echo 🔧 检查Git仓库状态...
git status
if %errorlevel% neq 0 (
    echo ⚠️  Git仓库未初始化，正在初始化...
    git init
    if %errorlevel% neq 0 (
        echo ❌ Git初始化失败
        pause
        exit /b 1
    )
)

echo.
echo 📋 添加所有文件到暂存区...
git add .

echo.
echo 📝 提交代码...
git commit -m "feat: LAY张艺兴音乐网站完整系统 - 包含前端展示页面、后台管理系统、数据API服务和完整文档"

echo.
echo 🔗 检查远程仓库...
git remote -v
if %errorlevel% neq 0 (
    echo ⚠️  请手动添加远程仓库:
    echo git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
    pause
    exit /b 1
)

echo.
echo 🚀 推送代码到GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ⚠️  尝试推送到master分支...
    git push -u origin master
)

echo.
echo ✅ 代码推送完成！
echo 🌐 请访问您的GitHub仓库查看代码
pause 