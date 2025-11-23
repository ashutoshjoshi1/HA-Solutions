@echo off
REM Script to start Nginx and Waitress services

echo ========================================
echo Starting Nginx and Waitress Services
echo ========================================
echo.

REM Start Nginx
echo Starting Nginx...
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

REM Start Waitress
echo Starting Waitress...
cd /d C:\Websites\HA-Solutions
if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    pause
    exit /b 1
)

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
echo Services Started!
echo ========================================
echo.
echo Services status:
tasklist | findstr nginx.exe >nul && echo [OK] Nginx is running || echo [FAIL] Nginx is not running
tasklist | findstr waitress-serve.exe >nul && echo [OK] Waitress is running || echo [FAIL] Waitress is not running
echo.
pause

