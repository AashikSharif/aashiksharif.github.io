/**
 * Photography Portfolio JavaScript
 * Enhanced with multi-provider support, lazy loading, and secure upload functionality
 */

class PhotoPortfolio {
    constructor() {
        this.loadConfiguration();
        
        this.currentAlbum = 'all';
        this.currentPage = 1;
        this.photosPerPage = this.config?.display?.photosPerPage || 12;
        this.allPhotos = [];
        this.displayedPhotos = [];
        this.lightboxIndex = 0;
        this.isLoading = false;
        this.hasMorePhotos = true;
        
        // Initialize photography service for multi-provider support
        // Check if PhotographyService exists, otherwise use fallback
        if (window.PhotographyService) {
            this.photographyService = new window.PhotographyService();
        } else {
            console.warn('PhotographyService not available, using fallback mode');
            this.photographyService = null;
        }
        
        this.init();
    }
    
    loadConfiguration() {
        if (typeof window !== 'undefined' && window.PHOTOGRAPHY_CONFIG) {
            this.config = window.PHOTOGRAPHY_CONFIG;
        } else {
            console.warn('Photography config not found. Using demo mode.');
            this.config = {
                activeProvider: 'cloudinary',
                providers: {
                    cloudinary: {
                        cloudName: 'demo',
                        uploadPreset: 'demo'
                    }
                },
                display: {
                    photosPerPage: 12,
                    defaultQuality: 'auto',
                    thumbnailWidth: 400,
                    fullImageWidth: 1200,
                    lazyLoadOffset: 100
                },
                features: {
                    enableUpload: false,
                    enableAdmin: false,
                    enableLightbox: true,
                    enableLazyLoading: false,
                    infiniteScroll: true
                },
                albums: {
                    nature: { name: 'Nature & Landscapes', icon: 'fa-tree' },
                    portraits: { name: 'Portraits', icon: 'fa-user' },
                    travel: { name: 'Travel', icon: 'fa-plane' },
                    events: { name: 'Events', icon: 'fa-calendar' }
                }
            };
        }
    }
    
    init() {
        this.bindEvents();
        this.initLazyLoading();
        this.loadPhotos();
        this.checkAdminAccess();
        this.setupInfiniteScroll();
        
        // Check for URL parameters to auto-select category
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam && this.categories.includes(categoryParam)) {
            this.currentCategory = categoryParam;
            this.updateActiveTab();
            this.filterPhotos(categoryParam);
        }
    }
    
    bindEvents() {
        // Album tab switching
        $('.album-tab').on('click', (e) => {
            const album = $(e.target).data('album');
            this.switchAlbum(album);
        });
        
        // Load more button
        $('#loadMoreBtn').on('click', () => {
            this.loadMorePhotos();
        });
        
        // Lightbox events
        $('#lightbox').on('click', (e) => {
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });
        
        $('#lightboxClose').on('click', () => {
            this.closeLightbox();
        });
        
        $('#lightboxPrev').on('click', () => {
            this.navigateLightbox(-1);
        });
        
        $('#lightboxNext').on('click', () => {
            this.navigateLightbox(1);
        });
        
        // Keyboard navigation
        $(document).on('keydown', (e) => {
            if ($('#lightbox').is(':visible')) {
                switch(e.key) {
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
        
        // Upload form
        $('#uploadForm').on('submit', (e) => {
            e.preventDefault();
            this.handlePhotoUpload();
        });
        
        // Photo click events (delegated)
        $('#photoGrid').on('click', '.photo-item', (e) => {
            const index = $(e.currentTarget).data('index');
            this.openLightbox(index);
        });
        
        // Responsive layout
        $(window).on('resize', () => {
            this.updateGridLayout();
        });
    }
    
    setupInfiniteScroll() {
        if (!this.config.features.infiniteScroll) return;
        
        $(window).on('scroll', () => {
            if (this.isLoading || !this.hasMorePhotos) return;
            
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const documentHeight = $(document).height();
            
            // Load more when 200px from bottom
            if (scrollTop + windowHeight >= documentHeight - 200) {
                this.loadMorePhotos();
            }
        });
    }
    
    initLazyLoading() {
        if (!this.config.features.enableLazyLoading) return;
        
        if ('IntersectionObserver' in window) {
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            this.lazyLoadObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: `${this.config.display.lazyLoadOffset || 100}px`
            });
        }
    }
    
    async loadPhotos() {
        try {
            this.isLoading = true;
            $('#loading').show();
            $('#photoGrid').hide();
            
            // Reset state for new load
            this.currentPage = 1;
            this.allPhotos = [];
            this.displayedPhotos = [];
            
            // Load photos from active provider
            this.allPhotos = await this.fetchPhotosFromProvider();
            
            this.filterAndDisplayPhotos();
            this.updatePhotoCounts();
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showError('Failed to load photos. Please try again later.');
        } finally {
            this.isLoading = false;
            $('#loading').hide();
        }
    }
    
    async fetchPhotosFromProvider() {
        // Sample photos with natural aspect ratios (more photos for better grid demonstration)
        const samplePhotos = [
            // Nature & Landscapes - Mixed aspect ratios for better masonry demo
            {
                id: 'nature_1',
                title: 'Mountain Sunrise',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90',
                uploadedAt: new Date('2024-01-15')
            },
            {
                id: 'nature_2',
                title: 'Forest Path',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=90',
                uploadedAt: new Date('2024-01-10')
            },
            {
                id: 'nature_3',
                title: 'Tall Waterfall',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=700&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=90',
                uploadedAt: new Date('2024-02-01')
            },
            {
                id: 'nature_4',
                title: 'Autumn Forest',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=400&h=250&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1200&q=90',
                uploadedAt: new Date('2024-02-15')
            },
            {
                id: 'nature_5',
                title: 'Desert Landscape',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=350&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=90',
                uploadedAt: new Date('2024-02-20')
            },
            {
                id: 'nature_6',
                title: 'Ocean Waves',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=500&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=90',
                uploadedAt: new Date('2024-02-25')
            },
            {
                id: 'nature_7',
                title: 'Misty Lake',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=280&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=90',
                uploadedAt: new Date('2024-03-01')
            },
            {
                id: 'nature_8',
                title: 'Rocky Mountains',
                album: 'nature',
                url: 'https://images.unsplash.com/photo-1464822759844-d150136c4c1e?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1464822759844-d150136c4c1e?w=1200&q=90',
                uploadedAt: new Date('2024-03-05')
            },
            
            // Portraits - Mix of vertical and square
            {
                id: 'portraits_1',
                title: 'Morning Portrait',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=90',
                uploadedAt: new Date('2024-01-20')
            },
            {
                id: 'portraits_2',
                title: 'Street Portrait',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90',
                uploadedAt: new Date('2024-02-05')
            },
            {
                id: 'portraits_3',
                title: 'Evening Portrait',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=700&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=90',
                uploadedAt: new Date('2024-02-18')
            },
            {
                id: 'portraits_4',
                title: 'Professional Headshot',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&q=90',
                uploadedAt: new Date('2024-02-22')
            },
            {
                id: 'portraits_5',
                title: 'Artistic Portrait',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&q=90',
                uploadedAt: new Date('2024-02-28')
            },
            {
                id: 'portraits_6',
                title: 'Creative Portrait',
                album: 'portraits',
                url: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=350&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=1200&q=90',
                uploadedAt: new Date('2024-03-02')
            },
            
            // Travel - Variety of dimensions
            {
                id: 'travel_1',
                title: 'City Skyline',
                album: 'travel',
                url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=90',
                uploadedAt: new Date('2024-01-25')
            },
            {
                id: 'travel_2',
                title: 'European Architecture',
                album: 'travel',
                url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=90',
                uploadedAt: new Date('2024-02-10')
            },
            {
                id: 'travel_3',
                title: 'Beach Sunset',
                album: 'travel',
                url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90',
                uploadedAt: new Date('2024-02-20')
            },
            {
                id: 'travel_4',
                title: 'Ancient Temple',
                album: 'travel',
                url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=550&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=90',
                uploadedAt: new Date('2024-03-01')
            },
            {
                id: 'travel_5',
                title: 'Mountain Village',
                album: 'travel',
                url: 'https://images.unsplash.com/photo-1464822759844-d150136c4c1e?w=400&h=350&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1464822759844-d150136c4c1e?w=1200&q=90',
                uploadedAt: new Date('2024-03-05')
            },
            
            // Events - Various event photos
            {
                id: 'events_1',
                title: 'Wedding Ceremony',
                album: 'events',
                url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=90',
                uploadedAt: new Date('2024-01-30')
            },
            {
                id: 'events_2',
                title: 'Conference Speaker',
                album: 'events',
                url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=90',
                uploadedAt: new Date('2024-02-12')
            },
            {
                id: 'events_3',
                title: 'Corporate Event',
                album: 'events',
                url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=90',
                uploadedAt: new Date('2024-02-28')
            },
            {
                id: 'events_4',
                title: 'Birthday Celebration',
                album: 'events',
                url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=90',
                uploadedAt: new Date('2024-03-10')
            }
        ];
        
        return samplePhotos;
    }
    
    async loadMorePhotos() {
        if (this.isLoading || !this.hasMorePhotos) return;
        
        this.isLoading = true;
        $('#loadMoreBtn').prop('disabled', true).text('Loading...');
        
        try {
            this.currentPage++;
            this.filterAndDisplayPhotos(false); // Don't replace existing photos
            
        } catch (error) {
            console.error('Error loading more photos:', error);
            this.showError('Failed to load more photos.');
        } finally {
            this.isLoading = false;
            $('#loadMoreBtn').prop('disabled', false).text('Load More Photos');
        }
    }
    
    filterAndDisplayPhotos(replace = true) {
        let filteredPhotos = this.allPhotos;
        
        // Filter by album
        if (this.currentAlbum !== 'all') {
            filteredPhotos = this.allPhotos.filter(photo => photo.album === this.currentAlbum);
        }
        
        // Sort by upload date (newest first)
        filteredPhotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        // Pagination
        const startIndex = replace ? 0 : this.displayedPhotos.length;
        const endIndex = startIndex + this.photosPerPage;
        const newPhotos = filteredPhotos.slice(startIndex, endIndex);
        
        if (replace) {
            this.displayedPhotos = newPhotos;
        } else {
            this.displayedPhotos = [...this.displayedPhotos, ...newPhotos];
        }
        
        // Check if more photos available
        this.hasMorePhotos = endIndex < filteredPhotos.length;
        
        this.renderPhotos(replace);
        this.updateLoadMoreButton();
    }
    
    renderPhotos(replace = true) {
        const grid = $('#photoGrid');
        
        if (replace) {
            grid.empty();
            grid.addClass('loading');
        }
        
        this.displayedPhotos.forEach((photo, index) => {
            if (replace || index >= this.displayedPhotos.length - this.photosPerPage) {
                const photoElement = this.createPhotoElement(photo, index);
                grid.append(photoElement);
            }
        });
        
        // Show grid and apply masonry layout
        grid.show();
        
        // Wait for images to load before removing loading state
        const images = grid.find('img');
        let loadedCount = 0;
        
        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount >= images.length) {
                grid.removeClass('loading');
                setTimeout(() => {
                    this.updateGridLayout();
                }, 100);
            }
        };
        
        images.each(function() {
            if (this.complete) {
                checkAllLoaded();
            } else {
                $(this).on('load', checkAllLoaded);
                $(this).on('error', checkAllLoaded); // Handle failed loads
            }
        });
        
        // Fallback if no images
        if (images.length === 0) {
            grid.removeClass('loading');
        }
        
        // Re-layout when window resizes
        $(window).off('resize.masonry').on('resize.masonry', () => {
            this.updateGridLayout();
        });
    }
    
    createPhotoElement(photo, index) {
        const photoElement = $(`
            <div class="photo-item" data-index="${index}" data-album="${photo.album}">
                <img src="${photo.url}" alt="${photo.title}" loading="lazy" data-full-src="${photo.fullUrl}">
                <div class="photo-overlay">
                    <h4 class="photo-title">${photo.title}</h4>
                </div>
            </div>
        `);
        
        // Add image load handler to adjust grid row spans for masonry effect
        const img = photoElement.find('img');
        img.on('load', function() {
            const imageHeight = this.naturalHeight;
            const imageWidth = this.naturalWidth;
            const aspectRatio = imageHeight / imageWidth;
            
            // Calculate row span based on image aspect ratio and screen size
            let baseHeight, rowHeight;
            
            if (window.innerWidth <= 480) {
                baseHeight = 200;
                rowHeight = 2;
            } else if (window.innerWidth <= 768) {
                baseHeight = 250;
                rowHeight = 3;
            } else if (window.innerWidth <= 1200) {
                baseHeight = 280;
                rowHeight = 4;
            } else {
                baseHeight = 320;
                rowHeight = 5;
            }
            
            const actualHeight = Math.ceil(baseHeight * aspectRatio);
            const rowSpan = Math.ceil(actualHeight / rowHeight); // Remove extra padding
            
            photoElement.css('grid-row-end', `span ${rowSpan}`);
        });
        
        // Fallback for images that might already be cached
        if (img[0].complete && img[0].naturalHeight !== 0) {
            img.trigger('load');
        }
        
        // Add click handler for lightbox
        photoElement.find('img').on('click', () => {
            this.openLightbox(index);
        });
        
        return photoElement;
    }
    
    updateGridLayout() {
        // Modern CSS Grid masonry layout
        const container = $('#photoGrid');
        const items = container.find('.photo-item');
        
        if (items.length === 0) return;
        
        // Force reflow to ensure all images have loaded and row spans are calculated
        items.each((index, element) => {
            const $item = $(element);
            const img = $item.find('img')[0];
            
            if (img.complete && img.naturalHeight !== 0) {
                const imageHeight = img.naturalHeight;
                const imageWidth = img.naturalWidth;
                const aspectRatio = imageHeight / imageWidth;
                
                // Calculate row span based on image aspect ratio and screen size
                let baseHeight, rowHeight;
                
                if (window.innerWidth <= 480) {
                    baseHeight = 200;
                    rowHeight = 2;
                } else if (window.innerWidth <= 768) {
                    baseHeight = 250;
                    rowHeight = 3;
                } else if (window.innerWidth <= 1200) {
                    baseHeight = 280;
                    rowHeight = 4;
                } else {
                    baseHeight = 320;
                    rowHeight = 5;
                }
                
                const actualHeight = Math.ceil(baseHeight * aspectRatio);
                const rowSpan = Math.ceil(actualHeight / rowHeight); // Remove extra padding
                
                $item.css('grid-row-end', `span ${rowSpan}`);
            }
        });
        
        // Add stagger animation for new items
        items.each((index, element) => {
            const $item = $(element);
            if (!$item.hasClass('animated')) {
                $item.css({
                    'opacity': '0',
                    'transform': 'translateY(20px)'
                });
                
                setTimeout(() => {
                    $item.css({
                        'opacity': '1',
                        'transform': 'translateY(0)',
                        'transition': 'all 0.6s ease'
                    });
                    $item.addClass('animated');
                }, index * 50); // Faster stagger for more items
            }
        });
    }
    
    updateLoadMoreButton() {
        const loadMoreSection = $('#loadMoreSection');
        
        if (this.hasMorePhotos && this.displayedPhotos.length > 0) {
            loadMoreSection.show();
        } else {
            loadMoreSection.hide();
        }
    }
    
    switchAlbum(album) {
        if (this.currentAlbum === album) return;
        
        this.currentAlbum = album;
        this.currentPage = 1;
        
        // Update active tab
        $('.album-tab').removeClass('active');
        $(`.album-tab[data-album="${album}"]`).addClass('active');
        
        // Filter and display photos
        this.filterAndDisplayPhotos();
        this.updatePhotoCounts();
    }
    
    updatePhotoCounts() {
        const albums = this.config.albums || {};
        
        Object.keys(albums).forEach(albumKey => {
            const count = this.allPhotos.filter(photo => photo.album === albumKey).length;
            $(`.album-tab[data-album="${albumKey}"] .photo-count`).text(count);
        });
        
        // Update "All" count
        $(`.album-tab[data-album="all"] .photo-count`).text(this.allPhotos.length);
    }
    
    openLightbox(index) {
        if (!this.config.features.enableLightbox) return;
        
        this.lightboxIndex = index;
        const photo = this.displayedPhotos[index];
        
        $('#lightboxImg').attr('src', photo.fullUrl).attr('alt', photo.title);
        $('#lightbox').fadeIn(300);
        
        // Preload adjacent images for better performance
        this.preloadAdjacentImages();
    }
    
    closeLightbox() {
        $('#lightbox').fadeOut(300);
    }
    
    navigateLightbox(direction) {
        const newIndex = this.lightboxIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.displayedPhotos.length) {
            this.openLightbox(newIndex);
        }
    }
    
    preloadAdjacentImages() {
        const preloadCount = this.config.performance?.preloadImages || 3;
        
        for (let i = 1; i <= preloadCount; i++) {
            // Preload next images
            const nextIndex = this.lightboxIndex + i;
            if (nextIndex < this.displayedPhotos.length) {
                const img = new Image();
                img.src = this.displayedPhotos[nextIndex].fullUrl;
            }
            
            // Preload previous images
            const prevIndex = this.lightboxIndex - i;
            if (prevIndex >= 0) {
                const img = new Image();
                img.src = this.displayedPhotos[prevIndex].fullUrl;
            }
        }
    }
    
    async handlePhotoUpload() {
        if (!this.config.features.enableUpload) {
            this.showError('Upload functionality is disabled');
            return;
        }
        
        if (!this.photographyService) {
            this.showError('Photography service not available. Please check configuration.');
            return;
        }
        
        const files = $('#photoFiles')[0].files;
        const albumSelect = $('#albumSelect').val();
        const newAlbumName = $('#newAlbumName').val().trim();
        
        if (files.length === 0) {
            this.showError('Please select at least one photo to upload');
            return;
        }
        
        const targetAlbum = newAlbumName || albumSelect;
        
        try {
            this.showUploadProgress(true);
            
            const uploadPromises = Array.from(files).map(async (file, index) => {
                try {
                    const result = await this.photographyService.uploadPhoto(file, targetAlbum, {
                        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                        description: `Uploaded on ${new Date().toLocaleDateString()}`
                    });
                    
                    this.updateUploadProgress(index + 1, files.length);
                    return result;
                } catch (error) {
                    console.error(`Failed to upload ${file.name}:`, error);
                    throw error;
                }
            });
            
            await Promise.all(uploadPromises);
            
            this.showSuccess(`Successfully uploaded ${files.length} photo(s)!`);
            this.resetUploadForm();
            this.loadPhotos(); // Reload to show new photos
            
        } catch (error) {
            console.error('Upload error:', error);
            this.showError(`Upload failed: ${error.message}`);
        } finally {
            this.showUploadProgress(false);
        }
    }
    
    showUploadProgress(show) {
        if (show) {
            $('#uploadForm button').prop('disabled', true).text('Uploading...');
        } else {
            $('#uploadForm button').prop('disabled', false).text('Upload Photos');
        }
    }
    
    updateUploadProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        $('#uploadForm button').text(`Uploading... ${percent}%`);
    }
    
    resetUploadForm() {
        $('#uploadForm')[0].reset();
        $('#newAlbumName').val('');
    }
    
    checkAdminAccess() {
        const isAdmin = this.config.features.enableAdmin;
        const canUpload = this.config.features.enableUpload;
        
        if (canUpload) {
            $('#uploadSection').show();
        }
        
        // You can add more admin-specific features here
        if (isAdmin) {
            // Add admin-only features like photo management, analytics, etc.
        }
    }
    
    showError(message) {
        // You can replace this with a more sophisticated notification system
        console.error('Photography Portfolio Error:', message);
        alert(`Error: ${message}`);
    }
    
    showSuccess(message) {
        // You can replace this with a more sophisticated notification system
        console.log('Photography Portfolio Success:', message);
        alert(message);
    }
    
    // Provider switching functionality
    switchStorageProvider(providerName) {
        if (this.photographyService && this.photographyService.switchProvider(providerName)) {
            this.showSuccess(`Switched to ${providerName} storage provider`);
            // Optionally reload photos to reflect new provider
            this.loadPhotos();
        } else {
            this.showError(`Failed to switch to ${providerName} provider`);
        }
    }
}

// Initialize when DOM is ready
$(document).ready(() => {
    console.log('Initializing Photography Portfolio...');
    try {
        window.photoPortfolio = new PhotoPortfolio();
        console.log('Photography Portfolio initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Photography Portfolio:', error);
        alert('Failed to initialize photography portfolio. Please check the console for details.');
    }
});
