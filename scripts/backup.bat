@echo off
REM Database backup script for Windows
REM Update paths below to match your setup

set BACKUP_DIR=C:\Backups\HA-Solutions
mkdir %BACKUP_DIR% 2>nul

REM Get date in YYYYMMDD format
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set DATE=%datetime:~0,8%

cd C:\Websites\HA-Solutions
call venv\Scripts\activate

REM Backup database (SQLite)
if exist db.sqlite3 (
    copy db.sqlite3 %BACKUP_DIR%\db_backup_%DATE%.sqlite3
    echo Database backed up to %BACKUP_DIR%\db_backup_%DATE%.sqlite3
)

REM Backup media files (if any)
if exist media (
    xcopy /E /I /Y media %BACKUP_DIR%\media_%DATE%\
    echo Media files backed up
)

REM Clean up old backups (keep last 7 days)
forfiles /p %BACKUP_DIR% /m db_backup_*.sqlite3 /d -7 /c "cmd /c del @path"
forfiles /p %BACKUP_DIR% /m media_* /d -7 /c "cmd /c rd /s /q @path"

echo Backup completed!

pause

