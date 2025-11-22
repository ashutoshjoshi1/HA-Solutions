@echo off
REM SSL Setup Script for Windows PC
REM This script helps you set up SSL certificates using win-acme

echo ========================================
echo HA Solutions - SSL Setup Script
echo ========================================
echo.
echo This script will guide you through setting up SSL certificates
echo using win-acme (Windows ACME Simple) for Let's Encrypt.
echo.
echo Prerequisites:
echo 1. Your domain (hasolutions.us) must point to your public IP
echo 2. Port 80 must be open and accessible from the internet
echo 3. Nginx must be running and configured
echo.
pause

echo.
echo Step 1: Downloading win-acme...
echo.
echo Please download win-acme from:
echo https://www.win-acme.com/
echo.
echo Or use PowerShell to download:
echo.
echo powershell -Command "Invoke-WebRequest -Uri 'https://github.com/win-acme/win-acme/releases/latest/download/win-acme.zip' -OutFile 'win-acme.zip'"
echo.
echo Extract it to: C:\Tools\win-acme
echo.
pause

echo.
echo Step 2: Running win-acme...
echo.
echo After extracting win-acme, run:
echo.
echo cd C:\Tools\win-acme
echo wacs.exe
echo.
echo In the win-acme menu:
echo 1. Select option: N (Create certificate with advanced options)
echo 2. Select your domain: hasolutions.us (and www.hasolutions.us if prompted)
echo 3. Select validation: 2 (HTTP validation)
echo 4. Select site: Choose your Nginx site or "None" if not listed
echo 5. Select store: 2 (IIS Central Certificate Store) or 3 (PEM files)
echo    - If PEM files: Choose location (default is fine)
echo 6. Select installation: 1 (No additional installation steps needed)
echo 7. Confirm and let it run
echo.
echo The certificate will be saved to:
echo C:\ProgramData\win-acme\httpsacme-v02.api.letsencrypt.org\
echo.
pause

echo.
echo Step 3: Updating Nginx configuration...
echo.
echo 1. Open: C:\nginx\conf\nginx.conf
echo 2. Replace the server block with the content from: scripts\nginx_ssl.conf
echo 3. Update the SSL certificate paths if they differ
echo 4. Test configuration: nginx.exe -t
echo 5. Reload Nginx: nginx.exe -s reload
echo.
pause

echo.
echo Step 4: Updating Django settings...
echo.
echo Make sure DEBUG=False and SSL settings are enabled in settings.py
echo The settings are already configured for SSL!
echo.
echo Set environment variable:
echo set DEBUG=False
echo.
echo Or edit settings.py and set: DEBUG = False
echo.
pause

echo.
echo Step 5: Restart services...
echo.
echo Restart Waitress and Nginx services:
echo net stop HA-Solutions-Waitress
echo net start HA-Solutions-Waitress
echo.
echo nginx.exe -s reload
echo.
echo ========================================
echo SSL Setup Complete!
echo ========================================
echo.
echo Test your site: https://hasolutions.us
echo.
echo Note: win-acme will automatically renew certificates.
echo Make sure the renewal task is scheduled in Windows Task Scheduler.
echo.
pause

