# Property Pipeline Dashboard

React-based dashboard for managing property listings in the Gani Properties pipeline.

## Features

- **Dashboard Overview**: View statistics and recent properties
- **Properties Management**: List, create, edit, and delete properties
- **Search & Filter**: Quickly find properties
- **Form Validation**: Comprehensive validation for property data
- **Real-time Updates**: Changes reflect immediately

## Setup

```bash
npm install
npm run dev
```

The dashboard will run on `http://localhost:3002`

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001
```

## Usage

1. Start the backend API server first (see `../backend/README.md`)
2. Start the dashboard
3. Navigate to `http://localhost:3002`
4. Use the sidebar to navigate between:
   - **Dashboard**: Overview and statistics
   - **All Properties**: List and manage all properties
   - **Add Property**: Create new property listings

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

