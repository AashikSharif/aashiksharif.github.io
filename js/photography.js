/**
 * Photography Portfolio - Clean Implementation
 * Modern vanilla JavaScript with proper masonry grid layout
 */

class PhotographyPortfolio {
    constructor() {
        this.categories = ['all', 'nature', 'portraits', 'travel', 'events'];
        this.currentCategory = 'all';
        this.photos = [];
        this.filteredPhotos = [];
        this.lightboxIndex = 0;
        this.init();
    }

    init() {
        this.loadPhotos();
        this.setupEventListeners();
        
        // Check for URL parameters to auto-select category
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam && this.categories.includes(categoryParam)) {
            this.currentCategory = categoryParam;
            this.updateActiveTab();
            this.filterPhotos();
        }
    }

    loadPhotos() {
        // Sample photos with natural aspect ratios for masonry effect
        this.photos = [
            // Nature & Landscapes - Wide natural format
            {
                id: 1,
                title: 'Mountain Sunrise',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90'
            },
            {
                id: 2,
                title: 'Forest Path',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=90'
            },
            {
                id: 3,
                title: 'Ocean Waves',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=90'
            },
            {
                id: 4,
                title: 'Autumn Leaves',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1200&q=90'
            },
            {
                id: 5,
                title: 'Desert Landscape',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=90'
            },
            {
                id: 6,
                title: 'Snow Mountain',
                category: 'nature',
                thumbnail: 'https://images.unsplash.com/photo-1464822759844-d150baec4e84?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1464822759844-d150baec4e84?w=1200&q=90'
            },

            // Portraits - Natural portrait format
            {
                id: 7,
                title: 'Portrait Study 1',
                category: 'portraits',
                thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=90'
            },
            {
                id: 8,
                title: 'Street Portrait',
                category: 'portraits',
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90'
            },
            {
                id: 9,
                title: 'Golden Hour Portrait',
                category: 'portraits',
                thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=1200&q=90'
            },
            {
                id: 10,
                title: 'Candid Moment',
                category: 'portraits',
                thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=90'
            },

            // Travel - Natural orientations
            {
                id: 11,
                title: 'City Skyline',
                category: 'travel',
                thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=90'
            },
            {
                id: 12,
                title: 'Ancient Architecture',
                category: 'travel',
                thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&q=90'
            },
            {
                id: 13,
                title: 'Market Street',
                category: 'travel',
                thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=350&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&q=90'
            },
            {
                id: 14,
                title: 'Coastal Town',
                category: 'travel',
                thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&q=90'
            },

            // Events - Natural orientations
            {
                id: 15,
                title: 'Wedding Celebration',
                category: 'events',
                thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=90'
            },
            {
                id: 16,
                title: 'Concert Performance',
                category: 'events',
                thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=90'
            },
            {
                id: 17,
                title: 'Corporate Event',
                category: 'events',
                thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=90'
            },
            {
                id: 18,
                title: 'Art Gallery Opening',
                category: 'events',
                thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&auto=format&q=80',
                full: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=90'
            }
        ];

        this.filterPhotos();
    }

    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
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

        // Grid item clicks (delegated)
        document.getElementById('photoGrid').addEventListener('click', (e) => {
            const photoItem = e.target.closest('.photo-item');
            if (photoItem) {
                const index = parseInt(photoItem.dataset.index);
                this.openLightbox(index);
            }
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.updateActiveTab();
        this.filterPhotos();
        
        // Update URL without page reload
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }

    updateActiveTab() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-category="${this.currentCategory}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    filterPhotos() {
        if (this.currentCategory === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === this.currentCategory);
        }
        this.renderPhotos();
    }

    renderPhotos() {
        const grid = document.getElementById('photoGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.filteredPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.dataset.index = index;
            photoElement.innerHTML = `
                <img src="${photo.thumbnail}" alt="${photo.title}" loading="lazy">
                <div class="photo-overlay">
                    <h4>${photo.title}</h4>
                </div>
            `;
            grid.appendChild(photoElement);
        });
        
        // Show the grid and hide loading
        grid.style.display = 'grid';
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
        
        // Apply masonry layout after images load
        this.applyMasonryLayout();
    }
    
    applyMasonryLayout() {
        const grid = document.getElementById('photoGrid');
        const items = grid.querySelectorAll('.photo-item');
        
        // Wait for images to load before calculating layout
        let loadedImages = 0;
        const totalImages = items.length;
        
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            
            const handleImageLoad = () => {
                loadedImages++;
                
                // Calculate grid row span based on image height
                const imageHeight = img.offsetHeight;
                const rowHeight = 5; // matches grid-auto-rows
                const rowGap = 20; // matches gap
                const rowSpan = Math.ceil((imageHeight + rowGap) / (rowHeight + rowGap));
                
                item.style.gridRowEnd = `span ${rowSpan}`;
                
                // When all images are loaded, trigger any additional layout
                if (loadedImages === totalImages) {
                    // Optional: Add any final layout adjustments here
                }
            };
            
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener('load', handleImageLoad);
            }
        });
    }

    openLightbox(index) {
        this.lightboxIndex = index;
        const photo = this.filteredPhotos[index];
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        
        if (lightboxImg) lightboxImg.src = photo.full;
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
        
        if (lightboxImg) lightboxImg.src = photo.full;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyPortfolio();
});
