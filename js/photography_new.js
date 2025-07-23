/**
 * Modern Photography Portfolio
 * Clean, responsive masonry grid implementation
 */

class PhotographyPortfolio {
    constructor() {
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.allPhotos = [];
        this.filteredPhotos = [];
        this.displayedPhotos = [];
        this.isLoading = false;
        this.hasMorePhotos = true;
        this.currentLightboxIndex = 0;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadPhotos();
        this.showPhotos();
    }

    bindEvents() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });

        // Load more button
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMorePhotos();
        });

        // Lightbox events
        document.getElementById('lightboxClose').addEventListener('click', () => {
            this.closeLightbox();
        });

        document.getElementById('lightboxPrev').addEventListener('click', () => {
            this.navigateLightbox(-1);
        });

        document.getElementById('lightboxNext').addEventListener('click', () => {
            this.navigateLightbox(1);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').classList.contains('active')) {
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

        // Close lightbox on backdrop click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });
    }

    async loadPhotos() {
        // Sample photos with different aspect ratios for masonry layout
        this.allPhotos = [
            // Nature Photos
            {
                id: 1,
                title: 'Mountain Sunrise',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=90'
            },
            {
                id: 2,
                title: 'Forest Path',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=90'
            },
            {
                id: 3,
                title: 'Waterfall',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=700&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=90'
            },
            {
                id: 4,
                title: 'Autumn Forest',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=400&h=350&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1200&q=90'
            },
            {
                id: 5,
                title: 'Ocean Waves',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=250&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=90'
            },
            {
                id: 6,
                title: 'Desert Landscape',
                category: 'nature',
                url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=500&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=90'
            },

            // Portrait Photos
            {
                id: 7,
                title: 'Portrait Study',
                category: 'portraits',
                url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=90'
            },
            {
                id: 8,
                title: 'Street Portrait',
                category: 'portraits',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=90'
            },
            {
                id: 9,
                title: 'Creative Portrait',
                category: 'portraits',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=550&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=90'
            },
            {
                id: 10,
                title: 'Professional Headshot',
                category: 'portraits',
                url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&q=90'
            },

            // Travel Photos
            {
                id: 11,
                title: 'City Skyline',
                category: 'travel',
                url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=90'
            },
            {
                id: 12,
                title: 'European Architecture',
                category: 'travel',
                url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=650&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&q=90'
            },
            {
                id: 13,
                title: 'Beach Sunset',
                category: 'travel',
                url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90'
            },
            {
                id: 14,
                title: 'Ancient Temple',
                category: 'travel',
                url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=90'
            },

            // Event Photos
            {
                id: 15,
                title: 'Wedding Ceremony',
                category: 'events',
                url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=600&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=90'
            },
            {
                id: 16,
                title: 'Corporate Event',
                category: 'events',
                url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=350&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=90'
            },
            {
                id: 17,
                title: 'Conference Speaker',
                category: 'events',
                url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=90'
            },
            {
                id: 18,
                title: 'Birthday Celebration',
                category: 'events',
                url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=450&fit=crop&q=80',
                fullUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=90'
            }
        ];

        this.filterPhotos();
    }

    switchCategory(category) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Reset and filter photos
        this.currentCategory = category;
        this.currentPage = 1;
        this.displayedPhotos = [];
        
        this.filterPhotos();
        this.showPhotos(true);
    }

    filterPhotos() {
        if (this.currentCategory === 'all') {
            this.filteredPhotos = [...this.allPhotos];
        } else {
            this.filteredPhotos = this.allPhotos.filter(photo => photo.category === this.currentCategory);
        }
        
        this.hasMorePhotos = this.filteredPhotos.length > this.photosPerPage;
    }

    showPhotos(replace = false) {
        const grid = document.getElementById('photoGrid');
        const loading = document.getElementById('loading');
        
        if (replace) {
            grid.innerHTML = '';
            this.displayedPhotos = [];
        }

        // Calculate photos to show
        const startIndex = this.displayedPhotos.length;
        const endIndex = Math.min(startIndex + this.photosPerPage, this.filteredPhotos.length);
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

        // Add new photos to displayed array
        this.displayedPhotos.push(...photosToShow);

        // Create photo elements
        photosToShow.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, startIndex + index);
            grid.appendChild(photoElement);
            
            // Animate in with delay
            setTimeout(() => {
                photoElement.classList.add('loaded');
            }, index * 100);
        });

        // Hide loading, show grid
        loading.style.display = 'none';
        grid.style.display = 'grid';

        // Update load more button
        this.updateLoadMoreButton();
    }

    createPhotoElement(photo, index) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.innerHTML = `
            <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            <div class="photo-overlay">
                <div class="photo-title">${photo.title}</div>
                <div class="photo-category">${this.getCategoryName(photo.category)}</div>
            </div>
        `;

        // Add click handler for lightbox
        photoDiv.addEventListener('click', () => {
            this.openLightbox(index);
        });

        return photoDiv;
    }

    getCategoryName(category) {
        const names = {
            'nature': 'Nature & Landscapes',
            'portraits': 'Portraits',
            'travel': 'Travel Photography',
            'events': 'Events'
        };
        return names[category] || category;
    }

    loadMorePhotos() {
        if (this.isLoading || !this.hasMorePhotos) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.showPhotos(false);
            this.isLoading = false;
        }, 500);
    }

    updateLoadMoreButton() {
        const loadMore = document.getElementById('loadMore');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        this.hasMorePhotos = this.displayedPhotos.length < this.filteredPhotos.length;
        
        if (this.hasMorePhotos && this.displayedPhotos.length > 0) {
            loadMore.style.display = 'block';
            loadMoreBtn.disabled = this.isLoading;
            loadMoreBtn.textContent = this.isLoading ? 'Loading...' : 'Load More Photos';
        } else {
            loadMore.style.display = 'none';
        }
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        const photo = this.displayedPhotos[index];
        
        document.getElementById('lightboxImg').src = photo.fullUrl;
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateLightbox(direction) {
        this.currentLightboxIndex += direction;
        
        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.displayedPhotos.length - 1;
        } else if (this.currentLightboxIndex >= this.displayedPhotos.length) {
            this.currentLightboxIndex = 0;
        }
        
        const photo = this.displayedPhotos[this.currentLightboxIndex];
        document.getElementById('lightboxImg').src = photo.fullUrl;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyPortfolio();
});
