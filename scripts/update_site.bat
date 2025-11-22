@echo off
REM Update script for Windows PC deployment
REM This script pulls latest code and updates dependencies

echo ========================================
echo HA Solutions - Update Script
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0.."
if not exist "manage.py" (
    echo ERROR: manage.py not found. Please run this script from the scripts directory.
    pause
    exit /b 1
)

echo Step 1: Pulling latest code from Production-PC branch...
git pull origin Production-PC
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Step 3: Installing/updating dependencies...
pip install -r requirements.txt
echo.

echo Step 4: Running migrations...
python manage.py migrate
echo.

echo Step 5: Collecting static files...
python manage.py collectstatic --noinput
echo.

echo ========================================
echo Update complete!
echo ========================================
echo.
echo Please restart Waitress service if running as a service.
echo Or restart the server manually: scripts\start_waitress.bat
echo.
pause

