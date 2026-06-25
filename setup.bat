@echo off
REM DailyFlow Setup Script for Windows

echo 🚀 DailyFlow Setup Starting...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend
call npm install

if not exist ".env" (
    echo Creating .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/dailyflow
        echo JWT_SECRET=your-jwt-secret-key-change-this-in-production
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
)

cd ..
echo ✅ Backend setup complete
echo.

REM Setup Frontend
echo 📦 Setting up Frontend...
cd frontend
call npm install

if not exist ".env.local" (
    echo Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api
        echo NEXTAUTH_SECRET=your-secret-key-change-this-in-production
        echo NEXTAUTH_URL=http://localhost:3000
        echo GOOGLE_CLIENT_ID=your-google-client-id
        echo GOOGLE_CLIENT_SECRET=your-google-client-secret
    ) > .env.local
)

cd ..
echo ✅ Frontend setup complete
echo.

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running on localhost:27017
echo 2. In one terminal, run: cd backend ^&^& npm run dev
echo 3. In another terminal, run: cd frontend ^&^& npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📝 Don't forget to update .env files with your actual values!
