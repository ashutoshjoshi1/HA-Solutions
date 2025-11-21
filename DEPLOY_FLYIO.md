# Deploy to Fly.io - Step by Step Guide

This guide will help you deploy your Django website to Fly.io for FREE with no spin-downs!

## Prerequisites

- GitHub account (your code should be on GitHub)
- Fly.io account (free to sign up)
- Terminal/Command line access

## Step 1: Sign Up for Fly.io

1. Go to [fly.io](https://fly.io)
2. Click "Sign Up" (top right)
3. Sign up with GitHub (easiest option)
4. Verify your email if needed

## Step 2: Install Fly CLI

### On macOS (your current system):

```bash
# Install using Homebrew (if you have it)
brew install flyctl

# OR download directly
curl -L https://fly.io/install.sh | sh
```

### On Windows:

Download from: https://fly.io/docs/hands-on/install-flyctl/

### Verify Installation:

```bash
flyctl version
```

## Step 3: Login to Fly.io

```bash
flyctl auth login
```

This will open your browser to authenticate.

## Step 4: Prepare Your Project

Your project is already set up with the necessary files! The configuration files we need are already created.

## Step 5: Create Fly.io App

In your project directory:

```bash
cd "/Users/hamzaadnan/Documents/Business/HA Solutions/Website/HA-Solutions"
flyctl launch
```

This will:
- Ask for app name (or generate one)
- Ask for region (choose closest to you)
- Ask about PostgreSQL (say YES)
- Ask about Redis (say NO)
- Create `fly.toml` configuration file

## Step 6: Configure PostgreSQL Database

Fly.io will create a PostgreSQL database. You'll need to get the connection string:

```bash
# Get database connection string
flyctl postgres connect -a <your-db-app-name>
```

Or in Fly.io dashboard:
1. Go to your app
2. Click on the PostgreSQL service
3. Copy the connection string from "Connection" tab

## Step 7: Set Environment Variables

Set your environment variables:

```bash
# Set secret key (generate a secure one)
flyctl secrets set SECRET_KEY="your-very-secure-secret-key-here"

# Set other environment variables
flyctl secrets set DEBUG=False
flyctl secrets set ALLOWED_HOSTS="hasolutions.us,www.hasolutions.us,your-app-name.fly.dev"
flyctl secrets set EMAIL_HOST_USER="hasolutionscontact@gmail.com"
flyctl secrets set EMAIL_HOST_PASSWORD="your-gmail-app-password"
flyctl secrets set CONTACT_EMAIL="hamza@hasolutions.us"
```

**Important:** The DATABASE_URL is automatically set by Fly.io when you link the PostgreSQL service.

## Step 8: Link Database to App

```bash
flyctl postgres attach <your-db-app-name> -a <your-app-name>
```

This automatically sets the `DATABASE_URL` environment variable.

## Step 9: Deploy Your App

```bash
flyctl deploy
```

This will:
- Build your Docker image
- Deploy to Fly.io
- Show you the deployment URL

## Step 10: Run Migrations

After first deployment, run migrations:

```bash
flyctl ssh console -a <your-app-name>
```

Then in the console:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

Exit the console:
```bash
exit
```

## Step 11: Add Custom Domain

### 11.1 Add Domain in Fly.io

```bash
flyctl certs add hasolutions.us -a <your-app-name>
flyctl certs add www.hasolutions.us -a <your-app-name>
```

### 11.2 Get DNS Records

```bash
flyctl certs show hasolutions.us -a <your-app-name>
```

This will show you the DNS records you need to add.

### 11.3 Update GoDaddy DNS

1. Log into GoDaddy
2. Go to DNS Management for `hasolutions.us`
3. Add the DNS records shown by Fly.io:
   - Usually a CNAME record for `www`
   - Usually an A record for `@` (root domain)

Wait 5-30 minutes for DNS propagation.

## Step 12: Verify Everything Works

1. Visit your app: `https://your-app-name.fly.dev`
2. Visit your domain: `https://hasolutions.us`
3. Test all features (contact form, job applications, etc.)

## Step 13: Monitor Your App

```bash
# View logs
flyctl logs -a <your-app-name>

# Check app status
flyctl status -a <your-app-name>

# View app info
flyctl info -a <your-app-name>
```

## Updating Your Site

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin Django-version

# Deploy to Fly.io
flyctl deploy
```

## Useful Commands

```bash
# View logs in real-time
flyctl logs -a <your-app-name>

# SSH into your app
flyctl ssh console -a <your-app-name>

# Scale your app (if needed)
flyctl scale count 1 -a <your-app-name>

# View secrets
flyctl secrets list -a <your-app-name>

# Update secrets
flyctl secrets set KEY=value -a <your-app-name>

# Restart app
flyctl apps restart <your-app-name>
```

## Troubleshooting

### Build fails?
- Check `Dockerfile` is correct
- Check `fly.toml` configuration
- View build logs: `flyctl logs -a <your-app-name>`

### Database connection errors?
- Verify database is attached: `flyctl postgres list`
- Check DATABASE_URL is set: `flyctl secrets list -a <your-app-name>`
- Re-attach database if needed

### Static files not loading?
- Ensure `collectstatic` runs during build
- Check `STATIC_ROOT` in settings.py
- Verify WhiteNoise is configured

### Domain not working?
- Check DNS records in GoDaddy match Fly.io requirements
- Wait for DNS propagation (up to 48 hours)
- Verify certificate: `flyctl certs show hasolutions.us -a <your-app-name>`

## Free Tier Limits

Fly.io free tier includes:
- ✅ 3 shared VMs (enough for small sites)
- ✅ 3GB persistent volume storage
- ✅ 160GB outbound data transfer
- ✅ Always-on (no spin-down!)

If you exceed limits, you'll be notified. For a small Django site, you should stay well within limits.

## Next Steps

1. Follow steps 1-13 above
2. Test your deployed site
3. Monitor usage in Fly.io dashboard
4. Enjoy your free, always-on website! 🎉

## Need Help?

- Fly.io Docs: https://fly.io/docs/
- Fly.io Community: https://community.fly.io/
- Check logs: `flyctl logs -a <your-app-name>`

