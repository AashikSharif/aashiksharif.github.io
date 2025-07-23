#!/bin/bash

# Photography Portfolio Configuration Setup Script
# This script helps you set up secure configuration for your photography portfolio

echo "🎨 Photography Portfolio Configuration Setup"
echo "============================================"
echo

# Check if config.js already exists
if [ -f "js/config.js" ]; then
    echo "⚠️  config.js already exists!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy template to config
if [ -f "js/config.template.js" ]; then
    cp js/config.template.js js/config.js
    echo "✅ Copied template to config.js"
else
    echo "❌ config.template.js not found!"
    exit 1
fi

echo
echo "🔧 Configuration Setup"
echo "Please enter your Cloudinary credentials:"

# Get user input
read -p "Cloudinary Cloud Name: " cloud_name
read -p "Cloudinary API Key: " api_key
read -p "Cloudinary Upload Preset: " upload_preset

echo
echo "📸 Feature Configuration"
read -p "Enable photo uploads? (y/n): " -n 1 -r enable_upload
echo
read -p "Enable admin panel? (y/n): " -n 1 -r enable_admin
echo

# Convert y/n to boolean
if [[ $enable_upload =~ ^[Yy]$ ]]; then
    enable_upload_bool="true"
else
    enable_upload_bool="false"
fi

if [[ $enable_admin =~ ^[Yy]$ ]]; then
    enable_admin_bool="true"
else
    enable_admin_bool="false"
fi

# Update config.js with user values
sed -i.bak \
    -e "s/YOUR_CLOUDINARY_CLOUD_NAME/$cloud_name/g" \
    -e "s/YOUR_CLOUDINARY_API_KEY/$api_key/g" \
    -e "s/YOUR_UPLOAD_PRESET/$upload_preset/g" \
    -e "s/enableUpload: false/enableUpload: $enable_upload_bool/g" \
    -e "s/enableAdmin: false/enableAdmin: $enable_admin_bool/g" \
    js/config.js

# Remove backup file
rm js/config.js.bak 2>/dev/null

echo
echo "✅ Configuration updated successfully!"
echo
echo "🔒 Security Check"

# Check if .gitignore includes config.js
if grep -q "js/config.js" .gitignore; then
    echo "✅ config.js is in .gitignore"
else
    echo "⚠️  Adding config.js to .gitignore"
    echo "js/config.js" >> .gitignore
fi

echo
echo "🎉 Setup Complete!"
echo
echo "📋 Next Steps:"
echo "1. Test your configuration by opening photography.html"
echo "2. For admin access, add '?admin=true' to URL"
echo "3. Upload your photos using the admin panel"
echo
echo "🔍 Troubleshooting:"
echo "- Check browser console for any errors"
echo "- Verify Cloudinary credentials in your dashboard"
echo "- Make sure config.js is never committed to git"
echo
echo "📖 For more help, see PHOTOGRAPHY_CONFIG_GUIDE.md"
