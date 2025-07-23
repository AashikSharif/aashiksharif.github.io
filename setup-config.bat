@echo off
echo 🎨 Photography Portfolio Configuration Setup
echo ============================================
echo.

REM Check if config.js already exists
if exist "js\config.js" (
    echo ⚠️  config.js already exists!
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        pause
        exit /b 1
    )
)

REM Copy template to config
if exist "js\config.template.js" (
    copy "js\config.template.js" "js\config.js" >nul
    echo ✅ Copied template to config.js
) else (
    echo ❌ config.template.js not found!
    pause
    exit /b 1
)

echo.
echo 🔧 Configuration Setup
echo Please enter your Cloudinary credentials:

REM Get user input
set /p cloud_name="Cloudinary Cloud Name: "
set /p api_key="Cloudinary API Key: "
set /p upload_preset="Cloudinary Upload Preset: "

echo.
echo 📸 Feature Configuration
set /p enable_upload="Enable photo uploads? (y/n): "
set /p enable_admin="Enable admin panel? (y/n): "

REM Convert y/n to boolean
if /i "%enable_upload%"=="y" (
    set enable_upload_bool=true
) else (
    set enable_upload_bool=false
)

if /i "%enable_admin%"=="y" (
    set enable_admin_bool=true
) else (
    set enable_admin_bool=false
)

REM Update config.js with user values using PowerShell
powershell -Command "(Get-Content 'js\config.js') -replace 'YOUR_CLOUDINARY_CLOUD_NAME', '%cloud_name%' -replace 'YOUR_CLOUDINARY_API_KEY', '%api_key%' -replace 'YOUR_UPLOAD_PRESET', '%upload_preset%' -replace 'enableUpload: false', 'enableUpload: %enable_upload_bool%' -replace 'enableAdmin: false', 'enableAdmin: %enable_admin_bool%' | Set-Content 'js\config.js'"

echo.
echo ✅ Configuration updated successfully!
echo.
echo 🔒 Security Check

REM Check if .gitignore includes config.js
findstr /C:"js/config.js" .gitignore >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Adding config.js to .gitignore
    echo js/config.js >> .gitignore
) else (
    echo ✅ config.js is in .gitignore
)

echo.
echo 🎉 Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Test your configuration by opening photography.html
echo 2. For admin access, add '?admin=true' to URL
echo 3. Upload your photos using the admin panel
echo.
echo 🔍 Troubleshooting:
echo - Check browser console for any errors
echo - Verify Cloudinary credentials in your dashboard
echo - Make sure config.js is never committed to git
echo.
echo 📖 For more help, see PHOTOGRAPHY_CONFIG_GUIDE.md
echo.
pause
