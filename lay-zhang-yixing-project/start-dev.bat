@echo off
chcp 65001 >nul
cls

echo ==========================================
echo          Lay Music Website
echo          Development Server Startup
echo ==========================================
echo.

echo [INFO] Current Directory: %CD%
echo [INFO] Starting development server...
echo [INFO] Server will run on: http://localhost:3004
echo.

:: 检查Node.js是否安装
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo [INFO] Please install Node.js first.
    pause
    exit /b 1
)

:: 检查package.json是否存在
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo [INFO] Please run this script in the project root directory.
    pause
    exit /b 1
)

:: 安装依赖（如果node_modules不存在）
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
)

echo [INFO] Starting Vite development server...
echo [INFO] The browser will open automatically at http://localhost:3004
echo [INFO] Press Ctrl+C to stop the server
echo.

:: 启动开发服务器（Vite配置中已设置open:true会自动打开浏览器）
npm run dev 