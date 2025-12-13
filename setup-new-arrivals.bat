@echo off
echo 🎨 Setting up New Arrival Banners...
echo.

cd backend
echo 📦 Installing dependencies (if needed)...
call npm install

echo.
echo 🌱 Seeding new arrival banners...
call npm run seed-new-arrivals

echo.
echo ✅ New arrival banners setup complete!
echo 🌐 You can now view them at: http://localhost:5173
echo 📊 Admin panel: http://localhost:5173/admin/banners
echo.
pause