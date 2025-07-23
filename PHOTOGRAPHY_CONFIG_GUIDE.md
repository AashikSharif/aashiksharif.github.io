# Photography Portfolio - Secure Configuration Setup Guide

## 🔐 Security Implementation

This guide explains how to set up secure configuration for your photography portfolio to keep sensitive API keys and secrets out of your git repository.

## 📁 Files Structure

```
js/
├── config.js          # ← Your actual config (NEVER commit this!)
├── config.template.js  # ← Template file (safe to commit)
├── photography.js      # ← Main functionality (updated to use config)
└── ...
```

## 🚀 Quick Setup

### Step 1: Configure Your Settings

1. **Copy the template file**:
   ```bash
   cp js/config.template.js js/config.js
   ```

2. **Edit `js/config.js`** with your actual values:
   ```javascript
   const PHOTOGRAPHY_CONFIG = {
       cloudinary: {
           cloudName: 'your-actual-cloudinary-name',
           apiKey: 'your-actual-api-key', 
           uploadPreset: 'your-actual-upload-preset'
       },
       // ... rest of config
   };
   ```

### Step 2: Enable Features

Update the feature flags in `config.js`:

```javascript
features: {
    enableUpload: true,  // Enable photo uploads
    enableAdmin: true,   // Enable admin interface
    enableLightbox: true,
    enableLazyLoading: true
}
```

### Step 3: Verify Security

✅ Check `.gitignore` includes:
```
js/config.js
config.js
.env
.env.local
```

## 🔧 Configuration Options

### Cloudinary Settings
```javascript
cloudinary: {
    cloudName: 'your-cloud-name',    // From Cloudinary dashboard
    apiKey: 'your-api-key',          // From Cloudinary dashboard  
    uploadPreset: 'your-preset'      // Create in Cloudinary settings
}
```

### Display Settings
```javascript
display: {
    photosPerPage: 20,        // Photos loaded at once
    defaultQuality: 'auto',   // Image quality
    thumbnailWidth: 400,      // Thumbnail size
    fullImageWidth: 1200      // Lightbox image size
}
```

### Album Configuration
```javascript
albums: {
    nature: {
        name: 'Nature & Landscapes',
        icon: 'fa-tree'
    },
    // Add more albums as needed
}
```

### Feature Flags
```javascript
features: {
    enableUpload: false,     // Photo upload functionality
    enableAdmin: false,      // Admin panel access
    enableLightbox: true,    // Photo lightbox
    enableLazyLoading: true  // Performance optimization
}
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep `config.js` in `.gitignore`
- Use environment variables for production
- Use signed uploads for production
- Implement proper authentication
- Regularly rotate API keys

### ❌ DON'T:
- Commit `config.js` to git
- Expose API secrets in frontend code
- Use unsigned uploads in production
- Hardcode sensitive values

## 🛠️ Development vs Production

### Development Mode
```javascript
// config.js for development
const PHOTOGRAPHY_CONFIG = {
    cloudinary: {
        cloudName: 'dev-cloud-name',
        apiKey: 'dev-api-key',
        uploadPreset: 'dev-preset'
    },
    features: {
        enableUpload: true,
        enableAdmin: true
    }
};
```

### Production Mode
```javascript
// For production, consider using environment variables
const PHOTOGRAPHY_CONFIG = {
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    },
    features: {
        enableUpload: false,  // Disable for security
        enableAdmin: false
    }
};
```

## 📝 Fallback Configuration

If `config.js` is missing, the system automatically uses demo mode:

```javascript
// Fallback configuration (photography.js)
this.config = {
    cloudinary: {
        cloudName: 'demo',
        apiKey: 'demo', 
        uploadPreset: 'demo'
    },
    display: {
        photosPerPage: 20,
        // ... defaults
    },
    features: {
        enableUpload: false,
        enableAdmin: false,
        enableLightbox: true,
        enableLazyLoading: true
    }
};
```

## 🔍 Troubleshooting

### Config not loading?
- Check console for error messages
- Verify `config.js` exists in `/js/` folder
- Ensure script is loaded before `photography.js`

### Upload not working?
- Check `features.enableUpload` is `true`
- Verify Cloudinary credentials
- Check browser console for errors

### Admin panel not showing?
- Set `features.enableAdmin` to `true`
- Use `?admin=true` in URL or set localStorage
- Check feature flags in config

## 📊 Monitoring

Add logging to track configuration status:

```javascript
// In photography.js constructor
console.log('Photography config loaded:', {
    cloudName: this.config.cloudinary.cloudName,
    featuresEnabled: this.config.features,
    photosPerPage: this.config.display.photosPerPage
});
```

## 🚀 Next Steps

1. **Set up Cloudinary account**
2. **Create and configure `config.js`**
3. **Test upload functionality**
4. **Enable admin features**
5. **Deploy securely**

---

**⚠️ Important**: Never commit sensitive configuration files to public repositories!
