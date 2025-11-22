@echo off
REM SSL Certificate Renewal Script
REM This script manually renews SSL certificates using win-acme

echo ========================================
echo HA Solutions - SSL Certificate Renewal
echo ========================================
echo.

REM Check if win-acme exists
if not exist "C:\Tools\win-acme\wacs.exe" (
    echo ERROR: win-acme not found at C:\Tools\win-acme\wacs.exe
    echo Please install win-acme first using setup_ssl.bat
    pause
    exit /b 1
)

echo Renewing SSL certificates...
echo.

cd /d C:\Tools\win-acme
wacs.exe --renew

echo.
echo ========================================
echo Renewal Complete!
echo ========================================
echo.
echo If certificates were renewed, reload Nginx:
echo nginx.exe -s reload
echo.
pause

