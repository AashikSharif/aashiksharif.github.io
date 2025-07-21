/**
 * Photography Portfolio JavaScript
 * Handles photo loading, album switching, lightbox, and upload functionality
 */

class PhotoPortfolio {
    constructor() {
        this.cloudinaryConfig = {
            cloudName: 'your-cloudinary-name', // Replace with your Cloudinary cloud name
            apiKey: 'your-api-key', // Replace with your API key
            uploadPreset: 'your-upload-preset' // Replace with your upload preset
        };
        
        this.currentAlbum = 'all';
        this.currentPage = 1;
        this.photosPerPage = 20;
        this.allPhotos = [];
        this.displayedPhotos = [];
        this.lightboxIndex = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadPhotos();
        this.checkAdminAccess();
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
    }
    
    async loadPhotos() {
        try {
            $('#loading').show();
            $('#photoGrid').hide();
            
            // For demo purposes, we'll use sample data
            // In production, replace this with actual Cloudinary API calls
            this.allPhotos = await this.fetchPhotosFromCloudinary();
            
            this.filterAndDisplayPhotos();
            this.updatePhotoCounts();
            
        } catch (error) {
            console.error('Error loading photos:', error);
            this.showError('Failed to load photos. Please try again later.');
        } finally {
            $('#loading').hide();
        }
    }
    
    async fetchPhotosFromCloudinary() {
        // Demo data with more comprehensive sample photos
        const samplePhotos = [
            {
                id: '1',
                url: 'https://picsum.photos/400/600?random=1',
                fullUrl: 'https://picsum.photos/1200/1800?random=1',
                title: 'Mountain Sunrise',
                album: 'nature',
                uploadedAt: new Date('2024-01-15')
            },
            {
                id: '2',
                url: 'https://picsum.photos/400/500?random=2',
                fullUrl: 'https://picsum.photos/1200/1500?random=2',
                title: 'Morning Portrait',
                album: 'portraits',
                uploadedAt: new Date('2024-01-20')
            },
            {
                id: '3',
                url: 'https://picsum.photos/400/700?random=3',
                fullUrl: 'https://picsum.photos/1200/2100?random=3',
                title: 'Forest Path',
                album: 'nature',
                uploadedAt: new Date('2024-01-10')
            },
            {
                id: '4',
                url: 'https://picsum.photos/400/550?random=4',
                fullUrl: 'https://picsum.photos/1200/1650?random=4',
                title: 'City Skyline',
                album: 'travel',
                uploadedAt: new Date('2024-01-25')
            },
            {
                id: '5',
                url: 'https://picsum.photos/400/480?random=5',
                fullUrl: 'https://picsum.photos/1200/1440?random=5',
                title: 'Wedding Ceremony',
                album: 'events',
                uploadedAt: new Date('2024-01-30')
            },
            {
                id: '6',
                url: 'https://picsum.photos/400/620?random=6',
                fullUrl: 'https://picsum.photos/1200/1860?random=6',
                title: 'Ocean Waves',
                album: 'nature',
                uploadedAt: new Date('2024-02-01')
            },
            {
                id: '7',
                url: 'https://picsum.photos/400/580?random=7',
                fullUrl: 'https://picsum.photos/1200/1740?random=7',
                title: 'Street Portrait',
                album: 'portraits',
                uploadedAt: new Date('2024-02-05')
            },
            {
                id: '8',
                url: 'https://picsum.photos/400/650?random=8',
                fullUrl: 'https://picsum.photos/1200/1950?random=8',
                title: 'Ancient Architecture',
                album: 'travel',
                uploadedAt: new Date('2024-02-08')
            },
            {
                id: '9',
                url: 'https://picsum.photos/400/520?random=9',
                fullUrl: 'https://picsum.photos/1200/1560?random=9',
                title: 'Conference Speaker',
                album: 'events',
                uploadedAt: new Date('2024-02-12')
            },
            {
                id: '10',
                url: 'https://picsum.photos/400/680?random=10',
                fullUrl: 'https://picsum.photos/1200/2040?random=10',
                title: 'Sunset Lake',
                album: 'nature',
                uploadedAt: new Date('2024-02-15')
            },
            {
                id: '11',
                url: 'https://picsum.photos/400/560?random=11',
                fullUrl: 'https://picsum.photos/1200/1680?random=11',
                title: 'Artist Portrait',
                album: 'portraits',
                uploadedAt: new Date('2024-02-18')
            },
            {
                id: '12',
                url: 'https://picsum.photos/400/590?random=12',
                fullUrl: 'https://picsum.photos/1200/1770?random=12',
                title: 'Local Market',
                album: 'travel',
                uploadedAt: new Date('2024-02-20')
            },
            {
                id: '13',
                url: 'https://picsum.photos/400/640?random=13',
                fullUrl: 'https://picsum.photos/1200/1920?random=13',
                title: 'Graduation Day',
                album: 'events',
                uploadedAt: new Date('2024-02-22')
            },
            {
                id: '14',
                url: 'https://picsum.photos/400/570?random=14',
                fullUrl: 'https://picsum.photos/1200/1710?random=14',
                title: 'Autumn Colors',
                album: 'nature',
                uploadedAt: new Date('2024-02-25')
            },
            {
                id: '15',
                url: 'https://picsum.photos/400/600?random=15',
                fullUrl: 'https://picsum.photos/1200/1800?random=15',
                title: 'Executive Portrait',
                album: 'portraits',
                uploadedAt: new Date('2024-02-28')
            }
        ];
        
        // Uncomment and modify this for actual Cloudinary integration:
        /*
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/resources/image`, {
                headers: {
                    'Authorization': `Basic ${btoa(this.cloudinaryConfig.apiKey + ':' + 'your-api-secret')}`
                }
            });
            
            const data = await response.json();
            return data.resources.map(resource => ({
                id: resource.public_id,
                url: this.generateCloudinaryUrl(resource.public_id, { width: 400, height: 600, crop: 'fill' }),
                fullUrl: this.generateCloudinaryUrl(resource.public_id, { width: 1200, height: 1800 }),
                title: resource.context?.custom?.title || 'Untitled',
                album: this.extractAlbumFromPath(resource.public_id),
                uploadedAt: new Date(resource.created_at)
            }));
        } catch (error) {
            console.error('Cloudinary API Error:', error);
            return samplePhotos;
        }
        */
        
        return samplePhotos;
    }
    
    generateCloudinaryUrl(publicId, options) {
        const baseUrl = `https://res.cloudinary.com/${this.cloudinaryConfig.cloudName}/image/upload/`;
        let transformations = [];
        
        if (options.width) transformations.push(`w_${options.width}`);
        if (options.height) transformations.push(`h_${options.height}`);
        if (options.crop) transformations.push(`c_${options.crop}`);
        if (options.quality) transformations.push(`q_${options.quality}`);
        
        const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
        return `${baseUrl}${transformString}${publicId}`;
    }
    
    extractAlbumFromPath(publicId) {
        const parts = publicId.split('/');
        if (parts.length > 1 && parts[0] === 'portfolio') {
            return parts[1];
        }
        return 'general';
    }
    
    switchAlbum(album) {
        this.currentAlbum = album;
        this.currentPage = 1;
        
        // Update active tab
        $('.album-tab').removeClass('active');
        $(`.album-tab[data-album="${album}"]`).addClass('active');
        
        this.filterAndDisplayPhotos();
    }
    
    filterAndDisplayPhotos() {
        // Filter photos by album
        let filteredPhotos = this.currentAlbum === 'all' 
            ? [...this.allPhotos]
            : this.allPhotos.filter(photo => photo.album === this.currentAlbum);
        
        // Sort by upload date (newest first)
        filteredPhotos.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        // Apply pagination
        const startIndex = 0;
        const endIndex = this.currentPage * this.photosPerPage;
        this.displayedPhotos = filteredPhotos.slice(startIndex, endIndex);
        
        this.renderPhotos();
        this.updateLoadMoreButton(filteredPhotos.length);
        
        $('#photoGrid').show();
    }
    
    renderPhotos() {
        const photoGrid = $('#photoGrid');
        photoGrid.empty();
        
        this.displayedPhotos.forEach((photo, index) => {
            const photoElement = $(`
                <div class="photo-item" data-index="${index}">
                    <img src="${photo.url}" alt="${photo.title}" loading="lazy">
                    <div class="photo-overlay">
                        <h4 class="photo-title">${photo.title}</h4>
                    </div>
                </div>
            `);
            
            photoGrid.append(photoElement);
        });
        
        // Add intersection observer for lazy loading
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        $('.photo-item img').each((index, img) => {
            imageObserver.observe(img);
        });
    }
    
    loadMorePhotos() {
        this.currentPage++;
        this.filterAndDisplayPhotos();
    }
    
    updateLoadMoreButton(totalFiltered) {
        const loadMoreSection = $('#loadMoreSection');
        const loadMoreBtn = $('#loadMoreBtn');
        
        if (this.displayedPhotos.length < totalFiltered) {
            loadMoreSection.show();
            loadMoreBtn.prop('disabled', false).text('Load More Photos');
        } else {
            loadMoreSection.hide();
        }
    }
    
    updatePhotoCounts() {
        const counts = this.allPhotos.reduce((acc, photo) => {
            acc[photo.album] = (acc[photo.album] || 0) + 1;
            return acc;
        }, {});
        
        // Update counts in main page if elements exist
        Object.keys(counts).forEach(album => {
            $(`#${album}-count`).text(`${counts[album]} Photos`);
        });
    }
    
    openLightbox(index) {
        this.lightboxIndex = index;
        const photo = this.displayedPhotos[index];
        
        $('#lightboxImg').attr('src', photo.fullUrl).attr('alt', photo.title);
        $('#lightbox').fadeIn(300);
        
        // Disable body scroll
        $('body').css('overflow', 'hidden');
    }
    
    closeLightbox() {
        $('#lightbox').fadeOut(300);
        $('body').css('overflow', 'auto');
    }
    
    navigateLightbox(direction) {
        const newIndex = this.lightboxIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.displayedPhotos.length) {
            this.lightboxIndex = newIndex;
            const photo = this.displayedPhotos[this.lightboxIndex];
            $('#lightboxImg').attr('src', photo.fullUrl).attr('alt', photo.title);
        }
    }
    
    checkAdminAccess() {
        // Simple admin check - in production, use proper authentication
        const isAdmin = localStorage.getItem('photoPortfolioAdmin') === 'true' || 
                       window.location.search.includes('admin=true');
        
        if (isAdmin) {
            $('#uploadSection').show();
        }
    }
    
    async handlePhotoUpload() {
        const files = $('#photoFiles')[0].files;
        const albumSelect = $('#albumSelect').val();
        const newAlbumName = $('#newAlbumName').val().trim();
        
        if (files.length === 0) {
            alert('Please select photos to upload.');
            return;
        }
        
        const targetAlbum = newAlbumName || albumSelect;
        
        try {
            $('#uploadForm button').prop('disabled', true).text('Uploading...');
            
            for (let file of files) {
                await this.uploadSinglePhoto(file, targetAlbum);
            }
            
            alert('Photos uploaded successfully!');
            this.loadPhotos(); // Refresh the gallery
            $('#photoFiles').val('');
            $('#newAlbumName').val('');
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload photos. Please try again.');
        } finally {
            $('#uploadForm button').prop('disabled', false).text('Upload Photos');
        }
    }
    
    async uploadSinglePhoto(file, album) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
        formData.append('folder', `portfolio/${album}`);
        formData.append('context', `title=${file.name.replace(/\.[^/.]+$/, "")}`);
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        return response.json();
    }
    
    showError(message) {
        const errorDiv = $(`
            <div class="alert alert-danger" style="margin: 20px;">
                <strong>Error:</strong> ${message}
            </div>
        `);
        
        $('.container').prepend(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Global functions for main page integration
function openAlbum(album) {
    window.location.href = `photography.html?album=${album}`;
}

// Initialize when document is ready
$(document).ready(function() {
    // Check if we're on the photography page
    if (window.location.pathname.includes('photography.html')) {
        const portfolio = new PhotoPortfolio();
        
        // Check for album parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const albumParam = urlParams.get('album');
        if (albumParam && albumParam !== 'all') {
            portfolio.switchAlbum(albumParam);
        }
    }
    
    // Initialize photo counts on main page
    if ($('#nature-count').length) {
        // This would normally fetch from Cloudinary API
        $('#nature-count').text('25 Photos');
        $('#portraits-count').text('18 Photos');
        $('#travel-count').text('32 Photos');
        $('#events-count').text('15 Photos');
    }
});
