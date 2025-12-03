#!/bin/bash

echo "🚀 Starting Elissh Cosmetics Production Setup..."

# Create logs directory
mkdir -p logs

# Clear problematic database data
echo "🗑️ Cleaning database..."
psql -U postgres -d elissh_cosmetics -c "DELETE FROM \"Carts\";" 2>/dev/null || true
psql -U postgres -d elissh_cosmetics -c "DELETE FROM \"Wishlists\";" 2>/dev/null || true

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop only elissh processes (preserve other apps)
pm2 stop elissh-backend 2>/dev/null || true
pm2 delete elissh-backend 2>/dev/null || true

# Start backend with PM2
echo "🔧 Starting backend server..."
pm2 start ecosystem.config.js

# Restart other existing apps
echo "🔄 Restarting other applications..."
pm2 restart lmsorbit 2>/dev/null || true
pm2 restart rest-express 2>/dev/null || true

# Show status
pm2 status

echo "✅ Production setup complete!"
echo "🌐 Frontend: http://elissh.com"
echo "🔗 Backend API: http://elissh.com:5002/api"
echo "📊 PM2 Status: pm2 status"
echo "📝 Logs: pm2 logs elissh-backend"