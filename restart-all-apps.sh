#!/bin/bash

echo "🔄 Restarting all applications..."

# Start elissh-backend if not running
pm2 start ecosystem.config.js 2>/dev/null || true

# Find and start lmsorbit
if [ -d "/var/www/html/lmsorbit" ]; then
    cd /var/www/html/lmsorbit
    pm2 start server.js --name lmsorbit 2>/dev/null || pm2 start app.js --name lmsorbit 2>/dev/null || pm2 start index.js --name lmsorbit 2>/dev/null || true
elif [ -d "/var/www/html/infiniqode" ]; then
    cd /var/www/html/infiniqode
    pm2 start dist/index.js --name lmsorbit 2>/dev/null || true
fi

# Find and start rest-express
if [ -d "/var/www/html/rest-express" ]; then
    cd /var/www/html/rest-express
    pm2 start server.js --name rest-express 2>/dev/null || pm2 start app.js --name rest-express 2>/dev/null || pm2 start index.js --name rest-express 2>/dev/null || true
fi

# Check other common locations
for dir in /var/www/html/*/; do
    if [[ "$dir" != *"elissh"* ]]; then
        echo "Checking $dir for Node.js apps..."
        if [ -f "$dir/package.json" ]; then
            cd "$dir"
            dirname=$(basename "$dir")
            if [[ "$dirname" == *"lms"* ]] || [[ "$dirname" == *"orbit"* ]]; then
                pm2 start server.js --name lmsorbit 2>/dev/null || pm2 start app.js --name lmsorbit 2>/dev/null || pm2 start index.js --name lmsorbit 2>/dev/null || true
            elif [[ "$dirname" == *"rest"* ]] || [[ "$dirname" == *"express"* ]]; then
                pm2 start server.js --name rest-express 2>/dev/null || pm2 start app.js --name rest-express 2>/dev/null || pm2 start index.js --name rest-express 2>/dev/null || true
            fi
        fi
    fi
done

echo "📊 Current PM2 status:"
pm2 status