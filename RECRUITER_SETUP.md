# Recruiter Admin Portal Setup

## Overview
The recruiter admin portal allows recruiters to create, update, and delete job postings on the careers page.

## Setup Instructions

### 1. Run Database Migrations
First, create the database tables for the Job model:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Create a Recruiter User Account
Create a user account for your recruiter:

```bash
python manage.py createsuperuser
```

Or create a regular user:
```bash
python manage.py shell
```

Then in the shell:
```python
from django.contrib.auth.models import User
user = User.objects.create_user('recruiter', 'recruiter@hasolutions.us', 'your-password')
user.save()
```

### 3. Access the Admin Portal

**Hidden Login Link:**
- There's a hidden link at the bottom-left corner of every page (nearly invisible)
- Or go directly to: `http://127.0.0.1:8000/recruiter/login/`

**Login Credentials:**
- Use the username and password you created in step 2

### 4. Features

#### Dashboard
- View all jobs
- See job numbers, titles, categories, locations
- See active/inactive status
- Quick access to edit and delete

#### Create Job
- Form with all job fields:
  - Title, Category, Location, State, City
  - Job Type (Remote/Hybrid/On-site)
  - Date
  - Short description (for listing page)
  - Detailed description (for job detail page)
  - Responsibilities (one per line)
  - Required qualifications (one per line)
  - Preferred qualifications (one per line)
  - Active/Inactive toggle

#### Update Job
- Same form as create, but pre-filled with current job data
- Job number cannot be changed (auto-generated)

#### Delete Job
- Select job from list
- Confirm deletion
- Cannot be undone

### 5. Job Numbers

Each job automatically gets a unique job number when created:
- Format: `JOB-YYYYMMDD-XXXX`
- Example: `JOB-20250115-A3B2`
- Displayed on careers page (top right of each job card)
- Displayed on job detail page (top right)

### 6. Import Existing Jobs from JSON

If you have jobs in `data/jobs.json`, you can import them:

```bash
python manage.py shell
```

Then:
```python
from website.models import Job
import json
from datetime import datetime

with open('data/jobs.json', 'r') as f:
    data = json.load(f)
    
for job_data in data['jobs']:
    job = Job.objects.create(
        title=job_data['title'],
        category=job_data.get('category', 'Other'),
        location=job_data['location'],
        state=job_data.get('state', ''),
        city=job_data.get('city', ''),
        type=job_data.get('type', 'Remote'),
        date=datetime.strptime(job_data['date'], '%Y-%m-%d').date(),
        description=job_data['description'],
        detailed_description=job_data.get('detailedDescription', job_data['description']),
        responsibilities='\n'.join(job_data.get('responsibilities', [])),
        required_qualifications='\n'.join(job_data.get('requiredQualifications', [])),
        preferred_qualifications='\n'.join(job_data.get('preferredQualifications', [])),
        is_active=True
    )
    print(f"Created: {job.job_number} - {job.title}")
```

## Security Notes

- The login link is hidden but not secure - anyone who knows the URL can access it
- For production, consider:
  - Adding IP whitelisting
  - Using stronger authentication (2FA)
  - Restricting access to specific user groups
  - Using Django's built-in admin with proper permissions

## URLs

- Login: `/recruiter/login/`
- Dashboard: `/recruiter/dashboard/`
- Create: `/recruiter/create/`
- Update: `/recruiter/update/<job_id>/`
- Delete: `/recruiter/delete/`
- Delete Confirm: `/recruiter/delete/<job_id>/`
- Logout: `/recruiter/logout/`

