# Quick Start Guide

Get the property ingestion pipeline up and running in 5 minutes!

## 1. Install Dependencies

**Backend:**
```bash
cd pipeline/backend
npm install
```

**Dashboard:**
```bash
cd ../dashboard
npm install
```

## 2. Start Services

**Terminal 1 - Backend API:**
```bash
cd pipeline/backend
npm run dev
```
✅ Backend running on http://localhost:3001

**Terminal 2 - Dashboard:**
```bash
cd pipeline/dashboard
npm run dev
```
✅ Dashboard running on http://localhost:3002

## 3. Access Dashboard

Open http://localhost:3002 in your browser.

**Login Credentials (Development Defaults):**
- Username: `admin`
- Password: `admin123`

⚠️ **Note:** Change these credentials in production! 

**To customize credentials and token duration:** See `CREDENTIALS_GUIDE.md` for quick setup, or `AUTHENTICATION.md` for detailed documentation.

After logging in, you'll see:
- **Dashboard**: Overview with statistics
- **All Properties**: List of all properties
- **Add Property**: Create new property listings

## 4. Test the Flow

1. Click "Add Property" in the dashboard
2. Fill in the property form
3. Click "Create Property"
4. View the property in "All Properties"
5. Check the main app - it should automatically show the new property!

## 5. Connect Main App (Optional)

To connect your main app to the pipeline:

1. Create `.env` in project root:
   ```
   VITE_PIPELINE_API_URL=http://localhost:3001
   ```

2. Restart your main app dev server

The main app will now fetch properties from the pipeline API instead of static JSON.

## That's It! 🎉

You now have a fully functional property ingestion pipeline!

## Next Steps

- ✅ Authentication is now enabled! Configure credentials in `pipeline/backend/.env`
- Set up image upload functionality
- Deploy to production
- Migrate to a database for better scalability

See `AUTHENTICATION.md` for detailed authentication setup and configuration.

## Troubleshooting

**Backend won't start?**
- Check if port 3001 is available
- Make sure you're in `pipeline/backend` directory

**Dashboard can't connect?**
- Ensure backend is running first
- Check browser console for errors

**Properties not showing in main app?**
- Verify backend is running
- Check `.env` file has correct API URL
- Check browser network tab for API calls

