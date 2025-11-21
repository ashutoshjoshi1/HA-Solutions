# HA Solutions Website

A Django-based website for HA Solutions featuring job postings, contact forms, and a recruiter portal.

## Project Structure

```
HA-Solutions/
├── hasolutions/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── website/              # Main Django app
│   ├── models.py         # Job model
│   ├── views.py          # Public views
│   ├── admin_views.py    # Recruiter portal views
│   ├── forms.py          # Contact & job application forms
│   ├── templates/        # HTML templates
│   └── static/           # Static files (CSS, JS, images)
├── scripts/              # Utility scripts
├── manage.py
└── requirements.txt
```

## Setup

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser (for recruiter portal):**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server:**
   ```bash
   python manage.py runserver
   ```

6. **Access the site:**
   - Website: http://127.0.0.1:8000/
   - Recruiter Portal: http://127.0.0.1:8000/recruiter/login/

## Features

- **Public Pages**: Home, About, Careers, Contact, Companies, Candidates, Technology, Industry
- **Job Postings**: Dynamic job listings with detailed descriptions
- **Job Applications**: Application form with resume upload
- **Contact Form**: Contact form with file attachment support
- **Recruiter Portal**: CRUD operations for job postings (login required)
- **Email Integration**: Gmail SMTP for contact and job application emails

## Deployment

### Self-Host on Windows PC (Recommended - Free & Always-On):
See `DEPLOY_WINDOWS_PC.md` for complete Windows PC deployment guide.
Quick start: `QUICK_WINDOWS_PC.md`
- ✅ Completely FREE
- ✅ Always-on (no spin-downs!)
- ✅ Full control
- ✅ No limitations
- ⚠️ PC must stay on 24/7
- ⚠️ Requires router port forwarding

### Render (Free, No Credit Card Required):
See `DEPLOY_RENDER.md` for step-by-step Render deployment guide.
Quick start: `QUICK_RENDER.md`
- ✅ Completely FREE
- ✅ NO credit card required
- ✅ Free SSL certificates
- ✅ Free custom domain
- ⚠️ Spins down after 15 min inactivity (first request ~30 sec delay)

### Fly.io (Free & Always-On, but requires credit card):
See `DEPLOY_FLYIO.md` for step-by-step Fly.io deployment guide.
Quick start: `QUICK_FLYIO.md`
- ✅ Completely FREE
- ✅ Always-on (no spin-downs!)
- ✅ Free SSL certificates
- ✅ Free custom domain
- ⚠️ Requires credit card for verification

### Other Free Cloud Hosting Options:
See `FREE_HOSTING.md` for other options like Render and Railway.

### For Linux Servers:
See `DEPLOYMENT.md` for complete deployment guide.

### For Windows 10 PC:
See `DEPLOYMENT_WINDOWS.md` for Windows-specific deployment instructions.
Quick start: `QUICK_DEPLOY_WINDOWS.md`

## Email Configuration

Email settings are configured in `hasolutions/settings.py`. The system uses Gmail SMTP to send:
- Contact form submissions to `hamza@hasolutions.us`
- Job applications to `hamza@hasolutions.us`

## Recruiter Portal

Access the recruiter portal at `/recruiter/login/` to:
- Create new job postings
- Update existing jobs
- Delete jobs
- View all active jobs

## Static Files

Static files (CSS, JavaScript, images) are located in `website/static/` and are automatically served by Django in development mode.
