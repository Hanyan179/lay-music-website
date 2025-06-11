@echo off
chcp 65001 >nul
echo 🚀 快速启动脚本 - LAY张艺兴音乐网站
echo.

echo ⏳ 检查并关闭占用3004端口的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004') do (
    if not "%%a"=="0" (
        echo 🔴 发现占用进程 PID: %%a
        taskkill /PID %%a /F >nul 2>&1
        if !errorlevel! equ 0 (
            echo ✅ 成功终止进程 %%a
        ) else (
            echo ❌ 终止进程失败，请手动终止
        )
    )
)

echo.
echo ⏳ 等待端口释放...
timeout /t 2 >nul

echo.
echo 🚀 启动前端开发服务器...
echo.
npm run dev

pause 