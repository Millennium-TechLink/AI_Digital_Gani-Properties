# Add Properties Script

This script adds dummy properties to the database through the admin API.

## Usage

1. Make sure the backend server is running:
   ```bash
   npm run dev
   ```

2. In a new terminal, run the script:
   ```bash
   npm run add-properties
   ```

## Environment Variables

The script uses the following environment variables (from `.env` file):
- `API_URL` - Backend API URL (default: http://localhost:3001)
- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)

## What it does

The script will:
1. Login to the admin API
2. Add 12 properties (3 each for Commercial, Retail, Hospitality, and Industrial categories)
3. Display a summary of successful and failed additions

## Properties Added

- **Commercial**: 3 properties
- **Retail**: 3 properties  
- **Hospitality**: 3 properties
- **Industrial**: 3 properties

Total: 12 properties

