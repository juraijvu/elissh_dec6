@echo off
echo 🚀 Building for Production...

echo 📦 Installing dependencies...
call npm install

echo 🏗️ Building with production API URL...
set VITE_API_URL=https://elissh.com/api
call npm run build

echo ✅ Production build complete!
echo 📁 Upload the 'dist' folder to your server
echo 🔧 Make sure backend is running on port 7001
echo 🌐 Apache should proxy /api to localhost:7001/api

pause