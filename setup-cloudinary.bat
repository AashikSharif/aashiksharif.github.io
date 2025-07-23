@echo off
:: Photography Portfolio - Cloudinary Setup Script
:: This script helps you configure Cloudinary integration

echo 🎨 Photography Portfolio - Cloudinary Integration Setup
echo ======================================================
echo.

:: Get Cloudinary credentials
echo Please enter your Cloudinary details:
echo (You can find these in your Cloudinary dashboard)
echo.

set /p CLOUD_NAME="Cloud Name: "
set /p API_KEY="API Key: "
set /p API_SECRET="API Secret: "
echo.

:: Validate inputs
if "%CLOUD_NAME%"=="" (
    echo ❌ Error: Cloud Name is required
    pause
    exit /b 1
)
if "%API_KEY%"=="" (
    echo ❌ Error: API Key is required
    pause
    exit /b 1
)
if "%API_SECRET%"=="" (
    echo ❌ Error: API Secret is required
    pause
    exit /b 1
)

echo ✅ Credentials collected
echo.

:: Create config file (for reference only - don't commit this)
(
echo # Cloudinary Configuration
echo # WARNING: Keep this file private! Add to .gitignore
echo CLOUD_NAME=%CLOUD_NAME%
echo API_KEY=%API_KEY%
echo API_SECRET=%API_SECRET%
echo.
echo # Base URLs for your images
echo CLOUDINARY_BASE_URL=https://res.cloudinary.com/%CLOUD_NAME%/image/upload
echo THUMBNAIL_URL_TEMPLATE=${CLOUDINARY_BASE_URL}/w_400,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
echo FULL_URL_TEMPLATE=${CLOUDINARY_BASE_URL}/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
) > .cloudinary-config

:: Add to .gitignore if not already there
if not exist .gitignore (
    echo .cloudinary-config > .gitignore
    echo ✅ Created .gitignore and added .cloudinary-config
) else (
    findstr /C:".cloudinary-config" .gitignore >nul
    if errorlevel 1 (
        echo .cloudinary-config >> .gitignore
        echo ✅ Added .cloudinary-config to .gitignore
    )
)

:: Display URL templates
echo 📋 Your Cloudinary URL templates:
echo =================================
echo.
echo Thumbnail URLs:
echo https://res.cloudinary.com/%CLOUD_NAME%/image/upload/w_400,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
echo.
echo Full-size URLs:
echo https://res.cloudinary.com/%CLOUD_NAME%/image/upload/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
echo.
echo Example for a nature photo named 'mountain-sunrise':
echo Thumbnail: https://res.cloudinary.com/%CLOUD_NAME%/image/upload/w_400,f_auto,q_auto/portfolio/nature/mountain-sunrise.jpg
echo Full-size: https://res.cloudinary.com/%CLOUD_NAME%/image/upload/w_1200,f_auto,q_auto/portfolio/nature/mountain-sunrise.jpg
echo.

echo 📁 Next Steps:
echo ==============
echo 1. Create folders in Cloudinary Media Library:
echo    - portfolio/nature
echo    - portfolio/portraits
echo    - portfolio/travel
echo    - portfolio/events
echo.
echo 2. Upload your images to the appropriate folders
echo.
echo 3. Update js/photography.js with your new image URLs
echo.
echo 4. Read CLOUDINARY_PHOTOGRAPHY_GUIDE.md for detailed instructions
echo.

echo ✅ Setup complete! Your configuration has been saved to .cloudinary-config
echo ⚠️  Remember: Never commit API secrets to your repository!
echo.
pause
