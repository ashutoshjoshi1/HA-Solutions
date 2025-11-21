# Deploy to Render - Step by Step Guide

This guide will help you deploy your Django website to Render for FREE with NO credit card required!

## Prerequisites

- GitHub account (your code should be on GitHub)
- Render account (free to sign up, NO credit card required)
- Your code pushed to GitHub

## Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free" (top right)
3. Sign up with GitHub (easiest option)
4. **NO credit card required!** Just verify your email

## Step 2: Prepare Your Repository

Make sure your code is pushed to GitHub on the `FlyIO-Production` branch (or your preferred branch).

## Step 3: Create PostgreSQL Database

1. In Render dashboard, click "New +" (top right)
2. Select "PostgreSQL"
3. Configure:
   - **Name:** `hasolutions-db`
   - **Database:** `hasolutions_db` (or leave default)
   - **User:** `hasolutions_user` (or leave default)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** Latest (14 or 15)
   - **Plan:** **Free** (select this!)
4. Click "Create Database"
5. **Save the connection details** - you'll need them!

## Step 4: Create Web Service

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository:
   - Click "Connect account" if not connected
   - Authorize Render to access your repositories
   - Select repository: `HA-Solutions`
   - Click "Connect"

4. Configure the service:
   - **Name:** `hasolutions-website`
   - **Region:** Choose closest to you
   - **Branch:** `FlyIO-Production` (or your branch)
   - **Root Directory:** (leave blank)
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command:**
     ```bash
     gunicorn hasolutions.wsgi:application
     ```
   - **Plan:** **Free** (select this!)

5. Click "Advanced" and add Environment Variables:
   - Click "Add Environment Variable"
   - Add each of these:

   ```
   SECRET_KEY=your-very-secure-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=hasolutions.us,www.hasolutions.us,your-app-name.onrender.com
   EMAIL_HOST_USER=hasolutionscontact@gmail.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   CONTACT_EMAIL=hamza@hasolutions.us
   ```

   **Important:** For `SECRET_KEY`, generate a secure one:
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

6. **Link Database:**
   - Scroll down to "Add Database"
   - Select your PostgreSQL database (`hasolutions-db`)
   - This automatically sets `DATABASE_URL` environment variable

7. Click "Create Web Service"

## Step 5: Wait for Deployment

- First deployment takes 5-10 minutes
- You can watch the build logs in real-time
- Your site will be live at: `https://your-app-name.onrender.com`

## Step 6: Run Migrations

1. In your web service dashboard, click "Shell" tab
2. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

## Step 7: Add Custom Domain

1. In your web service dashboard, go to "Settings" tab
2. Scroll down to "Custom Domains"
3. Click "Add Custom Domain"
4. Enter: `hasolutions.us`
5. Click "Save"
6. Repeat for `www.hasolutions.us`

## Step 8: Update GoDaddy DNS

Render will show you the DNS records you need to add:

1. Log into GoDaddy
2. Go to DNS Management for `hasolutions.us`
3. Add the DNS records shown by Render:
   - Usually a CNAME record for `www` → `your-app-name.onrender.com`
   - Usually an A record for `@` → IP address from Render

4. Save changes
5. Wait 5-30 minutes for DNS propagation

## Step 9: Verify SSL Certificate

Render automatically provisions SSL certificates. After DNS propagates:
1. Go to "Settings" → "Custom Domains"
2. Wait for SSL certificate to be issued (usually automatic)
3. Your site will be accessible at `https://hasolutions.us`

## Step 10: Test Your Site

1. Visit: `https://hasolutions.us`
2. Test all features:
   - Home page loads
   - Contact form works
   - Job applications work
   - Recruiter portal works

## Understanding Spin-Down

**What it means:**
- After 15 minutes of no traffic, your site goes to sleep
- First visitor after sleep waits ~30 seconds to wake it up
- Subsequent visitors are fast (site stays awake)

**To minimize spin-down:**
- Regular traffic keeps it awake
- You can use a monitoring service to ping your site every 10 minutes
- Or upgrade to $7/month for always-on (optional, not required)

## Updating Your Site

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push origin FlyIO-Production
```

Render automatically detects the push and redeploys! No manual action needed.

## Useful Commands (via Shell)

Access the shell in Render dashboard:

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Check Django version
python -c "import django; print(django.get_version())"
```

## Monitoring

- **Logs:** View real-time logs in Render dashboard
- **Metrics:** See CPU, memory usage in dashboard
- **Deployments:** View deployment history and status

## Troubleshooting

### Build fails?
- Check build logs in Render dashboard
- Verify `requirements.txt` is correct
- Check `build.sh` if you're using it
- Ensure all dependencies are listed

### Database connection errors?
- Verify database is linked in service settings
- Check `DATABASE_URL` is set (should be automatic)
- Verify database is running in Render dashboard

### Static files not loading?
- Ensure `collectstatic` runs in build command
- Check `STATIC_ROOT` in settings.py
- Verify WhiteNoise is installed and configured

### Domain not working?
- Check DNS records in GoDaddy match Render requirements
- Wait for DNS propagation (up to 48 hours)
- Verify SSL certificate is issued in Render dashboard

### Site is slow on first visit?
- This is normal due to spin-down
- First request after 15+ min inactivity takes ~30 seconds
- Subsequent requests are fast
- Consider upgrade to $7/month for always-on (optional)

## Free Tier Limits

Render free tier includes:
- ✅ 750 hours/month (enough for always-on if you upgrade)
- ✅ 100GB bandwidth/month
- ✅ Free SSL certificates
- ✅ Free custom domains
- ⚠️ Spins down after 15 min inactivity

For a small business site, the free tier is usually sufficient!

## Next Steps

1. Follow steps 1-10 above
2. Test your deployed site
3. Monitor usage in Render dashboard
4. Enjoy your free website! 🎉

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check logs in Render dashboard for errors

