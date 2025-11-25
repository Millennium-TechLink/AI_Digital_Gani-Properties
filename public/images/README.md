# Images Directory

## Required Images

### Root images/
- `og-image.jpg` - Open Graph/Twitter social sharing image (1200x630px)

### Property images
For each property, add images named:
- `{property-id}-1.jpg` - Main/cover image
- `{property-id}-2.jpg` - Additional image
- etc.

Example:
- `res-katt-001-1.jpg`
- `res-katt-001-2.jpg`
- `farm-katt-001-1.jpg`

## Quick Start with Placeholders

During development, you can use placeholder services:

```bash
# Hero background
https://via.placeholder.com/1200x630

# Category tiles
https://via.placeholder.com/800x600

# Property images
https://picsum.photos/800/600
https://via.placeholder.com/800x600
```

## Recommended Image Specs

- **Format**: JPG or WebP
- **Max file size**: 500KB per image
- **Aspect ratios**: Maintain consistent ratios for best display
- **Alt text**: Descriptive alt text is automatically added from property data

## Production Checklist

- [ ] Replace all placeholder images with real property photos
- [ ] Optimize images (compress before upload)
- [ ] Use WebP format for better performance
- [ ] Verify all images load properly
- [ ] Test on different screen sizes

