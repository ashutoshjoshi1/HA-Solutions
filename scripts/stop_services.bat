@echo off
REM Script to stop Nginx and Waitress services

echo ========================================
echo Stopping Nginx and Waitress Services
echo ========================================
echo.

REM Stop Nginx
echo Stopping Nginx...
cd /d C:\nginx
nginx.exe -s quit 2>nul
timeout /t 2 /nobreak >nul
taskkill /F /IM nginx.exe 2>nul
if errorlevel 1 (
    echo Nginx was not running.
) else (
    echo Nginx stopped.
)
echo.

REM Stop Waitress
echo Stopping Waitress...
taskkill /F /IM waitress-serve.exe 2>nul
REM Try to stop Python processes that might be Waitress (be careful - this stops all Python processes)
REM Uncomment the line below if you want to force-kill all Python processes
REM taskkill /F /IM python.exe 2>nul
echo Waitress stopped (or was not running).
echo.

echo ========================================
echo All services stopped.
echo ========================================
pause

