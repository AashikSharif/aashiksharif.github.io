# Photography Portfolio Configuration

## Cloudinary Setup Instructions

### Step 1: Create a Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com/) and sign up for a free account
2. Note down your:
   - Cloud name
   - API Key
   - API Secret

### Step 2: Configure Upload Preset
1. In your Cloudinary dashboard, go to Settings > Upload
2. Create a new upload preset with these settings:
   - Name: `photography_portfolio`
   - Signing Mode: `Unsigned`
   - Folder: `portfolio`
   - Use filename as public ID: `No`
   - Unique filename: `Yes`
   - Auto-create folders: `Yes`

### Step 3: Update JavaScript Configuration
Open `js/photography.js` and update the `cloudinaryConfig` object:

```javascript
this.cloudinaryConfig = {
    cloudName: 'your-actual-cloud-name',
    apiKey: 'your-actual-api-key',
    uploadPreset: 'photography_portfolio'
};
```

### Step 4: Folder Structure in Cloudinary
Your photos will be organized as:
```
portfolio/
├── nature/
├── portraits/
├── travel/
├── events/
└── [custom-albums]/
```

### Step 5: Enable Admin Upload (Optional)
To enable the upload feature:
1. Add `?admin=true` to your photography.html URL
2. Or set `localStorage.setItem('photoPortfolioAdmin', 'true')` in browser console

### Security Note
For production use:
- Use signed uploads instead of unsigned
- Implement proper authentication for admin features
- Consider using Cloudinary's SDK for more secure operations

### Alternative: Static Implementation (No Cloud)
If you prefer not to use Cloudinary:
1. Create folders under `images/portfolio/` for each album
2. Modify the `fetchPhotosFromCloudinary()` function to read from your static files
3. Remove the upload functionality

### Sample Photo Data Structure
```javascript
{
    id: 'unique-photo-id',
    url: 'thumbnail-url',
    fullUrl: 'full-resolution-url',
    title: 'Photo Title',
    album: 'album-name',
    uploadedAt: Date object
}
```

### Performance Tips
1. Use WebP format for better compression
2. Generate multiple sizes for responsive images
3. Implement proper lazy loading
4. Use Cloudinary's automatic optimization features

### Customization
- Modify album names in both HTML and JavaScript
- Adjust `photosPerPage` for different loading behavior
- Customize the lightbox and grid styles in CSS
- Add metadata like location, camera settings, etc.
