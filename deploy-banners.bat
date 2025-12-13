@echo off
echo 🚀 Deploying Banner Updates to Production...

echo 📁 Copying banner images...
copy src\assets\new_arrival_*.png backend\uploads\banners\
copy src\assets\hero_*.* backend\uploads\banners\

echo 🌱 Running banner seeds...
cd backend
npm run seed-new-arrivals

echo ✅ Banner deployment complete!
pause