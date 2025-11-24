# Quick Guide: Customize Credentials & Token Duration

## 🚀 Quick Setup (3 Steps)

### Step 1: Create `.env` File
Create a file named `.env` in the `pipeline/backend/` directory.

### Step 2: Add Your Configuration
Copy and paste this template, then customize it:

```env
ADMIN_USERNAME=myusername
ADMIN_PASSWORD=MySecurePassword123!
JWT_SECRET=my-very-long-random-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
```

### Step 3: Restart Backend
Stop the backend (Ctrl+C) and restart it:
```bash
cd pipeline/backend
npm run dev
```

## ⏰ Token Duration Examples

Change `JWT_EXPIRES_IN` to keep you logged in longer:

| Value | Duration |
|-------|----------|
| `15m` | 15 minutes |
| `1h` | 1 hour |
| `24h` | 1 day (default) |
| `7d` | 1 week |
| `30d` | 1 month |
| `90d` | 3 months |

**Example for 30 days:**
```env
JWT_EXPIRES_IN=30d
```

## 🔐 Generate a Secure Secret

### Quick Method (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using OpenSSL:
```bash
openssl rand -base64 32
```

## 📝 Complete Example

Here's a complete `.env` file example:

```env
# Custom Username
ADMIN_USERNAME=gani-admin

# Strong Password
ADMIN_PASSWORD=G@niPr0p3rti3s2024!

# Generated Secret (64 characters)
JWT_SECRET=K8mN9pQ2rS5tV7wX0zA3bC5dE7fG9hJ1kL3mN5pQ7rS9tV1wX3yZ5aB7cD9eF1gH3

# Keep logged in for 30 days
JWT_EXPIRES_IN=30d

# Server Port
PORT=3001
```

## ✅ Verify It Works

1. Save your `.env` file
2. Restart the backend server
3. Go to dashboard login page
4. Use your new username and password
5. You should stay logged in for the duration you set!

## 📚 More Details

- **Full guide**: See `pipeline/backend/ENV_SETUP.md`
- **Authentication docs**: See `pipeline/AUTHENTICATION.md`

## ⚠️ Important Notes

- Never commit `.env` files to git
- Use strong passwords (12+ characters)
- Use long secrets (32+ characters)
- Restart server after changing `.env`

