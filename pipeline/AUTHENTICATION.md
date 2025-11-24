# Authentication Setup Guide

This guide explains how authentication works for the dashboard and how to configure it.

## Overview

The dashboard uses JWT (JSON Web Token) based authentication. All dashboard routes and API endpoints (except public GET requests) are protected and require authentication.

## Default Credentials

**Development Defaults:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change these credentials in production!

## Configuration

### Backend Configuration

Create a `.env` file in `pipeline/backend/` with the following variables:

```env
# Authentication Configuration
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-secret-key-change-in-production-min-32-characters
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
```

**Token Expiration Examples:**
- `15m` = 15 minutes
- `1h` = 1 hour
- `24h` = 1 day (default)
- `7d` = 7 days
- `30d` = 30 days
- `90d` = 90 days

See `pipeline/backend/ENV_SETUP.md` for detailed configuration guide and examples.

**Security Notes:**
- Use a strong, random `JWT_SECRET` (at least 32 characters)
- Use a secure password for `ADMIN_PASSWORD`
- Never commit `.env` files to version control

### Dashboard Configuration

The dashboard automatically connects to the backend API. If your backend is running on a different URL, create a `.env` file in `pipeline/dashboard/`:

```env
VITE_API_URL=http://localhost:3001
```

## How It Works

### Frontend (Dashboard)

1. **Login Page**: Users are redirected to `/login` if not authenticated
2. **Auth Context**: Manages authentication state and token storage
3. **Protected Routes**: All dashboard routes require authentication
4. **Token Storage**: JWT tokens are stored in `localStorage`

### Backend (API)

1. **Login Endpoint**: `/api/auth/login` validates credentials and returns a JWT token
2. **Protected Routes**: POST, PUT, DELETE operations require authentication
3. **Public Routes**: GET requests to `/api/properties` remain public (for main app)
4. **Middleware**: `authenticateToken` middleware validates JWT tokens on protected routes

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username and password
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  Returns:
  ```json
  {
    "success": true,
    "token": "jwt-token-here",
    "message": "Login successful"
  }
  ```

- `GET /api/auth/verify` - Verify if token is valid (optional)

### Protected Endpoints

All of these require a `Authorization: Bearer <token>` header:

- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/upload/images` - Upload images
- `DELETE /api/upload/images/:filename` - Delete image

### Public Endpoints

These don't require authentication (for main app):

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property

## Usage

1. **Start Backend**: 
   ```bash
   cd pipeline/backend
   npm run dev
   ```

2. **Start Dashboard**:
   ```bash
   cd pipeline/dashboard
   npm run dev
   ```

3. **Access Dashboard**: Navigate to `http://localhost:3002`

4. **Login**: Use your configured credentials (default: admin/admin123)

5. **Logout**: Click the logout button in the sidebar

## Security Best Practices

1. **Change Default Credentials**: Always change the default username and password
2. **Use Strong JWT Secret**: Generate a random, secure secret key
3. **HTTPS in Production**: Always use HTTPS in production environments
4. **Token Expiration**: Tokens expire after 24 hours by default (configurable)
5. **Environment Variables**: Never commit credentials to version control

## Troubleshooting

**Can't log in?**
- Check that backend is running
- Verify credentials in backend `.env` file
- Check browser console for errors

**API requests failing?**
- Verify token is being sent in Authorization header
- Check token hasn't expired (try logging in again)
- Ensure backend authentication middleware is working

**Token expired?**
- Simply log in again to get a new token
- Tokens are automatically refreshed on login

