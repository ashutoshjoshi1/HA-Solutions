#!/usr/bin/env bash
# Build script for cloud hosting platforms (Render, Railway, etc.)
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations (if needed, platforms may handle this separately)
# python manage.py migrate

