#!/usr/bin/env python
"""
Script to create a recruiter user account.
Run this with: python manage.py shell < create_recruiter_user.py
Or run: python manage.py shell and paste the code below.
"""

from django.contrib.auth.models import User
import sys

# Default credentials (change these!)
USERNAME = 'recruiter'
EMAIL = 'recruiter@hasolutions.us'
PASSWORD = 'recruiter123'  # CHANGE THIS PASSWORD!

# Check if user already exists
if User.objects.filter(username=USERNAME).exists():
    print(f"User '{USERNAME}' already exists!")
    user = User.objects.get(username=USERNAME)
    print(f"To reset password, run: user.set_password('{PASSWORD}'); user.save()")
else:
    # Create new user
    user = User.objects.create_user(
        username=USERNAME,
        email=EMAIL,
        password=PASSWORD
    )
    user.save()
    print(f"✅ User created successfully!")
    print(f"Username: {USERNAME}")
    print(f"Password: {PASSWORD}")
    print(f"\n⚠️  IMPORTANT: Change this password after first login!")

