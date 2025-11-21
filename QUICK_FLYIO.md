# Quick Fly.io Deployment

## 🚀 Fast Setup (5 minutes)

### 1. Install Fly CLI

**macOS:**
```bash
brew install flyctl
# OR
curl -L https://fly.io/install.sh | sh
```

**Windows:**
Download from: https://fly.io/docs/hands-on/install-flyctl/

### 2. Login

```bash
flyctl auth login
```

### 3. Launch App

```bash
cd "/Users/hamzaadnan/Documents/Business/HA Solutions/Website/HA-Solutions"
flyctl launch
```

**Answer the prompts:**
- App name: (press Enter for auto-generated, or type your own)
- Region: Choose closest to you (e.g., `iad` for US East)
- PostgreSQL: **YES** (type `y`)
- Redis: **NO** (type `n`)

### 4. Set Secrets

```bash
# Replace <your-app-name> with your actual app name
APP_NAME="your-app-name"

# Generate a secret key (run this once)
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

# Set all secrets
flyctl secrets set SECRET_KEY="$SECRET_KEY" -a $APP_NAME
flyctl secrets set DEBUG=False -a $APP_NAME
flyctl secrets set ALLOWED_HOSTS="hasolutions.us,www.hasolutions.us,$APP_NAME.fly.dev" -a $APP_NAME
flyctl secrets set EMAIL_HOST_USER="hasolutionscontact@gmail.com" -a $APP_NAME
flyctl secrets set EMAIL_HOST_PASSWORD="your-gmail-app-password" -a $APP_NAME
flyctl secrets set CONTACT_EMAIL="hamza@hasolutions.us" -a $APP_NAME
```

### 5. Deploy

```bash
flyctl deploy
```

### 6. Run Migrations

```bash
flyctl ssh console -a $APP_NAME
```

In the console:
```bash
python manage.py migrate
python manage.py createsuperuser
exit
```

### 7. Add Custom Domain

```bash
flyctl certs add hasolutions.us -a $APP_NAME
flyctl certs add www.hasolutions.us -a $APP_NAME
```

Get DNS records:
```bash
flyctl certs show hasolutions.us -a $APP_NAME
```

### 8. Update GoDaddy DNS

1. Log into GoDaddy
2. DNS Management for `hasolutions.us`
3. Add the DNS records from step 7
4. Wait 5-30 minutes

### 9. Done! 🎉

Visit: `https://hasolutions.us`

## 📋 Quick Commands

```bash
# View logs
flyctl logs -a $APP_NAME

# Restart app
flyctl apps restart $APP_NAME

# SSH into app
flyctl ssh console -a $APP_NAME

# Check status
flyctl status -a $APP_NAME
```

## 🔄 Update Your Site

```bash
git add .
git commit -m "Your changes"
git push origin Django-version
flyctl deploy
```

## 🆘 Troubleshooting

**Build fails?**
- Check `Dockerfile` exists
- Check `requirements.txt` is correct
- View logs: `flyctl logs -a $APP_NAME`

**Database errors?**
- Check database is attached: `flyctl postgres list`
- Re-attach: `flyctl postgres attach <db-name> -a $APP_NAME`

**Domain not working?**
- Check DNS records match
- Wait for propagation
- Verify cert: `flyctl certs show hasolutions.us -a $APP_NAME`

For detailed instructions, see `DEPLOY_FLYIO.md`

