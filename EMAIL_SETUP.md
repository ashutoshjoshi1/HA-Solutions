# Email Setup Guide for Contact Form

The contact form is configured to send emails to `hamza@hasolutions.us`. Currently, it's set to print emails to the console (for testing). To send real emails, follow one of these options:

## Option 1: Use Outlook SMTP (Free - Recommended)

If you have an Outlook/Hotmail account, you can use it to send emails.

### Step 1: Get Your Outlook Credentials

1. Go to https://account.microsoft.com/security
2. Sign in with your Outlook account
3. Enable **Two-Factor Authentication** (required for App Passwords)
4. Go to **Security** → **Advanced security options**
5. Under **App passwords**, create a new app password
6. Copy the generated password (you'll use this instead of your regular password)

### Step 2: Set Environment Variables

**On macOS/Linux:**
```bash
export EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
export EMAIL_HOST_USER='your-outlook-email@outlook.com'
export EMAIL_HOST_PASSWORD='your-app-password-here'
```

**To make it permanent, add to your `~/.zshrc` or `~/.bashrc`:**
```bash
echo 'export EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"' >> ~/.zshrc
echo 'export EMAIL_HOST_USER="your-outlook-email@outlook.com"' >> ~/.zshrc
echo 'export EMAIL_HOST_PASSWORD="your-app-password-here"' >> ~/.zshrc
source ~/.zshrc
```

**On Windows (Command Prompt):**
```cmd
set EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
set EMAIL_HOST_USER=your-outlook-email@outlook.com
set EMAIL_HOST_PASSWORD=your-app-password-here
```

**On Windows (PowerShell):**
```powershell
$env:EMAIL_BACKEND="django.core.mail.backends.smtp.EmailBackend"
$env:EMAIL_HOST_USER="your-outlook-email@outlook.com"
$env:EMAIL_HOST_PASSWORD="your-app-password-here"
```

### Step 3: Restart Your Django Server

After setting the environment variables, restart your Django server:
```bash
python manage.py runserver
```

### Step 4: Test the Contact Form

1. Go to http://127.0.0.1:8000/contact/
2. Fill out and submit the form
3. Check your email at `hamza@hasolutions.us`

---

## Option 2: Use Gmail SMTP (Free Alternative)

If you prefer Gmail, update the settings:

### Step 1: Update `hasolutions/settings.py`

Change these lines:
```python
EMAIL_HOST = 'smtp.gmail.com'  # Change from smtp-mail.outlook.com
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App passwords**
4. Create a new app password for "Mail"
5. Copy the 16-character password

### Step 3: Set Environment Variables

```bash
export EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
export EMAIL_HOST_USER='your-gmail@gmail.com'
export EMAIL_HOST_PASSWORD='your-16-char-app-password'
```

---

## Option 3: Keep Console Backend (For Testing)

If you just want to test locally without sending real emails, the current setup is fine. Emails will print to your terminal when the form is submitted.

To verify it's working, check your terminal output after submitting the contact form.

---

## Troubleshooting

### "Client not authenticated" error
- Make sure you're using an **App Password**, not your regular password
- Verify 2-Factor Authentication is enabled
- Check that `EMAIL_HOST_USER` matches the account you created the app password for

### "Connection refused" error
- Check your internet connection
- Verify the SMTP server address is correct
- Try port 465 with `EMAIL_USE_SSL = True` instead of port 587 with TLS

### Emails not arriving
- Check your spam/junk folder
- Verify `CONTACT_EMAIL = 'hamza@hasolutions.us'` in settings.py
- Check the Django server logs for error messages

---

## Quick Start Script

Create a file `start_with_email.sh`:

```bash
#!/bin/bash
export EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
export EMAIL_HOST_USER='your-email@outlook.com'
export EMAIL_HOST_PASSWORD='your-app-password'
source venv/bin/activate
python manage.py runserver
```

Make it executable:
```bash
chmod +x start_with_email.sh
```

Then run:
```bash
./start_with_email.sh
```
