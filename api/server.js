const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize cache (5 minute TTL by default)
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 300 });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['https://aashiksharif.github.io', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, file:// protocol, etc.)
        if (!origin) return callback(null, true);
        
        // Allow file:// origins (when opening HTML directly)
        if (origin === 'null') return callback(null, true);
        
        if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
            return callback(null, true);
        }
        
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    }
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        cloudinary: {
            configured: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
        }
    });
});

// Get photos from a specific folder
app.get('/api/photos/:folder', async (req, res) => {
    try {
        const { folder } = req.params;
        const cacheKey = `photos_${folder}`;
        
        // Check cache first
        const cachedPhotos = cache.get(cacheKey);
        if (cachedPhotos) {
            console.log(`📦 Cache hit for ${folder}`);
            return res.json({
                success: true,
                data: cachedPhotos,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log(`🔍 Fetching photos from photography_portfolio/${folder}`);
        
        // Search for images in the specified folder
        const searchResult = await cloudinary.search
            .expression(`folder:photography_portfolio/${folder}`)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .with_field('context')
            .with_field('metadata')
            .execute();
        
        console.log(`✅ Found ${searchResult.resources.length} images in ${folder}`);
        
        // Transform the results for frontend consumption
        const photos = searchResult.resources.map((resource, index) => ({
            id: `${folder.toLowerCase()}_${index + 1}`,
            publicId: resource.public_id,
            title: extractTitle(resource),
            category: folder.toLowerCase(),
            format: resource.format,
            width: resource.width,
            height: resource.height,
            bytes: resource.bytes,
            createdAt: resource.created_at,
            // Generate optimized URLs
            thumbnail: cloudinary.url(resource.public_id, {
                width: 400,
                height: 400,
                crop: 'fill',
                quality: 'auto:good',
                format: 'jpg',
                secure: true,
                version: resource.version
            }),
            full: cloudinary.url(resource.public_id, {
                width: 1200,
                quality: 'auto:best',
                format: 'jpg',
                secure: true,
                version: resource.version
            })
        }));
        
        // Cache the results
        cache.set(cacheKey, photos);
        
        res.json({
            success: true,
            data: photos,
            cached: false,
            count: photos.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error(`❌ Error fetching photos from ${req.params.folder}:`, error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get all photos from all folders
app.get('/api/photos', async (req, res) => {
    try {
        const folders = ['AwardWinning', 'PictureMix'];
        const cacheKey = 'all_photos';
        
        // Check cache first
        const cachedPhotos = cache.get(cacheKey);
        if (cachedPhotos) {
            console.log('📦 Cache hit for all photos');
            return res.json({
                success: true,
                data: cachedPhotos,
                cached: true,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('🔍 Fetching all photos from all folders');
        
        // Fetch photos from all folders
        const allPhotos = [];
        
        for (const folder of folders) {
            try {
                const searchResult = await cloudinary.search
                    .expression(`folder:photography_portfolio/${folder}`)
                    .sort_by('created_at', 'desc')
                    .max_results(100)
                    .with_field('context')
                    .with_field('metadata')
                    .execute();
                
                const folderPhotos = searchResult.resources.map((resource, index) => ({
                    id: `${folder.toLowerCase()}_${index + 1}`,
                    publicId: resource.public_id,
                    title: extractTitle(resource),
                    category: folder.toLowerCase(),
                    format: resource.format,
                    width: resource.width,
                    height: resource.height,
                    bytes: resource.bytes,
                    createdAt: resource.created_at,
                    thumbnail: cloudinary.url(resource.public_id, {
                        width: 400,
                        height: 400,
                        crop: 'fill',
                        quality: 'auto:good',
                        format: 'jpg',
                        secure: true,
                        version: resource.version
                    }),
                    full: cloudinary.url(resource.public_id, {
                        width: 1200,
                        quality: 'auto:best',
                        format: 'jpg',
                        secure: true,
                        version: resource.version
                    })
                }));
                
                allPhotos.push(...folderPhotos);
                console.log(`✅ Found ${folderPhotos.length} images in ${folder}`);
                
            } catch (folderError) {
                console.error(`❌ Error fetching from ${folder}:`, folderError.message);
            }
        }
        
        // Cache the results
        cache.set(cacheKey, allPhotos);
        
        res.json({
            success: true,
            data: allPhotos,
            cached: false,
            count: allPhotos.length,
            breakdown: folders.reduce((acc, folder) => {
                acc[folder] = allPhotos.filter(p => p.category === folder.toLowerCase()).length;
                return acc;
            }, {}),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error fetching all photos:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Clear cache endpoint (for development)
app.delete('/api/cache', (req, res) => {
    cache.flushAll();
    res.json({
        success: true,
        message: 'Cache cleared',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to verify URL generation
app.get('/api/test-urls', async (req, res) => {
    try {
        console.log('🔧 Testing URL generation...');
        
        // Get a few images to test URL generation
        const testResult = await cloudinary.search
            .expression('folder:photography_portfolio/AwardWinning OR folder:photography_portfolio/PictureMix')
            .sort_by('created_at', 'desc')
            .max_results(3)
            .execute();
        
        const testUrls = testResult.resources.map(resource => ({
            public_id: resource.public_id,
            version: resource.version,
            secure_url: resource.secure_url,
            thumbnail_generated: cloudinary.url(resource.public_id, {
                width: 400,
                height: 400,
                crop: 'fill',
                quality: 'auto:good',
                format: 'jpg',
                secure: true,
                version: resource.version
            }),
            full_generated: cloudinary.url(resource.public_id, {
                width: 1200,
                quality: 'auto:best',
                format: 'jpg',
                secure: true,
                version: resource.version
            })
        }));
        
        res.json({
            success: true,
            test_urls: testUrls,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Test URL error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test endpoint to verify URL generation
app.get('/api/test-urls', async (req, res) => {
    try {
        console.log('🔧 Testing URL generation...');
        
        // Get a few images to test URL generation
        const testResult = await cloudinary.search
            .expression('folder:photography_portfolio/AwardWinning OR folder:photography_portfolio/PictureMix')
            .sort_by('created_at', 'desc')
            .max_results(3)
            .execute();
        
        const testUrls = testResult.resources.map(resource => ({
            public_id: resource.public_id,
            version: resource.version,
            secure_url: resource.secure_url,
            thumbnail_generated: cloudinary.url(resource.public_id, {
                width: 400,
                height: 400,
                crop: 'fill',
                quality: 'auto:good',
                format: 'auto',
                version: resource.version
            }),
            full_generated: cloudinary.url(resource.public_id, {
                width: 1200,
                quality: 'auto:best',
                format: 'auto',
                version: resource.version
            })
        }));
        
        res.json({
            success: true,
            test_urls: testUrls,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Test URL error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Helper function to extract title from Cloudinary resource
function extractTitle(resource) {
    // Try context title first
    if (resource.context && resource.context.title) {
        return resource.context.title;
    }
    
    // Try context alt text
    if (resource.context && resource.context.alt) {
        return resource.context.alt;
    }
    
    // Try metadata
    if (resource.metadata && resource.metadata.title) {
        return resource.metadata.title;
    }
    
    // Fall back to formatted filename
    const filename = resource.public_id.split('/').pop();
    return filename
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Photography API Server running on port ${PORT}`);
    console.log(`📸 Cloudinary configured: ${!!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)}`);
    console.log(`🔒 CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`💾 Cache TTL: ${process.env.CACHE_TTL || 300} seconds`);
});
