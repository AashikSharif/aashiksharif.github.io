#!/bin/bash

# Photography Portfolio - Cloudinary Setup Script
# This script helps you configure Cloudinary integration

echo "🎨 Photography Portfolio - Cloudinary Integration Setup"
echo "======================================================"
echo

# Get Cloudinary credentials
echo "Please enter your Cloudinary details:"
echo "(You can find these in your Cloudinary dashboard)"
echo

read -p "Cloud Name: " CLOUD_NAME
read -p "API Key: " API_KEY
read -s -p "API Secret: " API_SECRET
echo
echo

# Validate inputs
if [ -z "$CLOUD_NAME" ] || [ -z "$API_KEY" ] || [ -z "$API_SECRET" ]; then
    echo "❌ Error: All fields are required"
    exit 1
fi

echo "✅ Credentials collected"
echo

# Create config file (for reference only - don't commit this)
cat > .cloudinary-config << EOF
# Cloudinary Configuration
# WARNING: Keep this file private! Add to .gitignore
CLOUD_NAME=$CLOUD_NAME
API_KEY=$API_KEY
API_SECRET=$API_SECRET

# Base URLs for your images
CLOUDINARY_BASE_URL=https://res.cloudinary.com/$CLOUD_NAME/image/upload
THUMBNAIL_URL_TEMPLATE=\${CLOUDINARY_BASE_URL}/w_400,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
FULL_URL_TEMPLATE=\${CLOUDINARY_BASE_URL}/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
EOF

# Add to .gitignore if not already there
if [ ! -f .gitignore ] || ! grep -q ".cloudinary-config" .gitignore; then
    echo ".cloudinary-config" >> .gitignore
    echo "✅ Added .cloudinary-config to .gitignore"
fi

# Create example URL templates
echo "📋 Your Cloudinary URL templates:"
echo "================================="
echo
echo "Thumbnail URLs:"
echo "https://res.cloudinary.com/$CLOUD_NAME/image/upload/w_400,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg"
echo
echo "Full-size URLs:"
echo "https://res.cloudinary.com/$CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg"
echo
echo "Example for a nature photo named 'mountain-sunrise':"
echo "Thumbnail: https://res.cloudinary.com/$CLOUD_NAME/image/upload/w_400,f_auto,q_auto/portfolio/nature/mountain-sunrise.jpg"
echo "Full-size: https://res.cloudinary.com/$CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/portfolio/nature/mountain-sunrise.jpg"
echo

echo "📁 Next Steps:"
echo "=============="
echo "1. Create folders in Cloudinary Media Library:"
echo "   - portfolio/nature"
echo "   - portfolio/portraits" 
echo "   - portfolio/travel"
echo "   - portfolio/events"
echo
echo "2. Upload your images to the appropriate folders"
echo
echo "3. Update js/photography.js with your new image URLs"
echo
echo "4. Read CLOUDINARY_PHOTOGRAPHY_GUIDE.md for detailed instructions"
echo

echo "✅ Setup complete! Your configuration has been saved to .cloudinary-config"
echo "⚠️  Remember: Never commit API secrets to your repository!"
