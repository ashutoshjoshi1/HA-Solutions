@echo off
REM Waitress startup script for Windows
REM This script starts the Django application using Waitress WSGI server

echo Starting HA Solutions with Waitress...
echo.

REM Change to project directory
cd /d "%~dp0.."
if not exist "manage.py" (
    echo ERROR: manage.py not found. Please ensure you're in the project root directory.
    pause
    exit /b 1
)

REM Activate virtual environment
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ERROR: Virtual environment not found. Please create it first with: python -m venv venv
    pause
    exit /b 1
)

REM Check if Waitress is installed
python -c "import waitress" 2>nul
if errorlevel 1 (
    echo ERROR: Waitress is not installed. Installing now...
    pip install waitress
)

echo.
echo Starting Waitress server on http://127.0.0.1:8000
echo Press CTRL+C to stop the server
echo.

REM Start Waitress
waitress-serve --host=127.0.0.1 --port=8000 hasolutions.wsgi:application

pause

