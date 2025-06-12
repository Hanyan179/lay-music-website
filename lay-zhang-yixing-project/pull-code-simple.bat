@echo off
chcp 65001 >nul
cls

echo ==========================================
echo          Lay Music Website
echo          Code Pull Script
echo ==========================================
echo.

echo Current Directory: %CD%
echo.

if not exist ".git" (
    echo [ERROR] Not a Git repository!
    echo [INFO] Please run this script in the project root directory.
    pause
    exit /b 1
)

echo [INFO] Checking Git status...
for /f "tokens=*" %%i in ('git branch --show-current') do set BRANCH=%%i
echo [INFO] Current branch: %BRANCH%
echo.

echo [INFO] Remote repository info:
git remote -v
echo.

echo [INFO] Pulling latest code from origin/%BRANCH%...
git pull origin %BRANCH%

if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] Code pull completed successfully!
    echo.
    echo [INFO] Recent commits:
    git log --oneline -3
) else (
    echo.
    echo [FAILED] Failed to pull code!
    echo [INFO] Please check network connection or resolve conflicts.
)

echo.
echo ==========================================
echo           Script Completed
echo ==========================================
pause 