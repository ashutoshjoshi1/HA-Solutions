# SSL Setup Guide for Windows PC

This guide will help you set up free SSL certificates using Let's Encrypt on your Windows PC.

## Prerequisites

1. ✅ Your domain (`hasolutions.us`) must point to your public IP address
2. ✅ Port 80 must be open and accessible from the internet
3. ✅ Nginx must be running and configured
4. ✅ Your site must be accessible via HTTP before setting up SSL

## Step 1: Download and Install win-acme

**win-acme** (Windows ACME Simple) is a free tool that automates Let's Encrypt certificate management on Windows.

### Download:

1. Visit: https://www.win-acme.com/
2. Download the latest release (win-acme.zip)
3. Extract to: `C:\Tools\win-acme`

Or use PowerShell:

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path C:\Tools

# Download win-acme
Invoke-WebRequest -Uri "https://github.com/win-acme/win-acme/releases/latest/download/win-acme.zip" -OutFile "C:\Tools\win-acme.zip"

# Extract
Expand-Archive -Path "C:\Tools\win-acme.zip" -DestinationPath "C:\Tools\win-acme" -Force
```

## Step 2: Run win-acme

1. Open Command Prompt or PowerShell **as Administrator**
2. Navigate to win-acme directory:
   ```cmd
   cd C:\Tools\win-acme
   ```
3. Run win-acme:
   ```cmd
   wacs.exe
   ```

## Step 3: Create Certificate

Follow the interactive menu:

1. **Select option**: Type `N` (Create certificate with advanced options)
2. **Select host(s)**: 
   - Enter: `hasolutions.us,www.hasolutions.us`
   - Or just: `hasolutions.us` (you can add www later)
3. **Select validation**: Type `2` (HTTP validation)
4. **Select site**: 
   - If Nginx is listed, select it
   - Otherwise, select "None" (we'll configure Nginx manually)
5. **Select store**: Type `3` (PEM files)
   - Location: Default is fine (`C:\ProgramData\win-acme\...`)
6. **Select installation**: Type `1` (No additional installation steps)
7. **Confirm**: Type `Y` to proceed

win-acme will:
- Validate your domain ownership
- Download the certificate
- Save it to `C:\ProgramData\win-acme\httpsacme-v02.api.letsencrypt.org\`

## Step 4: Update Nginx Configuration

1. Open `C:\nginx\conf\nginx.conf` in a text editor
2. Replace your existing `server` block with the content from `scripts\nginx_ssl.conf`
3. **Important**: Update the SSL certificate paths if they differ:
   ```nginx
   ssl_certificate C:/ProgramData/win-acme/httpsacme-v02.api.letsencrypt.org/hasolutions.us-chain.pem;
   ssl_certificate_key C:/ProgramData/win-acme/httpsacme-v02.api.letsencrypt.org/hasolutions.us-key.pem;
   ```
4. Test the configuration:
   ```cmd
   cd C:\nginx
   nginx.exe -t
   ```
5. If test passes, reload Nginx:
   ```cmd
   nginx.exe -s reload
   ```

## Step 5: Update Django Settings

1. Set `DEBUG = False` in `hasolutions/settings.py`:
   ```python
   DEBUG = False
   ```
   
   Or set environment variable:
   ```cmd
   set DEBUG=False
   ```

2. The SSL settings are already configured in `settings.py`:
   - `SECURE_SSL_REDIRECT = True`
   - `SECURE_PROXY_SSL_HEADER` (for Nginx proxy)
   - HSTS headers
   - Secure cookies

3. Restart Waitress service:
   ```cmd
   net stop HA-Solutions-Waitress
   net start HA-Solutions-Waitress
   ```

## Step 6: Test SSL

1. Visit: `https://hasolutions.us`
2. Check for the padlock icon in your browser
3. Test HTTP redirect: `http://hasolutions.us` should redirect to HTTPS

## Automatic Certificate Renewal

win-acme automatically creates a Windows Task Scheduler task to renew certificates.

To verify:
1. Open **Task Scheduler**
2. Look for task: `win-acme renewal`
3. It should run automatically before certificates expire (every 60 days)

## Troubleshooting

### Certificate validation fails

- **Check DNS**: Ensure `hasolutions.us` points to your public IP
- **Check port 80**: Must be open and accessible from internet
- **Check firewall**: Windows Firewall must allow port 80
- **Check router**: Port forwarding must be configured for port 80

### Nginx won't start after SSL config

- Check certificate paths are correct
- Verify certificate files exist
- Check Nginx error log: `C:\nginx\logs\error.log`
- Test config: `nginx.exe -t`

### Mixed content warnings

- Ensure all resources (CSS, JS, images) use HTTPS or relative URLs
- Check browser console for specific resources causing issues

### Certificate not renewing

- Check Task Scheduler for win-acme task
- Run win-acme manually: `wacs.exe --renew`
- Check win-acme logs: `C:\ProgramData\win-acme\Log\`

## Security Notes

✅ **SSL/TLS 1.2 and 1.3 only** - Modern, secure protocols
✅ **Strong cipher suites** - Only secure ciphers enabled
✅ **HSTS enabled** - Forces HTTPS for 1 year
✅ **Security headers** - X-Frame-Options, X-Content-Type-Options, etc.

## Additional Resources

- win-acme documentation: https://www.win-acme.com/manual/
- Let's Encrypt: https://letsencrypt.org/
- SSL Labs test: https://www.ssllabs.com/ssltest/ (test your SSL configuration)

