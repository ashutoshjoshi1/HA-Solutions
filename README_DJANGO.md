# HA Solutions Django Website

This is the Django version of the HA Solutions website with email functionality for contact forms.

## Setup Instructions

### 1. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Email Settings

Edit `hasolutions/settings.py` or set environment variables:

```bash
export EMAIL_HOST_USER='your-email@outlook.com'  # or @hotmail.com, @live.com, or your Office 365 email
export EMAIL_HOST_PASSWORD='your-outlook-password'
export DEFAULT_FROM_EMAIL='noreply@hasolutions.us'
```

**For Outlook/Office 365:**
- Use your full Outlook email address for `EMAIL_HOST_USER`
- Use your Outlook account password for `EMAIL_HOST_PASSWORD`
- If you have 2FA enabled, you may need to use an app password
- SMTP settings are already configured: `smtp-mail.outlook.com` on port 587 with TLS

**For Gmail:**
- You'll need to use an "App Password" instead of your regular password
- Go to Google Account > Security > 2-Step Verification > App passwords
- Generate an app password and use it for `EMAIL_HOST_PASSWORD`
- Update `EMAIL_HOST` to `smtp.gmail.com` in `settings.py`

**For other email providers:**
- Update `EMAIL_HOST` in `settings.py` (e.g., `smtp.yourprovider.com`)
- Update `EMAIL_PORT` if needed (587 for TLS, 465 for SSL)

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 6. Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### 7. Run the Development Server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` in your browser.

## Email Configuration

The contact form sends emails to: **hamza@hasolutions.us**

To change the recipient email, edit `CONTACT_EMAIL` in `hasolutions/settings.py`.

## Project Structure

```
HA-Solutions/
├── hasolutions/          # Django project settings
│   ├── settings.py       # Main settings file
│   ├── urls.py           # Root URL configuration
│   └── wsgi.py           # WSGI configuration
├── website/              # Main Django app
│   ├── forms.py          # Contact and application forms
│   ├── views.py          # View functions
│   ├── urls.py           # App URL configuration
│   └── templates/        # Django templates
│       └── website/      # Template files
├── static/               # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── img/
├── data/                 # JSON data files
│   └── jobs.json         # Job listings
├── manage.py             # Django management script
└── requirements.txt      # Python dependencies
```

## Converting Remaining HTML Files

The main pages (index, contact, careers, careers-apply, careers-job-detail) have been converted to Django templates. To convert the remaining HTML files:

1. Copy the HTML file to the appropriate template directory
2. Change `<!DOCTYPE html>` to `{% extends 'website/base.html' %}`
3. Replace static file references:
   - `href="css/styles.css"` → `href="{% static 'css/styles.css' %}"`
   - `src="img/logo.png"` → `src="{% static 'img/logo.png' %}"`
   - `src="js/script.js"` → `src="{% static 'js/script.js' %}"`
4. Replace URL references:
   - `href="index.html"` → `href="{% url 'index' %}"`
   - `href="contact.html"` → `href="{% url 'contact' %}"`
   - etc.
5. Wrap the main content in `{% block content %}...{% endblock %}`

## Testing Email

To test email functionality without sending real emails during development, you can use Django's console email backend. Add this to `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

This will print emails to the console instead of sending them.

## Production Deployment

For production:

1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Use a proper email service (SendGrid, AWS SES, etc.)
4. Set up proper static file serving (WhiteNoise, CDN, etc.)
5. Use environment variables for sensitive settings
6. Set up a proper database (PostgreSQL recommended)

## Troubleshooting

**Email not sending:**
- Check your email credentials
- Verify SMTP settings match your email provider
- Check firewall/network settings
- For Gmail, ensure 2FA is enabled and you're using an app password

**Static files not loading:**
- Run `python manage.py collectstatic`
- Check `STATIC_URL` and `STATIC_ROOT` in settings.py
- Ensure `DEBUG = True` for development

**Template not found:**
- Verify template is in `website/templates/website/`
- Check `TEMPLATES` setting in `settings.py`
- Ensure app is in `INSTALLED_APPS`

