@echo off
echo ========================================
echo  Cloudflare Worker 部署脚本
echo  小米 Mimo API 代理
echo ========================================
echo.

echo [1/4] 检查 Wrangler 是否安装...
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Wrangler，请先安装：
    echo    npm install -g wrangler
    echo.
    pause
    exit /b 1
)
echo ✅ Wrangler 已安装
echo.

echo [2/4] 检查登录状态...
wrangler whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未登录 Cloudflare
    echo    请运行: wrangler login
    echo.
    pause
    exit /b 1
)
echo ✅ 已登录 Cloudflare
echo.

echo [3/4] 部署 Worker...
echo 正在部署到 Cloudflare...
wrangler deploy
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] 获取 Worker URL...
for /f "tokens=*" %%i in ('wrangler deploy 2^>^&1 ^| findstr "https://"') do (
    set WORKER_URL=%%i
)

echo.
echo ========================================
echo  ✅ 部署成功！
echo ========================================
echo.
echo 你的 Worker URL:
echo %WORKER_URL%
echo.
echo 请在 Mark2Web 设置中使用此 URL 作为 Proxy URL
echo.
echo ========================================
echo.
pause
