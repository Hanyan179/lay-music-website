@echo off
echo.
echo ========================================
echo   LAY张艺兴音乐网站 - 后端启动脚本
echo ========================================
echo.

cd /d "%~dp0backend"

echo 正在检查后端jar文件...
if not exist "target\music-admin-1.0.0.jar" (
    echo 后端jar文件不存在，正在编译...
    echo.
    mvnd clean package -DskipTests
    if errorlevel 1 (
        echo 编译失败！请检查错误信息。
        pause
        exit /b 1
    )
    echo 编译完成！
    echo.
)

echo 正在启动后端服务...
echo 后端地址: http://localhost:8080
echo 管理后台: http://localhost:8080/x-back
echo API文档: http://localhost:8080/api
echo.
echo 按 Ctrl+C 停止服务
echo.

java -jar target\music-admin-1.0.0.jar

pause 