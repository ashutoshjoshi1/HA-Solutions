@echo off
REM Script to stop and restart Nginx and Waitress
REM Run this script to restart both services

echo ========================================
echo Restarting Nginx and Waitress Services
echo ========================================
echo.

REM Step 1: Stop Nginx
echo [1/4] Stopping Nginx...
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

REM Step 2: Stop Waitress
echo [2/4] Stopping Waitress...
taskkill /F /IM waitress-serve.exe 2>nul
REM Try to stop Python processes that might be Waitress (be careful - this stops all Python processes)
REM Uncomment the line below if you want to force-kill all Python processes
REM taskkill /F /IM python.exe 2>nul
echo Waitress stopped (or was not running).
echo.

REM Step 3: Start Nginx
echo [3/4] Starting Nginx...
cd /d C:\nginx
start /B nginx.exe
timeout /t 2 /nobreak >nul
tasklist | findstr nginx.exe >nul
if errorlevel 1 (
    echo ERROR: Failed to start Nginx!
    pause
    exit /b 1
) else (
    echo Nginx started successfully.
)
echo.

REM Step 4: Start Waitress
echo [4/4] Starting Waitress...
cd /d C:\Websites\HA-Solutions
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please ensure you're in the correct directory.
    pause
    exit /b 1
)

REM Activate virtual environment and start Waitress in a new window
start "Waitress Server" cmd /k "venv\Scripts\activate.bat && waitress-serve --host=127.0.0.1 --port=8000 hasolutions.wsgi:application"
timeout /t 3 /nobreak >nul
tasklist | findstr waitress-serve.exe >nul
if errorlevel 1 (
    echo WARNING: Waitress may not have started. Check the Waitress window.
) else (
    echo Waitress started successfully.
)
echo.

echo ========================================
echo Restart Complete!
echo ========================================
echo.
echo Services status:
tasklist | findstr nginx.exe >nul && echo [OK] Nginx is running || echo [FAIL] Nginx is not running
tasklist | findstr waitress-serve.exe >nul && echo [OK] Waitress is running || echo [FAIL] Waitress is not running
echo.
echo Test your site at: http://localhost
echo.
pause

