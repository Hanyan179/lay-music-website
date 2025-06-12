@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 拉取代码脚本 - 批处理版本
:: 作者: Hansen
:: 功能: 从远程仓库拉取最新代码

echo ======================================
echo         拉取最新代码脚本
echo ======================================
echo.

:: 显示当前目录
echo 当前目录: %CD%
echo.

:: 检查是否为git仓库
if not exist ".git" (
    echo [错误] 当前目录不是一个Git仓库!
    echo [提示] 请确保在项目根目录下运行此脚本。
    pause
    exit /b 1
)

echo [信息] 检查Git仓库状态...

:: 显示当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo [信息] 当前分支: %CURRENT_BRANCH%

:: 显示远程仓库信息
echo.
echo [信息] 远程仓库信息:
git remote -v

:: 检查本地是否有未提交的更改
echo.
echo [信息] 检查本地更改...
git status --porcelain > temp_status.txt

:: 检查文件是否为空
for %%F in (temp_status.txt) do set FILE_SIZE=%%~zF
if %FILE_SIZE% gtr 0 (
    echo.
    echo [警告] 发现未提交的本地更改:
    git status --short
    echo.
    set /p CHOICE="是否要暂存这些更改并继续拉取? (y/N): "
    
    if /i "!CHOICE!"=="y" (
        echo [信息] 暂存本地更改...
        for /f "tokens=2 delims= " %%i in ('date /t') do set CURRENT_DATE=%%i
        for /f "tokens=1 delims= " %%i in ('time /t') do set CURRENT_TIME=%%i
        git stash push -m "自动暂存 - !CURRENT_DATE! !CURRENT_TIME!"
        set STASHED=1
    ) else (
        echo [错误] 取消拉取操作。请先处理本地更改。
        del temp_status.txt
        pause
        exit /b 1
    )
)

del temp_status.txt

:: 从远程仓库拉取最新代码
echo.
echo [信息] 正在从远程仓库拉取最新代码...
echo [命令] git pull origin %CURRENT_BRANCH%

git pull origin %CURRENT_BRANCH%

if %ERRORLEVEL% equ 0 (
    echo.
    echo [成功] ✅ 代码拉取成功!
    
    :: 如果之前暂存了更改，询问是否恢复
    if defined STASHED (
        echo.
        set /p RESTORE_CHOICE="是否要恢复之前暂存的更改? (y/N): "
        if /i "!RESTORE_CHOICE!"=="y" (
            echo [信息] 恢复暂存的更改...
            git stash pop
        )
    )
    
    :: 显示最新的几个提交
    echo.
    echo [信息] 最近的提交记录:
    git log --oneline -5
    
) else (
    echo.
    echo [失败] ❌ 代码拉取失败!
    echo [提示] 请检查网络连接或解决冲突后重试。
)

echo.
echo ======================================
echo           脚本执行完成
echo ======================================
pause 