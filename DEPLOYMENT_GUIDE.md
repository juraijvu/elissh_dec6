# 🚀 Complete Production Deployment Guide

## 📋 Prerequisites
- Server with Node.js 18+
- PostgreSQL database
- Domain pointing to server
- SSL certificate (Let's Encrypt)

## 🗑️ Step 1: Remove Existing Deployment

### On Server:
```bash
# Stop existing processes
pm2 stop all
pm2 delete all

# Remove old files
rm -rf /var/www/html/elissh_old
mv /var/www/html/elissh /var/www/html/elissh_old

# Clean up old processes
pkill -f "node.*elissh"
pkill -f "npm.*elissh"

# Check no processes on old ports
netstat -tlnp | grep -E "(5001|5000)"
```

## 🏗️ Step 2: Fresh Installation

### 2.1 Create new directory:
```bash
mkdir -p /var/www/html/elissh
cd /var/www/html/elissh
```

### 2.2 Upload backend files:
```bash
# Upload your entire backend folder to /var/www/html/elissh/backend/
# Or clone from git:
git clone <your-repo> .
```

### 2.3 Install backend dependencies:
```bash
cd /var/www/html/elissh/backend
npm install
```

### 2.4 Create production backend .env:
```bash
cat > /var/www/html/elissh/backend/.env << EOF
NODE_ENV=production
PORT=7001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elissh_cosmetics
DB_USER=elissh_user
DB_PASSWORD=elissh123
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRE=30d
FRONTEND_URL=https://elissh.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF
```

## 🔥 Step 3: Build and Deploy Frontend

### 3.1 On Local Machine:
```bash
# Build for production
deploy.bat

# This creates dist folder with correct API URL: https://elissh.com/api
```

### 3.2 Upload frontend files:
```bash
# Upload the entire 'dist' folder to /var/www/html/elissh/dist/
```

## 🔧 Step 4: Configure Server

### 4.1 Open port 7001 in firewall:
```bash
ufw allow 7001
ufw reload
```

### 4.2 Update Apache configuration:
```bash
nano /etc/apache2/sites-available/elissh.com-le-ssl.conf
```

**Replace the proxy configuration with:**
```apache
<VirtualHost *:443>
    ServerName elissh.com
    ServerAlias www.elissh.com
    DocumentRoot /var/www/html/elissh/dist

    <Directory /var/www/html/elissh/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests to Node.js backend on port 7001
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:7001/api/
    ProxyPassReverse /api/ http://localhost:7001/api/

    # Serve uploaded files
    Alias /uploads /var/www/html/elissh/backend/uploads
    <Directory /var/www/html/elissh/backend/uploads>
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/elissh_error.log
    CustomLog ${APACHE_LOG_DIR}/elissh_access.log combined

    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/elissh.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/elissh.com/privkey.pem
</VirtualHost>
```

### 4.3 Restart Apache:
```bash
systemctl restart apache2
```

## 🗄️ Step 5: Setup Database

### 5.1 Create database and user:
```bash
sudo -u postgres psql

CREATE DATABASE elissh_cosmetics;
CREATE USER elissh_user WITH PASSWORD 'elissh123';
GRANT ALL PRIVILEGES ON DATABASE elissh_cosmetics TO elissh_user;
GRANT ALL ON SCHEMA public TO elissh_user;
GRANT CREATE ON SCHEMA public TO elissh_user;
ALTER USER elissh_user CREATEDB;
\q
```

### 5.2 Seed database:
```bash
cd /var/www/html/elissh/backend
node scripts/seed.js
```

## 🚀 Step 6: Start Backend with PM2

### 6.1 Install PM2 globally:
```bash
npm install -g pm2
```

### 6.2 Create PM2 ecosystem file:
```bash
cat > /var/www/html/elissh/backend/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'elissh-backend',
    script: 'server.js',
    cwd: '/var/www/html/elissh/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 7001
    },
    error_file: '/var/log/pm2/elissh-error.log',
    out_file: '/var/log/pm2/elissh-out.log',
    log_file: '/var/log/pm2/elissh.log',
    time: true
  }]
};
EOF
```

### 6.3 Start with PM2:
```bash
cd /var/www/html/elissh/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## ✅ Step 7: Verify Deployment

### 7.1 Check backend:
```bash
# Check if backend is running
pm2 status
curl http://localhost:7001/api/health

# Check logs
pm2 logs elissh-backend
```

### 7.2 Check frontend:
```bash
# Visit https://elissh.com
# Check browser console for errors
# Test API calls in Network tab
```

### 7.3 Test API through proxy:
```bash
curl https://elissh.com/api/health
curl https://elissh.com/api/products
```

## 🔧 Step 8: Monitoring & Maintenance

### 8.1 Monitor processes:
```bash
pm2 monit
```

### 8.2 View logs:
```bash
pm2 logs elissh-backend --lines 100
tail -f /var/log/apache2/elissh_error.log
```

### 8.3 Restart if needed:
```bash
pm2 restart elissh-backend
systemctl restart apache2
```

## 🚨 Troubleshooting

### If port 7001 is blocked:
```bash
# Check if port is listening
netstat -tlnp | grep 7001

# Check firewall
ufw status
ufw allow 7001

# Check Apache proxy
curl -v https://elissh.com/api/health
```

### If database connection fails:
```bash
# Test database connection
psql -h localhost -U elissh_user -d elissh_cosmetics -c "SELECT 1;"

# Check backend logs
pm2 logs elissh-backend
```

## 📝 Quick Commands Reference

```bash
# Restart everything
pm2 restart elissh-backend && systemctl restart apache2

# Check status
pm2 status && systemctl status apache2

# View logs
pm2 logs elissh-backend --lines 50

# Update code (after uploading new files)
pm2 restart elissh-backend
```

---

**🎉 Your Elissh Cosmetics website should now be live at https://elissh.com!**
**Frontend calls: https://elissh.com/api (Apache proxy)**
**Backend runs on: localhost:7001**