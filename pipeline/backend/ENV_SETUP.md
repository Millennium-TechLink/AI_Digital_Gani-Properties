# Environment Variables Setup

This guide shows you how to customize your credentials and token expiration.

## Quick Setup

1. **Create a `.env` file** in `pipeline/backend/` directory
2. **Copy the template below** and customize it
3. **Restart the backend server** for changes to take effect

## Environment Variables Template

Create `pipeline/backend/.env` with the following:

```env
# ============================================
# AUTHENTICATION CONFIGURATION
# ============================================

# Your login username
ADMIN_USERNAME=your-username-here

# Your login password (use a strong password!)
ADMIN_PASSWORD=your-secure-password-here

# JWT Secret Key (IMPORTANT: Use a long, random string)
# Generate one with: openssl rand -base64 32
# Or use an online generator: https://randomkeygen.com/
JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters-recommended

# Token Expiration Time (see formats below)
JWT_EXPIRES_IN=7d

# ============================================
# SERVER CONFIGURATION
# ============================================

# Port for the backend API (default: 3001)
PORT=3001
```

## Token Expiration Formats

The `JWT_EXPIRES_IN` supports various time formats:

### Examples:

```env
# Short durations
JWT_EXPIRES_IN=15m      # 15 minutes
JWT_EXPIRES_IN=1h       # 1 hour
JWT_EXPIRES_IN=2h       # 2 hours
JWT_EXPIRES_IN=12h      # 12 hours

# Days
JWT_EXPIRES_IN=1d       # 1 day
JWT_EXPIRES_IN=7d       # 7 days (1 week)
JWT_EXPIRES_IN=30d      # 30 days (1 month)
JWT_EXPIRES_IN=90d      # 90 days (3 months)

# Weeks
JWT_EXPIRES_IN=1w       # 1 week
JWT_EXPIRES_IN=4w       # 4 weeks

# Very long (not recommended for security)
JWT_EXPIRES_IN=365d     # 1 year
```

### Format Options:
- `s` = seconds (e.g., `3600s` = 1 hour)
- `m` = minutes (e.g., `60m` = 1 hour)
- `h` = hours (e.g., `24h` = 1 day)
- `d` = days (e.g., `7d` = 1 week)
- `w` = weeks (e.g., `4w` = 1 month)

## Recommended Settings

### For Development:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=dev-password-123
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

### For Production:
```env
ADMIN_USERNAME=your-production-username
ADMIN_PASSWORD=very-strong-random-password-here
JWT_SECRET=very-long-random-secret-min-32-chars-use-openssl-or-generator
JWT_EXPIRES_IN=7d
```

## Generating a Secure JWT Secret

### Option 1: Using OpenSSL (Recommended)
```bash
openssl rand -base64 32
```

### Option 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator
Visit: https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys" or similar

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** (minimum 12 characters, mix of letters, numbers, symbols)
3. **Use a long JWT secret** (minimum 32 characters, ideally 64+)
4. **Don't use default values** in production
5. **Rotate secrets periodically** in production environments
6. **Use shorter expiration times** for better security (7-30 days is reasonable)

## Applying Changes

After creating or modifying your `.env` file:

1. **Stop the backend server** (Ctrl+C)
2. **Restart it**:
   ```bash
   cd pipeline/backend
   npm run dev
   ```
3. **Test login** with your new credentials

## Troubleshooting

**Credentials not working?**
- Make sure `.env` file is in `pipeline/backend/` directory
- Check for typos in variable names (they're case-sensitive)
- Restart the backend server after changes
- Verify no extra spaces around the `=` sign

**Token expires too quickly?**
- Check your `JWT_EXPIRES_IN` format is correct
- Make sure you restarted the server after changing it
- Verify the format matches one of the examples above

**Can't find .env file?**
- Make sure it's named exactly `.env` (with the dot at the start)
- Check it's in the `pipeline/backend/` directory
- On Windows, you may need to create it as `.env.` (with trailing dot) and Windows will rename it

