# Quick Render Deployment

## 🚀 Fast Setup (10 minutes)

### 1. Sign Up

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub
4. **NO credit card required!**

### 2. Create Database

1. Click "New +" → "PostgreSQL"
2. Name: `hasolutions-db`
3. Plan: **Free**
4. Click "Create Database"

### 3. Create Web Service

1. Click "New +" → "Web Service"
2. Connect GitHub repo: `HA-Solutions`
3. Configure:
   - Name: `hasolutions-website`
   - Branch: `FlyIO-Production`
   - Runtime: `Python 3`
   - Build Command:
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - Start Command:
     ```bash
     gunicorn hasolutions.wsgi:application
     ```
   - Plan: **Free**

### 4. Add Environment Variables

In "Advanced" → "Environment Variables", add:

```
SECRET_KEY=generate-this-with-python-command-below
DEBUG=False
ALLOWED_HOSTS=hasolutions.us,www.hasolutions.us,your-app-name.onrender.com
EMAIL_HOST_USER=hasolutionscontact@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
CONTACT_EMAIL=hamza@hasolutions.us
```

**Generate SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 5. Link Database

- Scroll to "Add Database"
- Select `hasolutions-db`
- This sets `DATABASE_URL` automatically

### 6. Create Service

Click "Create Web Service" and wait 5-10 minutes.

### 7. Run Migrations

1. Go to "Shell" tab
2. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### 8. Add Custom Domain

1. Go to "Settings" → "Custom Domains"
2. Add: `hasolutions.us`
3. Add: `www.hasolutions.us`
4. Copy DNS records shown

### 9. Update GoDaddy DNS

1. Log into GoDaddy
2. DNS Management for `hasolutions.us`
3. Add DNS records from step 8
4. Wait 5-30 minutes

### 10. Done! 🎉

Visit: `https://hasolutions.us`

## 📋 Quick Reference

**Update site:**
```bash
git push origin FlyIO-Production
# Auto-deploys automatically!
```

**View logs:**
- Go to Render dashboard → Your service → Logs

**Run commands:**
- Go to Render dashboard → Your service → Shell

## ⚠️ About Spin-Down

- Site sleeps after 15 min of no traffic
- First visitor waits ~30 seconds
- Regular traffic keeps it awake
- Upgrade to $7/month for always-on (optional)

## 🆘 Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Verify requirements.txt

**Database errors?**
- Check database is linked
- Verify DATABASE_URL is set

**Domain not working?**
- Check DNS records
- Wait for propagation
- Verify SSL certificate

For detailed instructions, see `DEPLOY_RENDER.md`

