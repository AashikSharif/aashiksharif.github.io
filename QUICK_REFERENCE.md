# Quick Reference: Adding New Photos to Portfolio

## 🚀 Quick Steps

### 1. Upload to Cloudinary
1. Login to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to **Media Library**
3. Navigate to folder: `portfolio/[category]/`
   - `portfolio/nature/` for landscapes
   - `portfolio/portraits/` for people photos
   - `portfolio/travel/` for travel shots
   - `portfolio/events/` for event photography
4. **Upload** your image
5. **Rename** to descriptive name (e.g., `sunset-mountain-peak`)

### 2. Get Image URLs
Replace `YOUR_CLOUD_NAME` and `IMAGE_NAME` in these templates:

**Landscape Photos** (wider images):
```
Thumbnail: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_400,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
Full-size: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
```

**Portrait Photos** (taller images):
```
Thumbnail: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_300,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
Full-size: https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/portfolio/CATEGORY/IMAGE_NAME.jpg
```

### 3. Update JavaScript
Edit `js/photography.js` and add your photo to the appropriate section:

```javascript
// Find the category array and add your photo:
{
    id: [NEXT_ID_NUMBER],
    title: 'Your Photo Title',
    category: 'nature', // or 'portraits', 'travel', 'events'
    thumbnail: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_400,f_auto,q_auto/portfolio/nature/your-image-name.jpg',
    full: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1200,f_auto,q_auto/portfolio/nature/your-image-name.jpg'
},
```

### 4. Test
1. Save the file
2. Refresh your website
3. Check the new photo appears in the correct category
4. Test clicking the image to open lightbox

## 📋 Categories
- **nature** - Landscapes, wildlife, natural scenes
- **portraits** - People, headshots, lifestyle
- **travel** - Cities, architecture, cultural sites
- **events** - Weddings, concerts, celebrations

## ⚡ Pro Tips
- Use descriptive filenames: `golden-hour-beach` not `IMG_1234`
- Landscape images: use `w_400` for thumbnails
- Portrait images: use `w_300` for thumbnails
- Always increment the `id` number for new photos
- Keep image titles descriptive but concise

## 🔧 URL Parameters Explained
- `w_400` = Width in pixels
- `f_auto` = Auto format (WebP for modern browsers)
- `q_auto` = Auto quality optimization
- `c_scale` = Scale to fit (maintains aspect ratio)

## ❌ Common Mistakes
- Forgetting to increment ID numbers
- Using spaces in image names (use hyphens instead)
- Wrong category folder
- Missing comma after previous photo entry
- Using wrong thumbnail width for image orientation

---
**Need help?** Check the full guide: `CLOUDINARY_PHOTOGRAPHY_GUIDE.md`
