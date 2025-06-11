# PowerShell脚本：终止3004端口占用的进程
Write-Host "🔍 查找占用3004端口的进程..." -ForegroundColor Yellow

# 查找占用3004端口的进程
$processes = Get-NetTCPConnection -LocalPort 3004 -ErrorAction SilentlyContinue | Select-Object OwningProcess -Unique

if ($processes.Count -eq 0) {
    Write-Host "✅ 端口3004未被占用，可以正常启动" -ForegroundColor Green
    exit 0
}

foreach ($proc in $processes) {
    $processId = $proc.OwningProcess
    try {
        $processInfo = Get-Process -Id $processId -ErrorAction Stop
        Write-Host "🔴 发现占用进程: PID $processId - $($processInfo.ProcessName)" -ForegroundColor Red
        
        # 强制终止进程
        Stop-Process -Id $processId -Force
        Write-Host "✅ 已成功终止进程 $processId" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ 无法终止进程 $processId : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "⏳ 等待端口释放..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host "🚀 端口已清理完成，可以启动项目了！" -ForegroundColor Green 