#!/bin/bash
# Start Django server with email enabled
# Usage: ./start_with_email.sh

# Set email configuration (UPDATE THESE VALUES)
export EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
export EMAIL_HOST_USER='your-outlook-email@outlook.com'  # CHANGE THIS
export EMAIL_HOST_PASSWORD='your-app-password-here'      # CHANGE THIS

# Activate virtual environment
source venv/bin/activate

# Start server
python manage.py runserver

