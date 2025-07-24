@echo off
echo 🚀 Starting Photography Portfolio API Server...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please run this script from the api directory
    echo.
    echo Usage: cd api && start-server.bat
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies first...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  .env file not found!
    echo Please create api/.env with your Cloudinary credentials:
    echo.
    echo CLOUDINARY_CLOUD_NAME=dvoeabv7u
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
    echo.
    pause
    exit /b 1
)

echo.
echo 🌟 Starting server on http://localhost:3001
echo 💡 Press Ctrl+C to stop the server
echo.
echo 📖 After the server starts, open photography.html in your browser
echo.

npm start
