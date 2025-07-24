/**
 * Photography Portfolio - Dynamic Implementation with Cloudinary API
 * Modern vanilla JavaScript with proper masonry grid layout
 */

class PhotographyPortfolio {
    constructor() {
        this.categories = ['all', 'awardwinning', 'picturemix'];
        this.photos = [];
        this.filteredPhotos = [];
        this.currentCategory = 'all';
        this.lightboxIndex = 0;
        
        // Add caching system
        this.photoCache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        
        // Cache for image dimensions to avoid repeated loading
        this.dimensionsCache = new Map();
        
        // Initialize asynchronously 
        this.init().catch(error => {
            console.error('Failed to initialize photography portfolio:', error);
        });
    }

    async init() {
        await this.loadPhotos();
        this.setupEventListeners();
        
        // Check for URL parameters to auto-select category
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam && this.categories.includes(categoryParam)) {
            this.currentCategory = categoryParam;
            this.updateActiveTab();
            await this.filterPhotos();
        }
    }

    async loadPhotos() {
        try {
            this.photos = [];
            
            console.log('🔗 Loading photos via API...');
            
            // Debug delay - commented out for production
            // await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
            
            // Fetch all photos from API server
            const apiUrl = window.CLOUDINARY_CONFIG?.apiServer?.current || 'http://localhost:3001';
            
            // Add a timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${apiUrl}/api/photos`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API request failed');
            }
            
            this.photos = result.data;
            console.log(`✅ Loaded ${this.photos.length} photos via API`);
            console.log('📊 Breakdown:', result.breakdown);
            
            if (result.cached) {
                console.log('📦 Data served from cache');
            }
            
            console.log('🔄 Starting photo filtering and rendering...');
            // Debug delay - commented out for production  
            // await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
            console.log('📊 Breakdown:', result.breakdown);
            
            if (result.cached) {
                console.log('📦 Data served from cache');
            }
            
            await this.filterPhotos();
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('⏱️ API request timed out - server may not be running');
            } else {
                console.error('❌ Error loading photos via API:', error);
            }
            console.log('🔄 Falling back to sample photos...');
            this.loadSamplePhotos();
        }
    }

    // Method to fetch photos for a specific category via API
    async fetchCategoryPhotos(category) {
        try {
            console.log(`🔗 Fetching ${category} photos via API...`);
            
            const apiUrl = window.CLOUDINARY_CONFIG?.apiServer?.current || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/photos/${category}`);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'API request failed');
            }
            
            console.log(`✅ Loaded ${result.data.length} photos from ${category} category`);
            return result.data;
            
        } catch (error) {
            console.error(`❌ Error fetching ${category} photos:`, error);
            return [];
        }
    }

    // Fallback method for when API fails
    loadSamplePhotos() {
        console.log('🎨 Loading sample photos as fallback...');
        // Sample photos with Cloudinary-style URLs for testing
        this.photos = [
            // Extremely varied aspect ratios for testing
            {
                id: 1,
                title: 'Very Wide Landscape',
                category: 'awardwinning',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample1.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample1.jpg',
                // Ultra-wide landscape for testing
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format&q=90'
            },
            {
                id: 2,
                title: 'Perfect Square',
                category: 'awardwinning',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample2.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample2.jpg',
                // Perfect square for testing
                url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop&auto=format&q=90'
            },
            {
                id: 3,
                title: 'Very Tall Portrait',
                category: 'awardwinning',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample3.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample3.jpg',
                // Very tall portrait for testing
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=1200&fit=crop&auto=format&q=90'
            },
            {
                id: 4,
                title: 'Normal Landscape',
                category: 'picturemix',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample4.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample4.jpg',
                // Normal landscape for testing
                url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&auto=format&q=90'
            },
            {
                id: 5,
                title: 'Almost Square',
                category: 'picturemix',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample5.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample5.jpg',
                // Almost square for testing
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=800&fit=crop&auto=format&q=90'
            },
            {
                id: 6,
                title: 'Ultra Wide Panorama',
                category: 'picturemix',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample6.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample6.jpg',
                // Ultra wide panorama for testing
                url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&h=500&fit=crop&auto=format&q=90'
            },
            {
                id: 7,
                title: 'Regular Portrait',
                category: 'picturemix',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample7.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample7.jpg',
                // Regular portrait for testing
                url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=900&fit=crop&auto=format&q=90'
            },
            {
                id: 8,
                title: 'Another Square',
                category: 'awardwinning',
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_400,q_auto:good,w_400/v1/sample8.jpg',
                full: 'https://res.cloudinary.com/demo/image/upload/v1/sample8.jpg',
                // Another perfect square for testing
                url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=700&h=700&fit=crop&auto=format&q=90'
            }
        ];

        console.log(`📊 Loaded ${this.photos.length} sample photos for testing`);
        
        // Shuffle the photos array to ensure random distribution
        this.photos = this.shuffleArray(this.photos);
        
        // Note: filterPhotos is called async, but we don't await here to avoid blocking
        this.filterPhotos().catch(error => {
            console.error('Error filtering photos:', error);
        });
    }

    // Helper function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Photo clicks for lightbox (delegated)
        document.getElementById('photoGrid').addEventListener('click', (e) => {
            const photoItem = e.target.closest('.photo-item');
            if (photoItem) {
                const index = parseInt(photoItem.dataset.index);
                this.openLightbox(index);
            }
        });

        // Lightbox events
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateLightbox(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.navigateLightbox(-1);
                        break;
                    case 'ArrowRight':
                        this.navigateLightbox(1);
                        break;
                }
            }
        });

        // Window resize handler with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Re-render photos to adjust column count
                this.renderPhotos().catch(error => {
                    console.error('Error re-rendering photos on resize:', error);
                });
            }, 250);
        });

        console.log('Event listeners set up');
        
        // Add debug method to global scope for testing
        window.debugPhotos = () => {
            this.renderPhotos().catch(error => {
                console.error('Error in debug photo render:', error);
            });
        };
    }

    async filterByCategory(category) {
        if (!this.categories.includes(category)) return;
        
        this.currentCategory = category;
        this.updateActiveTab();
        await this.filterPhotos();
        
        // Update URL without page reload
        const newUrl = category === 'all' ? 
            window.location.pathname : 
            `${window.location.pathname}?category=${category}`;
        window.history.replaceState({}, '', newUrl);
    }

    updateActiveTab() {
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }

    async filterPhotos() {
        if (this.currentCategory === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === this.currentCategory);
        }
        
        await this.renderPhotos();
        console.log(`Filtered ${this.filteredPhotos.length} photos for category: ${this.currentCategory}`);
    }

    async renderPhotos() {
        const grid = document.getElementById('photoGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        // Create columns based on screen size
        const getColumnCount = () => {
            return window.innerWidth >= 768 ? 4 : 2;
        };

        const columnCount = getColumnCount();
        const columns = [];

        // Create column containers
        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'photo-column';
            columns.push(column);
            grid.appendChild(column);
        }

        // Get original dimensions for all images first
        const imageData = await this.getImageDimensions(this.filteredPhotos);
        
        // Calculate column width (assuming equal width columns with some padding)
        const gridWidth = grid.offsetWidth;
        const columnWidth = Math.floor(gridWidth / columnCount) - 20; // Account for padding/margins
        
        // Track column heights for distribution
        const columnHeights = new Array(columnCount).fill(0);
        
        // Distribute photos to column with least total height
        this.filteredPhotos.forEach((photo, index) => {
            const dimensions = imageData[index];
            
            // Calculate the height this image would take in the column
            let projectedHeight;
            if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
                const aspectRatio = dimensions.width / dimensions.height;
                projectedHeight = columnWidth / aspectRatio;
            } else {
                // Fallback to average height if dimensions unavailable
                projectedHeight = 300;
            }
            
            // Find column with minimum height
            const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
            
            // Add photo to the shortest column
            const photoElement = this.createPhotoElement(photo, index);
            columns[minHeightIndex].appendChild(photoElement);
            
            // Update column height tracking
            columnHeights[minHeightIndex] += projectedHeight + 10; // Add some margin
        });

        console.log(`✅ Distributed ${this.filteredPhotos.length} photos across ${columnCount} columns by height`);
    }

    // Method to get original dimensions for all images
    async getImageDimensions(photos) {
        const dimensionPromises = photos.map(async (photo, index) => {
            // Check if dimensions are already cached
            const cacheKey = photo.id || photo.url || photo.thumbnail;
            if (this.dimensionsCache.has(cacheKey)) {
                return this.dimensionsCache.get(cacheKey);
            }
            
            return new Promise((resolve) => {
                // Get the original Cloudinary URL without transformations for true dimensions
                let originalUrl;
                if (photo.full) {
                    originalUrl = this.getOriginalCloudinaryUrl(photo.full);
                } else if (photo.url) {
                    originalUrl = this.getOriginalCloudinaryUrl(photo.url);
                } else if (photo.thumbnail) {
                    originalUrl = this.getOriginalCloudinaryUrl(photo.thumbnail);
                } else {
                    console.error(`❌ No URL found for photo ${index + 1}`);
                    const result = { width: 0, height: 0, error: 'No URL' };
                    this.dimensionsCache.set(cacheKey, result);
                    resolve(result);
                    return;
                }
                
                const img = new Image();
                
                // Set a timeout to prevent hanging
                const timeout = setTimeout(() => {
                    const result = { width: 0, height: 0, error: 'Timeout' };
                    this.dimensionsCache.set(cacheKey, result);
                    resolve(result);
                }, 3000);
                
                img.onload = () => {
                    clearTimeout(timeout);
                    const result = { 
                        width: img.naturalWidth, 
                        height: img.naturalHeight,
                        aspectRatio: img.naturalWidth / img.naturalHeight
                    };
                    // Cache the result
                    this.dimensionsCache.set(cacheKey, result);
                    resolve(result);
                };
                
                img.onerror = () => {
                    clearTimeout(timeout);
                    
                    // Try fallback URL if available
                    if (photo.url && originalUrl !== photo.url) {
                        img.src = photo.url;
                    } else {
                        const result = { width: 0, height: 0, error: 'Load failed' };
                        this.dimensionsCache.set(cacheKey, result);
                        resolve(result);
                    }
                };
                
                img.src = originalUrl;
            });
        });
        
        const dimensions = await Promise.all(dimensionPromises);
        
        return dimensions;
    }

    // Helper function to extract original Cloudinary URL from thumbnail URL
    getOriginalCloudinaryUrl(url) {
        if (!url || !url.includes('cloudinary.com')) {
            // If it's not a Cloudinary URL, return as-is
            return url;
        }
        
        try {
            // Cloudinary URL patterns to handle various transformation formats:
            // https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/v{version}/{public_id}.{format}
            // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            
            // More flexible pattern that handles multiple transformation segments
            const cloudinaryPattern = /(https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/)(?:[^\/]+\/)*?(v\d+\/[^\/]+\.[a-zA-Z]+)$/;
            const match = url.match(cloudinaryPattern);
            
            if (match) {
                // Reconstruct URL without transformations: base + version/public_id
                const originalUrl = match[1] + match[2];
                return originalUrl;
            } else {
                return url;
            }
        } catch (error) {
            return url;
        }
    }

    createPhotoElement(photo, index) {
        const photoElement = document.createElement('div');
        photoElement.className = 'photo-item natural'; // Start with natural as default
        photoElement.dataset.index = index;
        
        // Create placeholder with Flowbite-style design
        const placeholder = document.createElement('div');
        placeholder.className = 'photo-placeholder';
        placeholder.innerHTML = `
            <svg class="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
            <span class="sr-only">Loading...</span>
        `;
        
        // Create image element for display (using thumbnail for performance)
        const img = document.createElement('img');
        img.src = photo.thumbnail || photo.url;
        img.alt = photo.title;
        img.loading = 'lazy';
        
        // Create hidden image to get original dimensions
        const originalImg = new Image();
        // Get the original Cloudinary URL without transformations for true dimensions
        let originalUrl;
        if (photo.full) {
            originalUrl = this.getOriginalCloudinaryUrl(photo.full);
        } else if (photo.url) {
            originalUrl = this.getOriginalCloudinaryUrl(photo.url);
        } else if (photo.thumbnail) {
            originalUrl = this.getOriginalCloudinaryUrl(photo.thumbnail);
        } else {
            console.error(`❌ No URL found for photo ${index + 1}`);
            originalUrl = '';
        }
        
        // Load original image to get true dimensions
        originalImg.onload = () => {
            // Detect if image has equal dimensions (square) or not using ORIGINAL dimensions
            const aspectRatio = originalImg.naturalWidth / originalImg.naturalHeight;
            
            // Remove any existing orientation classes
            photoElement.classList.remove('square', 'natural');
            
            // Check if dimensions are equal (or very close to equal)
            if (Math.abs(aspectRatio - 1.0) < 0.05) {
                // Square image (within 5% tolerance)
                photoElement.classList.add('square');
                
                // For square images, make the container square
                const containerWidth = photoElement.offsetWidth || photoElement.parentElement.offsetWidth;
                if (containerWidth > 0) {
                    photoElement.style.setProperty('height', `${containerWidth}px`, 'important');
                }
                
                // Add debug overlay for square images
                const debugOverlay = document.createElement('div');
                debugOverlay.style.cssText = `
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    background: rgba(59,130,246,0.9);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-family: monospace;
                    z-index: 10;
                    pointer-events: none;
                `;
                debugOverlay.textContent = `SQ ${originalImg.naturalWidth}×${originalImg.naturalHeight}`;
                photoElement.appendChild(debugOverlay);
            } else {
                // Natural dimensions for all non-square images
                photoElement.classList.add('natural');
                
                // Use a more robust delay to ensure container is properly sized
                setTimeout(() => {
                    // Calculate the height needed to maintain natural aspect ratio
                    // Get the current width of the container (should be full column width)
                    const containerWidth = photoElement.offsetWidth;
                    
                    if (containerWidth > 0) {
                        const naturalHeight = containerWidth / aspectRatio;
                        
                        // Force set the container height to match the natural aspect ratio
                        // Use setProperty with important to override any CSS
                        photoElement.style.setProperty('height', `${naturalHeight}px`, 'important');
                        
                        // Add debug overlay to show dimensions
                        const debugOverlay = document.createElement('div');
                        debugOverlay.style.cssText = `
                            position: absolute;
                            top: 5px;
                            left: 5px;
                            background: rgba(16,185,129,0.9);
                            color: white;
                            padding: 2px 6px;
                            border-radius: 3px;
                            font-size: 10px;
                            font-family: monospace;
                            z-index: 10;
                            pointer-events: none;
                        `;
                        debugOverlay.textContent = `NAT ${originalImg.naturalWidth}×${originalImg.naturalHeight} → ${containerWidth}×${Math.round(naturalHeight)}`;
                        photoElement.appendChild(debugOverlay);
                    } else {
                        // Retry after a longer delay
                        setTimeout(() => {
                            const retryWidth = photoElement.offsetWidth;
                            if (retryWidth > 0) {
                                const retryHeight = retryWidth / aspectRatio;
                                photoElement.style.setProperty('height', `${retryHeight}px`, 'important');
                            }
                        }, 200);
                    }
                }, 100); // Increased delay for better reliability
            }
        };
        
        originalImg.onerror = () => {
            // If the original Cloudinary URL fails, try the fallback URL
            if (photo.url && originalUrl !== photo.url) {
                originalImg.src = photo.url;
            } else {
                // Fallback to natural class if we can't get original dimensions
                photoElement.classList.remove('square', 'natural');
                photoElement.classList.add('natural');
            }
        };
        
        // Start loading the original image for dimension calculation
        originalImg.src = originalUrl;
        
        // Handle thumbnail image load (for display)
        img.addEventListener('load', () => {
            photoElement.classList.add('image-loaded');
            // Hide placeholder once image is loaded
            placeholder.style.display = 'none';
        });
        
        img.addEventListener('error', () => {
            placeholder.innerHTML = `
                <svg class="w-10 h-10 text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
                <span class="text-red-500 text-sm mt-2">Failed to load</span>
            `;
            placeholder.style.backgroundColor = '#fef2f2';
            placeholder.style.display = 'flex';
        });
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            color: white;
            padding: 20px 15px 15px;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            z-index: 10;
        `;
        overlay.innerHTML = `<h4 style="margin: 0; font-size: 14px; font-weight: 500;">${photo.title}</h4>`;
        
        // Add hover effects
        photoElement.addEventListener('mouseenter', () => {
            overlay.style.transform = 'translateY(0)';
        });
        
        photoElement.addEventListener('mouseleave', () => {
            overlay.style.transform = 'translateY(100%)';
        });
        
        // Add elements to photo item
        photoElement.appendChild(placeholder);
        photoElement.appendChild(img);
        photoElement.appendChild(overlay);
        
        return photoElement;
    }

    openLightbox(index) {
        this.lightboxIndex = index;
        const photo = this.filteredPhotos[index];
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxContent = document.querySelector('.lightbox-content');
        
        // Create placeholder for lightbox if it doesn't exist
        let lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
        if (!lightboxPlaceholder) {
            lightboxPlaceholder = document.createElement('div');
            lightboxPlaceholder.id = 'lightboxPlaceholder';
            lightboxPlaceholder.className = 'lightbox-placeholder';
            lightboxPlaceholder.innerHTML = ''; // No text, just visual placeholder
            lightboxContent.appendChild(lightboxPlaceholder);
        }
        
        if (lightboxImg) {
            // Show placeholder and hide image initially
            lightboxPlaceholder.style.display = 'flex';
            lightboxImg.style.opacity = '0';
            
            // Set up image loading
            const fullImageUrl = photo.full || photo.url || photo.thumbnail;
            
            const handleImageLoad = () => {
                lightboxImg.style.opacity = '1';
                lightboxPlaceholder.style.display = 'none';
            };
            
            const handleImageError = () => {
                lightboxPlaceholder.innerHTML = '<span>❌ Failed to load full resolution</span>';
                lightboxPlaceholder.style.backgroundColor = '#3a2a2a';
                lightboxPlaceholder.style.color = '#ff6b6b';
            };
            
            // Check if image is already loaded
            if (lightboxImg.src === fullImageUrl && lightboxImg.complete) {
                handleImageLoad();
            } else {
                lightboxImg.addEventListener('load', handleImageLoad, { once: true });
                lightboxImg.addEventListener('error', handleImageError, { once: true });
                lightboxImg.src = fullImageUrl;
            }
        }
        
        if (lightbox) {
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }
    }

    navigateLightbox(direction) {
        this.lightboxIndex += direction;
        
        if (this.lightboxIndex < 0) {
            this.lightboxIndex = this.filteredPhotos.length - 1;
        } else if (this.lightboxIndex >= this.filteredPhotos.length) {
            this.lightboxIndex = 0;
        }
        
        const photo = this.filteredPhotos[this.lightboxIndex];
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
        
        if (lightboxImg && lightboxPlaceholder) {
            // Show placeholder and hide image initially
            lightboxPlaceholder.style.display = 'flex';
            lightboxPlaceholder.innerHTML = ''; // No text, just visual placeholder
            lightboxPlaceholder.style.backgroundColor = '#2a2a2a';
            lightboxPlaceholder.style.color = '#999';
            lightboxImg.style.opacity = '0';
            
            const fullImageUrl = photo.full || photo.url || photo.thumbnail;
            
            const handleImageLoad = () => {
                lightboxImg.style.opacity = '1';
                lightboxPlaceholder.style.display = 'none';
            };
            
            const handleImageError = () => {
                lightboxPlaceholder.innerHTML = '<span>❌ Failed to load full resolution</span>';
                lightboxPlaceholder.style.backgroundColor = '#3a2a2a';
                lightboxPlaceholder.style.color = '#ff6b6b';
            };
            
            // Remove previous event listeners
            lightboxImg.removeEventListener('load', handleImageLoad);
            lightboxImg.removeEventListener('error', handleImageError);
            
            // Add new event listeners
            lightboxImg.addEventListener('load', handleImageLoad, { once: true });
            lightboxImg.addEventListener('error', handleImageError, { once: true });
            
            // Set new image source
            lightboxImg.src = fullImageUrl;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyPortfolio();
});
