@echo off
cd /d "%~dp0"
echo "正在启动LAY张艺兴音乐后台管理系统..."

:: 检查是否有mvnd命令
where mvnd >nul 2>nul
if %errorlevel% == 0 (
    echo "使用Maven Daemon启动..."
    echo "清理并编译项目..."
    mvnd clean compile
    echo "启动Spring Boot应用..."
    mvnd spring-boot:run
) else (
    where mvn >nul 2>nul
    if %errorlevel% == 0 (
        echo "使用标准Maven启动..."
        echo "清理并编译项目..."
        mvn clean compile
        echo "启动Spring Boot应用..."
        mvn spring-boot:run
    ) else (
        echo "错误：未找到Maven命令！请确保Maven已正确安装并配置环境变量。"
        pause
        exit /b 1
    )
)
pause 