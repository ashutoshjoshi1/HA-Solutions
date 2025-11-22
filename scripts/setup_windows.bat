@echo off
REM Setup script for Windows PC deployment
REM This script sets up the environment and installs dependencies

echo ========================================
echo HA Solutions - Windows Setup Script
echo ========================================
echo.

REM Change to project directory
cd /d "%~dp0.."
if not exist "manage.py" (
    echo ERROR: manage.py not found. Please run this script from the scripts directory.
    pause
    exit /b 1
)

echo Step 1: Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Step 3: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 4: Installing dependencies...
pip install -r requirements.txt
echo.

echo Step 5: Running migrations...
python manage.py migrate
echo.

echo Step 6: Collecting static files...
python manage.py collectstatic --noinput
echo.

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create a superuser: python manage.py createsuperuser
echo 2. Start the server: scripts\start_waitress.bat
echo 3. Or test with dev server: python manage.py runserver
echo.
pause

