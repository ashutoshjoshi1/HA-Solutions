#!/bin/bash
# Quick deployment script for HA Solutions website
# Run this on your server after initial setup

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Activate virtual environment
cd /var/www/hasolutions
source venv/bin/activate

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin Django-version

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart gunicorn
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at https://hasolutions.us"

