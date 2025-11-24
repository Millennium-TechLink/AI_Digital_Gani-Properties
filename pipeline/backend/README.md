# Property Pipeline Backend API

Backend API server for the property ingestion pipeline.

## Setup

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in this directory to customize credentials and settings:

```env
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3001
```

**See `ENV_SETUP.md` for detailed configuration guide.**

Default credentials (development only):
- Username: `admin`
- Password: `admin123`
- Token expires: `24h` (1 day)

## Development

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Production

```bash
npm run build
npm start
```

## API Endpoints

### GET /api/properties
Get all properties

### GET /api/properties/:id
Get a single property by ID

### POST /api/properties
Create a new property

**Body:**
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

## Data Storage

Properties are stored in `data/properties.json` in the backend directory.

