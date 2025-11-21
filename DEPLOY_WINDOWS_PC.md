# Deploy on Windows 10 PC - Complete Guide

This guide will help you host your Django website on your Windows 10 PC for FREE with no limitations!

## Prerequisites

- Windows 10 PC
- Administrator access
- Internet connection
- Router access (for port forwarding)
- GoDaddy domain: `hasolutions.us`

## Step 1: Install Required Software

### 1.1 Install Python

1. Download Python 3.11+ from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT:** Check "Add Python to PATH" during installation
3. Complete installation

### 1.2 Install Git

1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Install with default settings

### 1.3 Install PostgreSQL (Optional but Recommended)

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings
3. Remember the postgres user password you set

**OR** use SQLite (simpler, but less robust for production)

## Step 2: Set Up Your Project

### 2.1 Clone Repository

Open **Command Prompt** or **PowerShell** as Administrator:

```cmd
cd C:\
mkdir Websites
cd Websites
git clone https://github.com/ashutoshjoshi1/HA-Solutions.git
cd HA-Solutions
git checkout Production-PC
```

### 2.2 Create Virtual Environment

```cmd
python -m venv venv
venv\Scripts\activate
```

### 2.3 Install Dependencies

```cmd
pip install -r requirements.txt
pip install gunicorn
```

### 2.4 Configure Settings

Edit `hasolutions\settings.py`:

```python
# Update these settings:
DEBUG = False
ALLOWED_HOSTS = ['hasolutions.us', 'www.hasolutions.us', 'localhost', '127.0.0.1', 'YOUR_PC_LOCAL_IP', 'YOUR_PUBLIC_IP']
```

**Find your IPs:**
- Local IP: Run `ipconfig` in CMD, look for "IPv4 Address"
- Public IP: Visit [whatismyip.com](https://whatismyip.com)

### 2.5 Set Up Database

**Option A: SQLite (Simpler)**
- Already configured, just run migrations

**Option B: PostgreSQL (Recommended)**
- Create database in pgAdmin or via command line
- Update `settings.py` with database credentials

### 2.6 Run Migrations

```cmd
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## Step 3: Test Locally

```cmd
python manage.py runserver
```

Visit `http://localhost:8000` to verify it works.

## Step 4: Set Up Gunicorn

### 4.1 Create Gunicorn Service Script

Create `start_gunicorn.bat` in project root:

```batch
@echo off
cd /d "C:\Websites\HA-Solutions"
call venv\Scripts\activate
gunicorn --bind 127.0.0.1:8000 --workers 2 hasolutions.wsgi:application
pause
```

### 4.2 Test Gunicorn

```cmd
start_gunicorn.bat
```

Visit `http://localhost:8000` to verify.

## Step 5: Install Nginx for Windows

### 5.1 Download Nginx

1. Download from [nginx.org/en/download.html](http://nginx.org/en/download.html)
2. Extract to `C:\nginx`
3. Test: Open `C:\nginx\nginx.exe`
4. Visit `http://localhost` - should see Nginx welcome page

### 5.2 Configure Nginx

Edit `C:\nginx\conf\nginx.conf`:

Replace the `server` block with:

```nginx
server {
    listen 80;
    server_name hasolutions.us www.hasolutions.us;

    location /static/ {
        alias C:/Websites/HA-Solutions/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias C:/Websites/HA-Solutions/media/;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Important:** Use forward slashes `/` in paths, not backslashes!

### 5.3 Test Nginx Configuration

```cmd
cd C:\nginx
nginx.exe -t
```

Should say "syntax is ok"

### 5.4 Start Nginx

```cmd
nginx.exe
```

## Step 6: Set Up Windows Services (Auto-Start)

### 6.1 Install NSSM (Non-Sucking Service Manager)

1. Download from [nssm.cc/download](https://nssm.cc/download)
2. Extract to `C:\nssm`
3. Copy `nssm.exe` to `C:\Windows\System32` (or add to PATH)

### 6.2 Create Gunicorn Service

Open **Command Prompt as Administrator**:

```cmd
nssm install HA-Solutions-Gunicorn
```

In the GUI that opens:
- **Path:** `C:\Websites\HA-Solutions\venv\Scripts\python.exe`
- **Startup directory:** `C:\Websites\HA-Solutions`
- **Arguments:** `-m gunicorn --bind 127.0.0.1:8000 --workers 2 hasolutions.wsgi:application`

Click "Install service"

### 6.3 Create Nginx Service

```cmd
nssm install HA-Solutions-Nginx
```

- **Path:** `C:\nginx\nginx.exe`
- **Startup directory:** `C:\nginx`

Click "Install service"

### 6.4 Start Services

```cmd
net start HA-Solutions-Gunicorn
net start HA-Solutions-Nginx
```

### 6.5 Verify Services

```cmd
services.msc
```

Look for "HA-Solutions-Gunicorn" and "HA-Solutions-Nginx" - they should be running.

## Step 7: Configure Windows Firewall

1. Open **Windows Defender Firewall**
2. Click **Advanced settings**
3. Click **Inbound Rules** → **New Rule**
4. Select **Port** → **Next**
5. Select **TCP**, enter port **80** → **Next**
6. Select **Allow the connection** → **Next**
7. Check all profiles → **Next**
8. Name: "HA Solutions HTTP" → **Finish**

Repeat for port **443** (HTTPS) if you set up SSL.

## Step 8: Configure Router Port Forwarding

### 8.1 Find Your Router IP

```cmd
ipconfig
```

Look for "Default Gateway" (usually `192.168.1.1` or `192.168.0.1`)

### 8.2 Access Router

1. Open browser, go to router IP
2. Login (check router label for default username/password)

### 8.3 Set Up Port Forwarding

1. Find "Port Forwarding" or "Virtual Server" section
2. Add rule:
   - **Service Name:** HA Solutions
   - **External Port:** 80
   - **Internal Port:** 80
   - **Internal IP:** Your PC's local IP (from `ipconfig`)
   - **Protocol:** TCP
   - **Enable:** Yes

3. Save and apply

### 8.4 Find Your Public IP

Visit [whatismyip.com](https://whatismyip.com) - this is what you'll use for DNS.

## Step 9: Set Up Dynamic DNS (Important!)

Your home IP changes. Use Dynamic DNS to keep your domain updated.

### Option A: DuckDNS (Free, Recommended)

1. Sign up at [duckdns.org](https://www.duckdns.org)
2. Create domain: `hasolutions.duckdns.org`
3. Download DuckDNS Windows updater
4. Set it to update every 5 minutes

### Option B: No-IP (Free)

1. Sign up at [noip.com](https://www.noip.com)
2. Create hostname
3. Install No-IP DUC (Dynamic Update Client)

### Option C: Manual Update

- Check your IP regularly
- Update GoDaddy DNS when it changes

## Step 10: Configure GoDaddy DNS

### 10.1 If Using Dynamic DNS

1. Log into GoDaddy
2. DNS Management for `hasolutions.us`
3. Add CNAME record:
   - **Name:** `@`
   - **Value:** `hasolutions.duckdns.org` (or your dynamic DNS hostname)
   - **TTL:** 600

4. Add CNAME for www:
   - **Name:** `www`
   - **Value:** `hasolutions.duckdns.org`
   - **TTL:** 600

### 10.2 If Using Static IP

1. Log into GoDaddy
2. DNS Management for `hasolutions.us`
3. Add A record:
   - **Name:** `@`
   - **Value:** `YOUR_PUBLIC_IP`
   - **TTL:** 600

4. Add A record for www:
   - **Name:** `www`
   - **Value:** `YOUR_PUBLIC_IP`
   - **TTL:** 600

Wait 5-30 minutes for DNS propagation.

## Step 11: Set Up SSL Certificate (Optional but Recommended)

### 11.1 Install Certbot for Windows

1. Download from [certbot.eff.org](https://certbot.eff.org/)
2. Or use Cloudflare (easier):
   - Point domain to Cloudflare
   - Enable SSL/TLS (Flexible or Full)
   - Cloudflare handles SSL

### 11.2 Or Use Cloudflare (Easier)

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Change nameservers in GoDaddy to Cloudflare's
4. Enable SSL/TLS in Cloudflare dashboard

## Step 12: Configure PC to Never Sleep

1. Open **Power Options**
2. Click **Change plan settings**
3. Set "Put computer to sleep" to **Never**
4. Set "Turn off display" to your preference
5. Click **Save changes**

## Step 13: Test Your Site

1. Visit `http://hasolutions.us` (or your dynamic DNS hostname)
2. Test all features:
   - Home page
   - Contact form
   - Job applications
   - Recruiter portal

## Step 14: Set Up Automatic Startup

Services should already auto-start, but verify:

1. Open `services.msc`
2. Find "HA-Solutions-Gunicorn"
3. Right-click → **Properties**
4. Set **Startup type** to **Automatic**
5. Repeat for "HA-Solutions-Nginx"

## Monitoring & Maintenance

### Check Services Status

```cmd
services.msc
```

### View Logs

**Gunicorn logs:**
- Check `C:\Websites\HA-Solutions\` for log files
- Or view in Event Viewer

**Nginx logs:**
- `C:\nginx\logs\access.log`
- `C:\nginx\logs\error.log`

### Restart Services

```cmd
net stop HA-Solutions-Gunicorn
net start HA-Solutions-Gunicorn

net stop HA-Solutions-Nginx
net start HA-Solutions-Nginx
```

### Update Your Site

```cmd
cd C:\Websites\HA-Solutions
git pull origin Production-PC
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
net restart HA-Solutions-Gunicorn
```

## Troubleshooting

### Website not accessible from internet?
- Check Windows Firewall allows port 80
- Verify router port forwarding is set up
- Check if ISP blocks port 80 (some do)
- Test locally first: `http://localhost`

### Services not starting?
- Check logs in Event Viewer
- Verify paths in NSSM are correct
- Run services manually to see errors

### IP address changed?
- Update Dynamic DNS
- Or update GoDaddy DNS manually

### Can't access router?
- Check router label for default IP
- Try common IPs: 192.168.1.1, 192.168.0.1, 10.0.0.1

### ISP blocks port 80?
- Use alternative port (8080, 8443)
- Update router port forwarding
- Update Nginx to listen on new port
- Or use Cloudflare (they handle this)

## Security Considerations

1. **Keep Windows updated**
2. **Use strong passwords**
3. **Enable Windows Firewall**
4. **Consider using Cloudflare** for DDoS protection
5. **Regular backups** of database and files
6. **Monitor logs** for suspicious activity

## Backup Strategy

### Database Backup

Create `backup.bat`:

```batch
@echo off
set BACKUP_DIR=C:\Backups\HA-Solutions
mkdir %BACKUP_DIR% 2>nul
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%
cd C:\Websites\HA-Solutions
venv\Scripts\activate
python manage.py dumpdata > %BACKUP_DIR%\backup_%DATE%.json
```

Schedule in Task Scheduler to run daily.

## Next Steps

1. Follow all steps above
2. Test your site thoroughly
3. Set up monitoring/alerting
4. Configure backups
5. Enjoy your free, always-on website! 🎉

## Advantages of Self-Hosting

- ✅ Completely FREE
- ✅ Always-on (no spin-down)
- ✅ Full control
- ✅ No limitations
- ✅ Learn valuable skills

## Disadvantages

- ⚠️ PC must stay on 24/7
- ⚠️ Dynamic IP requires Dynamic DNS
- ⚠️ More maintenance required
- ⚠️ Less reliable than cloud hosting
- ⚠️ Security is your responsibility

