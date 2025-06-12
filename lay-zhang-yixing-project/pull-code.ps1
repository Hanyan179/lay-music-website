# 拉取代码脚本 - PowerShell版本
# 作者: Hansen
# 功能: 从远程仓库拉取最新代码

Write-Host "======================================"
Write-Host "        拉取最新代码脚本"
Write-Host "======================================"
Write-Host ""

# 获取当前目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir"
Write-Host ""

# 检查是否为git仓库
if (-Not (Test-Path ".git")) {
    Write-Host "错误: 当前目录不是一个Git仓库!" -ForegroundColor Red
    Write-Host "请确保在项目根目录下运行此脚本。" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "检查Git仓库状态..." -ForegroundColor Green

# 显示当前分支
$currentBranch = git branch --show-current
Write-Host "当前分支: $currentBranch" -ForegroundColor Cyan

# 显示远程仓库信息
Write-Host ""
Write-Host "远程仓库信息:" -ForegroundColor Green
git remote -v

# 检查本地是否有未提交的更改
Write-Host ""
Write-Host "检查本地更改..." -ForegroundColor Green
$status = git status --porcelain

if ($status) {
    Write-Host ""
    Write-Host "警告: 发现未提交的本地更改:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $choice = Read-Host "是否要暂存这些更改并继续拉取? (y/N)"
    
    if ($choice -eq "y" -or $choice -eq "Y") {
        Write-Host "暂存本地更改..." -ForegroundColor Yellow
        git stash push -m "Auto stash - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $stashed = $true
    } else {
        Write-Host "取消拉取操作。请先处理本地更改。" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
}

# 从远程仓库拉取最新代码
Write-Host ""
Write-Host "正在从远程仓库拉取最新代码..." -ForegroundColor Green
Write-Host "执行命令: git pull origin $currentBranch" -ForegroundColor Cyan

try {
    git pull origin $currentBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ 代码拉取成功!" -ForegroundColor Green
        
        # 如果之前暂存了更改，询问是否恢复
        if ($stashed) {
            Write-Host ""
            $restoreChoice = Read-Host "是否要恢复之前暂存的更改? (y/N)"
            if ($restoreChoice -eq "y" -or $restoreChoice -eq "Y") {
                Write-Host "恢复暂存的更改..." -ForegroundColor Yellow
                git stash pop
            }
        }
        
        # 显示最新的几个提交
        Write-Host ""
        Write-Host "最近的提交记录:" -ForegroundColor Green
        git log --oneline -5
        
    } else {
        Write-Host ""
        Write-Host "❌ 代码拉取失败!" -ForegroundColor Red
        Write-Host "请检查网络连接或解决冲突后重试。" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "❌ 拉取过程中发生错误: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================"
Write-Host "           脚本执行完成"
Write-Host "======================================"
Read-Host "按回车键退出" 