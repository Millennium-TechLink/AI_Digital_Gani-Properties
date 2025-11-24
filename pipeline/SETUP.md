# Pipeline Setup Guide

Follow these steps to set up and run the property ingestion pipeline.

## Step 1: Install Backend Dependencies

```bash
cd pipeline/backend
npm install
```

## Step 2: Install Dashboard Dependencies

```bash
cd ../dashboard
npm install
```

## Step 3: Initialize Backend Data (Optional)

If you have existing properties in `src/data/properties.json`, you can copy them to the backend:

```bash
# From project root
cp src/data/properties.json pipeline/backend/data/properties.json
```

Or the backend will create an empty file automatically on first run.

## Step 4: Start Backend API

In one terminal:

```bash
cd pipeline/backend
npm run dev
```

The API will be available at `http://localhost:3001`

## Step 5: Start Dashboard

In another terminal:

```bash
cd pipeline/dashboard
npm run dev
```

The dashboard will be available at `http://localhost:3002`

## Step 6: Configure Main App (Optional)

To connect the main app to the pipeline API, create a `.env` file in the project root:

```env
VITE_PIPELINE_API_URL=http://localhost:3001
```

If not set, the main app will fall back to using static JSON files.

## Verification

1. **Backend Health Check**: Visit `http://localhost:3001/health`
2. **Backend API**: Visit `http://localhost:3001/api/properties`
3. **Dashboard**: Visit `http://localhost:3002` and log in
4. **Main App**: Visit your main app and verify properties load from the API

## Troubleshooting

### Port Already in Use

If port 3001 or 3002 is already in use:

**Backend**: Set `PORT` environment variable
```bash
PORT=3003 npm run dev
```

**Dashboard**: Modify `vite.config.ts` port setting

### CORS Issues

If you see CORS errors, ensure the backend has CORS enabled (it should by default).

### Properties Not Loading

1. Check that backend is running
2. Check browser console for errors
3. Verify API URL in environment variables
4. Check network tab for API requests

## Next Steps

- Add authentication to the dashboard
- Set up image upload functionality
- Migrate to a database (PostgreSQL, MongoDB, etc.)
- Deploy to production

