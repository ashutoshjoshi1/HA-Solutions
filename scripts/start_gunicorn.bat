@echo off
REM Gunicorn startup script for Windows
REM Update the path below to match your project location

cd /d "C:\Websites\HA-Solutions"
call venv\Scripts\activate
gunicorn --bind 127.0.0.1:8000 --workers 2 hasolutions.wsgi:application

pause

