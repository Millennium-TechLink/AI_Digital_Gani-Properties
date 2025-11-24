# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install
```bash
npm install
```

### Step 2: Configure Form Service (REQUIRED)

Create `.env.local`:
```env
GP_FORM_ENDPOINT=https://your-service.com/submit
GP_FORM_METHOD=POST
VITE_SITE_URL=https://ganiproperties.com
```

**Easiest Option - Web3Forms:**
1. Visit https://web3forms.com
2. Get your access key
3. Set:
   ```
   GP_FORM_ENDPOINT=https://api.web3forms.com/submit
   GP_FORM_SECRET=your_access_key_here
   ```

### Step 3: Add Placeholder Images

Create these files in `public/images/`:
- `og-image.jpg` (1200x630) - Use: https://via.placeholder.com/1200x630
- `demo/hero-bg.jpg` (1200x630) - Use: https://via.placeholder.com/1200x630
- `demo/category-farm.jpg` - Use: https://picsum.photos/800/600
- `demo/category-agricultural.jpg` - Use: https://picsum.photos/800/600
- `demo/category-residential.jpg` - Use: https://picsum.photos/800/600

Property images are optional for initial testing.

### Step 4: Run
```bash
npm run dev
```

Visit http://localhost:5173

### Step 5: Test
1. Go to `/contact`
2. Fill out the form
3. Submit - you should see a success message
4. Check your form service dashboard for the submission

## ✅ That's It!

Your website is now running locally.

## 📝 Next Steps

1. Replace placeholder images with real photos
2. Update contact info in Footer and Contact page
3. Customize property data in `data/properties.json`
4. Deploy to Vercel/Netlify

## 🐛 Troubleshooting

**Form not submitting?**
- Check `.env.local` has correct `GP_FORM_ENDPOINT`
- Verify form service is configured
- Check browser console for errors

**Images not loading?**
- Verify image paths in `data/properties.json`
- Check file names match exactly
- Ensure images are in `public/images/demo/`

**Build errors?**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Full Documentation

See `README.md` for complete setup instructions and customization guide.

