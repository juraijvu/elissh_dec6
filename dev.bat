@echo off
echo 🔧 Starting local development...

REM Ensure local environment
echo VITE_API_URL=http://localhost:5000/api > .env
echo VITE_APP_NAME=Elissh Beauty >> .env
echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key >> .env

echo ✅ Environment set for local development
echo 🚀 Start backend: cd backend && npm run dev
echo 🚀 Start frontend: npm run dev

pause