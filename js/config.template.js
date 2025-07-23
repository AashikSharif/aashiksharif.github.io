/**
 * Photography Portfolio Configuration Template
 * Copy this file to 'config.js' and update with your actual values
 * DO NOT commit config.js to git - add it to .gitignore
 */

// Cloudinary Configuration
const PHOTOGRAPHY_CONFIG = {
    cloudinary: {
        cloudName: 'YOUR_CLOUDINARY_CLOUD_NAME', // Get this from your Cloudinary dashboard
        apiKey: 'YOUR_CLOUDINARY_API_KEY', // Get this from your Cloudinary dashboard
        uploadPreset: 'YOUR_UPLOAD_PRESET', // Create this in Cloudinary settings
        // Note: API secret should never be exposed in frontend code
    },
    
    // Photo display settings
    display: {
        photosPerPage: 20,
        defaultQuality: 'auto',
        thumbnailWidth: 400,
        fullImageWidth: 1200
    },
    
    // Album configuration
    albums: {
        nature: {
            name: 'Nature & Landscapes',
            icon: 'fa-tree'
        },
        portraits: {
            name: 'Portraits',
            icon: 'fa-user'
        },
        travel: {
            name: 'Travel',
            icon: 'fa-plane'
        },
        events: {
            name: 'Events',
            icon: 'fa-calendar'
        }
    },
    
    // Feature flags
    features: {
        enableUpload: false, // Set to true to enable upload functionality
        enableAdmin: false,  // Set to true to enable admin features
        enableLightbox: true,
        enableLazyLoading: true
    }
};

// Make config available globally (only in browser environment)
if (typeof window !== 'undefined') {
    window.PHOTOGRAPHY_CONFIG = PHOTOGRAPHY_CONFIG;
}
