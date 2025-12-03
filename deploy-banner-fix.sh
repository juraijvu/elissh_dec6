#!/bin/bash

echo "🚀 Deploying Banner System Fix..."

# Update environment for production
cp .env.production .env

# Build frontend with production config
npm run build

# Copy files to server (you'll need to run this on the server)
echo "📁 Files ready for deployment"
echo "🔧 Next steps on server:"
echo "1. Copy updated files to /var/www/html/elissh/"
echo "2. Run: npm run build"
echo "3. Restart PM2: pm2 restart elissh-backend"
echo "4. Test banner upload in admin panel"

echo "✅ Local build completed!"