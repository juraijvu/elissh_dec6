#!/bin/bash

echo "🚀 Elissh Cosmetics - Production Deployment Script"
echo "=================================================="

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 stop elissh-backend 2>/dev/null || true
pm2 delete elissh-backend 2>/dev/null || true

# Backup existing installation
if [ -d "/var/www/html/elissh" ]; then
    echo "📦 Backing up existing installation..."
    mv /var/www/html/elissh /var/www/html/elissh_backup_$(date +%Y%m%d_%H%M%S)
fi

# Create fresh directory
echo "📁 Creating fresh installation directory..."
mkdir -p /var/www/html/elissh/backend
mkdir -p /var/www/html/elissh/dist

# Set permissions
chown -R www-data:www-data /var/www/html/elissh

echo "✅ Server prepared for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your backend files to: /var/www/html/elissh/backend/"
echo "2. Upload your dist folder to: /var/www/html/elissh/dist/"
echo "3. Run: cd /var/www/html/elissh/backend && npm install"
echo "4. Create .env file with PORT=7000"
echo "5. Run: pm2 start server.js --name elissh-backend"
echo "6. Open port 7000: ufw allow 7000"
echo "7. Update Apache config to proxy port 7000"
echo ""
echo "🌐 Your site will be live at: https://elissh.com"