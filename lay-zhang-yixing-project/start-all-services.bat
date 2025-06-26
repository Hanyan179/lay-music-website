@echo off
chcp 65001
echo ==============================================
echo 🚀 启动LAY张艺兴音乐网站完整服务
echo ==============================================

echo.
echo 📊 检查服务状态...
netstat -ano | findstr ":8082" >nul
if %errorlevel%==0 (
    echo ❌ 端口8082已被占用，请先关闭相关进程
    pause
    exit /b 1
)

netstat -ano | findstr ":8083" >nul
if %errorlevel%==0 (
    echo ❌ 端口8083已被占用，请先关闭相关进程
    pause
    exit /b 1
)

netstat -ano | findstr ":3004" >nul
if %errorlevel%==0 (
    echo ❌ 端口3004已被占用，请先关闭相关进程
    pause
    exit /b 1
)

echo ✅ 所有端口可用

echo.
echo 🔧 启动后端API服务 (端口8082)...
start "LAY音乐API服务" cmd /k "node data-api-backend.cjs"

echo.
echo ⏳ 等待后端服务启动...
timeout /t 3 /nobreak >nul

echo.
echo 🎨 启动若依管理前端 (端口8083)...
start "若依管理系统" cmd /k "cd ruoyi-admin-system\ruoyi-ui && npm run dev"

echo.
echo ⏳ 等待若依前端启动...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 启动展示前端 (端口3004)...
start "展示前端" cmd /k "npm run dev"

echo.
echo ⏳ 等待展示前端启动...
timeout /t 3 /nobreak >nul

echo.
echo ==============================================
echo 🎉 所有服务启动完成！
echo ==============================================
echo.
echo 🔗 访问地址:
echo   📱 展示前端: http://localhost:3004/
echo   🧪 API验证: http://localhost:3004/verify-api-simple.html
echo   🏢 若依管理: http://localhost:8083/
echo   🔌 API服务: http://localhost:8082/
echo.
echo 👤 管理员账号:
echo   用户名: admin
echo   密码: LayMusic@2025
echo.
echo ⚠️ 关闭此窗口将不会关闭其他服务窗口
echo ⚠️ 请手动关闭各个服务窗口来停止服务
echo.
pause 