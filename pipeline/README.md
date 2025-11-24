# Property Ingestion Pipeline

A complete property management system for Gani Properties, consisting of a backend API and a frontend dashboard for customers to upload and manage properties.

## Architecture

The pipeline consists of two main components:

1. **Backend API** (`backend/`) - Express.js API server for property CRUD operations
2. **Dashboard** (`dashboard/`) - React-based web application for property management

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Backend Setup

```bash
cd pipeline/backend
npm install
npm run dev
```

The backend API will run on `http://localhost:3001`

### Dashboard Setup

```bash
cd pipeline/dashboard
npm install
npm run dev
```

The dashboard will run on `http://localhost:3002`

## Features

### Backend API

- RESTful API for property management
- CRUD operations (Create, Read, Update, Delete)
- Data validation using Zod
- JSON file-based storage (easily upgradeable to database)
- CORS enabled for frontend integration

### Dashboard

- **Dashboard Overview**: Statistics and recent properties
- **Properties List**: View all properties with search and filtering
- **Property Form**: Create and edit properties with full validation
- **Real-time Updates**: Changes reflect immediately in the main app

## API Endpoints

### GET /api/properties
Get all properties

### GET /api/properties/:id
Get a single property by ID

### POST /api/properties
Create a new property

**Request Body:**
```json
{
  "title": "Premium Residential Plots",
  "type": "residential-plots",
  "city": "Bengaluru",
  "area": "Kattigenahalli",
  "priceLabel": "₹1 28–42 L",
  "size": "1200–2400 sq ft",
  "status": "available",
  "highlights": ["BBMP approved", "Gated community"],
  "lat": 13.2058,
  "lon": 77.5833,
  "images": ["https://example.com/image.jpg"],
  "description": "Premium residential plots..."
}
```

### PUT /api/properties/:id
Update an existing property

### DELETE /api/properties/:id
Delete a property

## Integration with Main App

The main application (`src/`) has been updated to fetch properties from the pipeline API. The API service (`src/lib/propertiesApi.ts`) includes:

- Automatic fallback to static JSON if API is unavailable
- Error handling and retry logic
- Type-safe property fetching

### Environment Variables

Set `VITE_PIPELINE_API_URL` in your main app's `.env` file to point to the backend API:

```
VITE_PIPELINE_API_URL=http://localhost:3001
```

If not set, it defaults to `http://localhost:3001`.

## Data Storage

Properties are stored in `pipeline/backend/data/properties.json`. This can be easily upgraded to use a database (PostgreSQL, MongoDB, etc.) by modifying the storage utilities in `backend/src/utils/storage.ts`.

## Development

### Backend Development

```bash
cd pipeline/backend
npm run dev    # Development with hot reload
npm run build  # Build for production
npm start      # Run production build
```

### Dashboard Development

```bash
cd pipeline/dashboard
npm run dev    # Development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Production Deployment

### Backend

1. Build the backend:
   ```bash
   cd pipeline/backend
   npm run build
   ```

2. Set environment variables:
   - `PORT` (default: 3001)

3. Start the server:
   ```bash
   npm start
   ```

### Dashboard

1. Build the dashboard:
   ```bash
   cd pipeline/dashboard
   npm run build
   ```

2. Set environment variables:
   - `VITE_API_URL` - Backend API URL

3. Serve the built files using a static file server (nginx, Vercel, Netlify, etc.)

## File Structure

```
pipeline/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── properties.ts    # Property routes
│   │   ├── middleware/
│   │   │   └── validation.ts    # Request validation
│   │   ├── utils/
│   │   │   └── storage.ts        # Data storage utilities
│   │   ├── types/
│   │   │   └── property.ts       # TypeScript types
│   │   └── server.ts             # Express server
│   ├── data/
│   │   └── properties.json       # Property data (auto-generated)
│   └── package.json
│
└── dashboard/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.tsx     # Dashboard overview
    │   │   ├── PropertiesList.tsx # Properties list
    │   │   └── PropertyForm.tsx   # Create/edit form
    │   ├── components/
    │   │   └── Layout.tsx         # Dashboard layout
    │   ├── api/
    │   │   └── properties.ts      # API client
    │   └── types/
    │       └── property.ts        # TypeScript types
    └── package.json
```

## Security Considerations

For production use, consider:

1. **Authentication**: Add user authentication to the dashboard
2. **Authorization**: Implement role-based access control
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **Input Sanitization**: Enhance validation and sanitization
5. **HTTPS**: Use HTTPS in production
6. **Database**: Migrate from JSON file to a proper database
7. **Image Upload**: Implement proper image upload handling (currently uses URLs)

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Ensure Node.js version is 18.x or higher
- Run `npm install` in the backend directory

### Dashboard can't connect to API
- Verify backend is running on port 3001
- Check CORS settings in backend
- Verify `VITE_API_URL` environment variable

### Properties not updating in main app
- Ensure backend API is running
- Check browser console for errors
- Verify API URL in main app's environment variables

## License

Part of the Gani Properties project.

