@echo off
echo 🚀 Building for production...

REM Copy production environment
copy .env.production .env

REM Build frontend
npm run build

echo ✅ Build complete! 
echo 📁 Upload the 'dist' folder to your server
echo 🔧 On server: Set backend PORT=7001, Apache proxy to 7000

pause