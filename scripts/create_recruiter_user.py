#!/usr/bin/env python
"""
Script to create or update recruiter admin user account.
Run this with: python manage.py shell < create_recruiter_user.py
Or run: python manage.py shell and paste the code below.
"""

from django.contrib.auth.models import User
import sys

# Admin credentials
USERNAME = 'admin'
EMAIL = 'admin@hasolutions.us'
PASSWORD = 'HA_Solutions_2025_Secure_Admin_Key!@#$%'

# Check if user already exists
if User.objects.filter(username=USERNAME).exists():
    print(f"User '{USERNAME}' already exists! Updating password and permissions...")
    user = User.objects.get(username=USERNAME)
    user.set_password(PASSWORD)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.email = EMAIL
    user.save()
    print(f"✅ User '{USERNAME}' updated successfully!")
else:
    # Create new user
    user = User.objects.create_user(
        username=USERNAME,
        email=EMAIL,
        password=PASSWORD,
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    user.save()
    print(f"✅ User created successfully!")

print(f"\n📋 Login Credentials:")
print(f"   Username: {USERNAME}")
print(f"   Password: {PASSWORD}")
print(f"   Email: {EMAIL}")
print(f"\n⚠️  IMPORTANT: Keep this password secure!")

