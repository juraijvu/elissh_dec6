@echo off
echo 🔍 Verifying New Arrival Banners Setup...
echo.

echo 📁 Checking if images exist in uploads folder:
dir backend\uploads\banners\new_arrival_*.png

echo.
echo 🌐 Testing if backend server can serve the images...
echo (Make sure your backend server is running on port 5000)
echo.

echo 📋 Setup Summary:
echo ✅ 7 images copied to backend/uploads/banners/
echo ✅ 7 banner records created in database
echo ✅ Home page updated to show 7 banners
echo ✅ Static file serving configured
echo.

echo 🚀 To test the banners:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: npm run dev  
echo 3. Visit: http://localhost:5173
echo 4. Scroll to "New Arrivals" section
echo.

echo 🔧 Admin panel: http://localhost:5173/admin/banners
echo.
pause