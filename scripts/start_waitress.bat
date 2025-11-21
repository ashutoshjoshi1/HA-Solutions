@echo off
REM Waitress startup script for Windows
REM Update the path below to match your project location

cd /d "C:\Websites\HA-Solutions"
call venv\Scripts\activate
waitress-serve --host=127.0.0.1 --port=8000 hasolutions.wsgi:application

pause

