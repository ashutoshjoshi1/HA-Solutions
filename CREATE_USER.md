# Create Recruiter User Account

You need to create a user account to access the recruiter portal. Here are the options:

## Option 1: Using Django Management Command (Easiest)

Run this command to create a superuser (has admin access):

```bash
python manage.py createsuperuser
```

Follow the prompts:
- Username: `recruiter` (or your choice)
- Email: `recruiter@hasolutions.us` (or your choice)
- Password: Enter a secure password

## Option 2: Using Django Shell

Run:
```bash
python manage.py shell
```

Then paste this code:
```python
from django.contrib.auth.models import User

# Create user
user = User.objects.create_user(
    username='recruiter',
    email='recruiter@hasolutions.us',
    password='your-secure-password-here'
)
user.save()
print("User created!")
```

## Option 3: Quick Script

I've created a script `create_recruiter_user.py`. To use it:

1. Edit the file and change the password
2. Run:
```bash
python manage.py shell < create_recruiter_user.py
```

Or manually:
```bash
python manage.py shell
```

Then copy and paste the code from `create_recruiter_user.py`.

## Default Credentials (if using the script)

- **Username:** `recruiter`
- **Password:** `recruiter123` (⚠️ CHANGE THIS!)

## After Creating User

1. Go to: `http://127.0.0.1:8000/recruiter/login/`
2. Enter your username and password
3. You'll be redirected to the dashboard

## Security Note

⚠️ **Important:** Change the default password immediately after first login for security!

