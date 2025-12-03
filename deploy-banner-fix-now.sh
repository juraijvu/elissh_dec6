#!/bin/bash

echo "🚀 Deploying Banner Fix to Production..."

# Commit and push changes
git add .
git commit -m "Fix banner system - use production API URLs"
git push origin main

echo "📤 Changes pushed to GitHub"
echo ""
echo "🔧 Now run these commands on your server:"
echo ""
echo "cd /var/www/html/elissh"
echo "git pull origin main"
echo "npm run build"
echo "pm2 restart elissh-backend"
echo ""
echo "✅ Then test banner upload in admin panel!"