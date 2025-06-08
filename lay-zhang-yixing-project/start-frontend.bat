@echo off
echo "正在启动LAY张艺兴音乐网站前端..."

:: 检查是否已安装依赖
if not exist node_modules (
    echo "检测到未安装依赖，正在安装..."
    npm install
    if %errorlevel% neq 0 (
        echo "依赖安装失败，请检查网络连接或尝试使用yarn"
        pause
        exit /b 1
    )
)

echo "依赖检查完成，启动开发服务器..."
npm run dev
pause 