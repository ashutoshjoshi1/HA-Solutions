# Fix: Gmail App Passwords Not Available

If you see "The setting you are looking for is not available for your account", here's how to fix it:

## Solution 1: Enable 2-Step Verification First

App Passwords require 2-Step Verification to be enabled first.

### Steps:
1. Go to: https://myaccount.google.com/security
2. Find **"2-Step Verification"** section
3. Click **"Get started"** or **"Turn on"**
4. Follow the setup process (you'll need your phone)
5. Once 2-Step Verification is enabled, go back to App Passwords
6. Now you should be able to create an app password!

---

## Solution 2: Use Outlook Instead (Easier!)

If Gmail is giving you trouble, use Outlook - it's simpler:

### Step 1: Create Free Outlook Account
1. Go to: https://outlook.com
2. Click **"Create free account"**
3. Create account (e.g., `hasolutions.contact@outlook.com`)

### Step 2: Update Settings
Edit `hasolutions/settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp-mail.outlook.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-outlook-email@outlook.com'
EMAIL_HOST_PASSWORD = 'your-outlook-password'
DEFAULT_FROM_EMAIL = 'your-outlook-email@outlook.com'
```

**That's it!** No app passwords needed for basic Outlook accounts.

---

## Solution 3: Use SendGrid (No App Passwords Needed)

SendGrid is free and doesn't require app passwords:

1. Go to: https://sendgrid.com
2. Click **"Start for Free"** (no credit card needed)
3. Sign up and verify your email
4. Go to **Settings** → **API Keys**
5. Create API key
6. Update settings:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'  # Literally the word 'apikey'
EMAIL_HOST_PASSWORD = 'your-sendgrid-api-key'
DEFAULT_FROM_EMAIL = 'noreply@hasolutions.us'
```

---

## My Recommendation

**Use Outlook (Solution 2)** - It's the easiest:
- ✅ No app passwords needed
- ✅ Just use your regular password
- ✅ Works immediately
- ✅ Completely free

Just create a free Outlook account and use your regular password - no special setup required!

---

## Quick Setup

Once you choose an option, I can help you update the settings file. Just tell me:
- Which option you want (Outlook, SendGrid, or fix Gmail)
- Your email address
- Your password/API key

And I'll update everything for you!

