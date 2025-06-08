# LAY张艺兴音乐网站 - 系统启动脚本 (PowerShell 5.1兼容)
# ====================================================

param(
    [switch]$SkipBuild,
    [switch]$BackgroundMode
)

Write-Host "🎵 LAY张艺兴音乐网站系统启动脚本" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# 检查PowerShell版本
$psVersion = $PSVersionTable.PSVersion
Write-Host "📋 PowerShell版本: $($psVersion.Major).$($psVersion.Minor)" -ForegroundColor Yellow
if ($psVersion.Major -lt 7) {
    Write-Host "⚠️  您使用的是PowerShell $($psVersion.Major).$($psVersion.Minor)，不支持&&语法" -ForegroundColor Yellow
    Write-Host "   本脚本已适配您的PowerShell版本" -ForegroundColor Green
}

# 步骤1: 检查端口占用
Write-Host "`n🔍 步骤1: 检查端口状态..." -ForegroundColor Green
$port8080 = netstat -an | Select-String ":8080.*LISTENING"
if ($port8080) {
    Write-Host "   ✅ 8080端口已在监听中" -ForegroundColor Green
    Write-Host "   $port8080" -ForegroundColor Gray
} else {
    Write-Host "   ❌ 8080端口未监听" -ForegroundColor Red
}

# 步骤2: 检查Java进程
Write-Host "`n🔍 步骤2: 检查Java进程..." -ForegroundColor Green
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "   ✅ 发现 $($javaProcesses.Count) 个Java进程" -ForegroundColor Green
    foreach ($proc in $javaProcesses) {
        Write-Host "   - PID: $($proc.Id), 内存: $([math]::Round($proc.WorkingSet64/1MB, 2))MB" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ 未发现Java进程" -ForegroundColor Red
}

# 步骤3: 构建前端项目（可选）
if (-not $SkipBuild) {
    Write-Host "`n🏗️  步骤3: 构建前端项目..." -ForegroundColor Green
    if (Test-Path "package.json") {
        Write-Host "   正在构建前端项目..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ 前端构建成功" -ForegroundColor Green
            
            # 复制到后端静态资源目录
            Write-Host "   正在复制静态资源..." -ForegroundColor Yellow
            if (Test-Path "dist") {
                Copy-Item -Path "dist/*" -Destination "backend/src/main/resources/static/" -Recurse -Force
                Write-Host "   ✅ 静态资源复制成功" -ForegroundColor Green
            }
        } else {
            Write-Host "   ❌ 前端构建失败" -ForegroundColor Red
        }
    } else {
        Write-Host "   ⚠️  未找到package.json，跳过前端构建" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⏭️  步骤3: 跳过前端构建 (使用 -SkipBuild 参数)" -ForegroundColor Yellow
}

# 步骤4: 编译后端项目
Write-Host "`n🏗️  步骤4: 编译后端项目..." -ForegroundColor Green
if (Test-Path "backend/pom.xml") {
    Set-Location "backend"
    Write-Host "   正在编译后端项目..." -ForegroundColor Yellow
    
    # 使用mvnd或mvn
    $mvnCommand = "mvnd"
    if (-not (Get-Command "mvnd" -ErrorAction SilentlyContinue)) {
        $mvnCommand = "mvn"
        if (-not (Get-Command "mvn" -ErrorAction SilentlyContinue)) {
            Write-Host "   ❌ 未找到Maven命令 (mvn 或 mvnd)" -ForegroundColor Red
            Set-Location ".."
            exit 1
        }
    }
    
    & $mvnCommand clean package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ 后端编译成功" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 后端编译失败" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    Set-Location ".."
} else {
    Write-Host "   ❌ 未找到backend/pom.xml" -ForegroundColor Red
    exit 1
}

# 步骤5: 启动后端服务
Write-Host "`n🚀 步骤5: 启动后端服务..." -ForegroundColor Green
$jarFile = "backend/target/music-admin-1.0.0.jar"
if (Test-Path $jarFile) {
    # 停止现有Java进程
    $existingJava = Get-Process -Name "java" -ErrorAction SilentlyContinue
    if ($existingJava) {
        Write-Host "   正在停止现有Java进程..." -ForegroundColor Yellow
        Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    
    if ($BackgroundMode) {
        Write-Host "   正在后台启动Java应用..." -ForegroundColor Yellow
        Start-Process -FilePath "java" -ArgumentList "-jar", $jarFile -WindowStyle Hidden
        Start-Sleep -Seconds 10
    } else {
        Write-Host "   正在前台启动Java应用..." -ForegroundColor Yellow
        Write-Host "   📝 注意: 这将占用当前终端，请在新窗口中运行其他命令" -ForegroundColor Cyan
        Write-Host "   📝 要停止服务，请按 Ctrl+C" -ForegroundColor Cyan
        Start-Sleep -Seconds 2
        java -jar $jarFile
    }
} else {
    Write-Host "   ❌ 未找到JAR文件: $jarFile" -ForegroundColor Red
    exit 1
}

# 步骤6: 验证服务状态
if ($BackgroundMode) {
    Write-Host "`n🔍 步骤6: 验证服务状态..." -ForegroundColor Green
    Start-Sleep -Seconds 5
    
    $port8080After = netstat -an | Select-String ":8080.*LISTENING"
    if ($port8080After) {
        Write-Host "   ✅ 后端服务启动成功！" -ForegroundColor Green
        Write-Host "   $port8080After" -ForegroundColor Gray
        
        # 显示访问地址
        Write-Host "`n🌐 访问地址:" -ForegroundColor Cyan
        Write-Host "   🏠 首页:     http://localhost:8080/" -ForegroundColor White
        Write-Host "   🔒 后台:     http://localhost:8080/x-back" -ForegroundColor White
        Write-Host "   🧪 API测试:  http://localhost:8080/test-login-api.html" -ForegroundColor White
        Write-Host "   📡 API文档:  http://localhost:8080/api" -ForegroundColor White
        
        Write-Host "`n🔑 管理员账号:" -ForegroundColor Cyan
        Write-Host "   用户名: admin" -ForegroundColor White
        Write-Host "   密码:   LayMusic@2025" -ForegroundColor White
        
        Write-Host "`n💾 数据库信息:" -ForegroundColor Cyan
        Write-Host "   类型:   MySQL" -ForegroundColor White
        Write-Host "   数据库: lay_music" -ForegroundColor White
        Write-Host "   用户:   root" -ForegroundColor White
        
    } else {
        Write-Host "   ❌ 后端服务启动失败" -ForegroundColor Red
    }
}

Write-Host "`n🎉 系统启动脚本执行完成！" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan

# 使用说明
Write-Host "`n📖 使用说明:" -ForegroundColor Cyan
Write-Host "   .\start-system.ps1                 # 完整启动（前台）" -ForegroundColor White
Write-Host "   .\start-system.ps1 -BackgroundMode # 完整启动（后台）" -ForegroundColor White
Write-Host "   .\start-system.ps1 -SkipBuild      # 跳过构建，直接启动" -ForegroundColor White 