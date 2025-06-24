# LAY音乐网站 - 启动脚本（带端口检查）
Write-Host "🎵 LAY张艺兴音乐网站启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查并关闭端口占用的函数
function Close-PortIfOccupied {
    param($port)
    
    Write-Host "🔍 检查端口 $port..." -ForegroundColor Yellow
    $processes = netstat -ano | Select-String ":$port.*LISTENING"
    
    if ($processes) {
        Write-Host "⚠️  端口 $port 被占用" -ForegroundColor Red
        foreach ($line in $processes) {
            $parts = $line -split '\s+'
            $processId = $parts[-1]
            if ($processId -ne "0") {
                Write-Host "   正在关闭进程 PID: $processId" -ForegroundColor Yellow
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "   ✅ 成功关闭进程 $processId" -ForegroundColor Green
                } catch {
                    Write-Host "   ❌ 关闭进程失败: $_" -ForegroundColor Red
                }
            }
        }
        Start-Sleep -Seconds 2
    } else {
        Write-Host "   ✅ 端口 $port 可用" -ForegroundColor Green
    }
}

# 步骤1: 检查并关闭占用的端口
Write-Host "`n📋 步骤1: 检查端口占用情况..." -ForegroundColor Green
Close-PortIfOccupied -port 3004
Close-PortIfOccupied -port 8080

# 步骤2: 启动前端开发服务器
Write-Host "`n🚀 步骤2: 启动前端开发服务器..." -ForegroundColor Green
Write-Host "   端口: 3004" -ForegroundColor Gray
Write-Host "   启动中..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev; pause" -WindowStyle Normal

# 等待前端启动
Start-Sleep -Seconds 3

Write-Host "`n✅ 前端开发服务器启动完成！" -ForegroundColor Green
Write-Host "`n🌐 访问地址:" -ForegroundColor Cyan
Write-Host "   前端: http://localhost:3004" -ForegroundColor White

Write-Host "`n💡 提示:" -ForegroundColor Cyan
Write-Host "   - 前端服务器已在新窗口中启动" -ForegroundColor White
Write-Host "   - 如需启动后端，请运行: .\start-backend.bat" -ForegroundColor White
Write-Host "   - 按任意键退出..." -ForegroundColor White

Read-Host 