# Quick Windows PC Deployment

## 🚀 Fast Setup Checklist

### 1. Install Software
- [ ] Python 3.11+ (check "Add to PATH")
- [ ] Git for Windows
- [ ] PostgreSQL (optional, SQLite works too)
- [ ] Nginx for Windows
- [ ] NSSM (for Windows services)

### 2. Set Up Project

```cmd
cd C:\
mkdir Websites
cd Websites
git clone https://github.com/ashutoshjoshi1/HA-Solutions.git
cd HA-Solutions
git checkout Production-PC
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install gunicorn
```

### 3. Configure Settings

Edit `hasolutions\settings.py`:
- Set `DEBUG = False`
- Update `ALLOWED_HOSTS` with your domain and IPs

### 4. Run Migrations

```cmd
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### 5. Test Locally

```cmd
python manage.py runserver
```

Visit `http://localhost:8000` - should work!

### 6. Set Up Gunicorn

Create `start_gunicorn.bat`:
```batch
@echo off
cd /d "C:\Websites\HA-Solutions"
call venv\Scripts\activate
gunicorn --bind 127.0.0.1:8000 --workers 2 hasolutions.wsgi:application
```

Test it works.

### 7. Configure Nginx

Edit `C:\nginx\conf\nginx.conf` - replace server block with config from full guide.

Test: `nginx.exe -t`
Start: `nginx.exe`

### 8. Create Windows Services

```cmd
# Install NSSM first, then:
nssm install HA-Solutions-Gunicorn
# Set path: C:\Websites\HA-Solutions\venv\Scripts\python.exe
# Set args: -m gunicorn --bind 127.0.0.1:8000 --workers 2 hasolutions.wsgi:application

nssm install HA-Solutions-Nginx
# Set path: C:\nginx\nginx.exe

# Start services
net start HA-Solutions-Gunicorn
net start HA-Solutions-Nginx
```

### 9. Configure Firewall

- Windows Firewall → Advanced Settings
- Allow port 80 (and 443 if using SSL)

### 10. Router Port Forwarding

- Access router (usually 192.168.1.1)
- Forward port 80 to your PC's local IP
- Find local IP: `ipconfig` in CMD

### 11. Set Up Dynamic DNS

- Sign up at [duckdns.org](https://duckdns.org) (free)
- Create hostname: `hasolutions.duckdns.org`
- Install updater to keep IP current

### 12. Configure GoDaddy DNS

- Add CNAME: `@` → `hasolutions.duckdns.org`
- Add CNAME: `www` → `hasolutions.duckdns.org`
- Wait 5-30 minutes

### 13. Prevent PC Sleep

- Power Options → Never sleep
- Set services to Automatic startup

### 14. Test!

Visit `http://hasolutions.us` (or your dynamic DNS hostname)

## 📋 Quick Commands

```cmd
# Check services
services.msc

# Restart services
net restart HA-Solutions-Gunicorn
net restart HA-Solutions-Nginx

# View Nginx logs
type C:\nginx\logs\error.log

# Update site
cd C:\Websites\HA-Solutions
git pull
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
net restart HA-Solutions-Gunicorn
```

## 🆘 Common Issues

**Not accessible from internet?**
- Check firewall
- Check port forwarding
- Check ISP doesn't block port 80

**Services not starting?**
- Check Event Viewer
- Run manually to see errors
- Verify paths in NSSM

**IP changed?**
- Update Dynamic DNS
- Or update GoDaddy DNS

For detailed instructions, see `DEPLOY_WINDOWS_PC.md`

