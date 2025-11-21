#!/bin/bash
# Initial server setup script
# Run this once on a fresh Ubuntu/Debian server

set -e

echo "🔧 Starting initial server setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install required packages
echo "📥 Installing required packages..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    postgresql \
    postgresql-contrib \
    nginx \
    git \
    supervisor \
    certbot \
    python3-certbot-nginx \
    ufw

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "✅ Initial setup complete!"
echo "📝 Next steps:"
echo "   1. Set up your domain DNS in GoDaddy"
echo "   2. Clone your repository to /var/www/hasolutions"
echo "   3. Follow the DEPLOYMENT.md guide"

