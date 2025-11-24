# Sharing Your Local Development Server

## Quick Setup

Your dev server is running on `localhost:3000`. To share it with others, use the tunnel.

## Method 1: Using the Tunnel Script (Recommended)

1. **Open a NEW terminal window** (keep your dev server running in the first one)

2. **Run the tunnel:**
   ```bash
   npm run tunnel
   ```

3. **Copy BOTH the URL AND password** that appear:
   - URL: `https://xxxxx.loca.lt`
   - **Password**: Will be shown in the terminal output (look for "Tunnel password:" or similar)

4. **Share BOTH the URL and password** with your front person:
   - They'll need to enter the password when they first visit

5. **Keep both terminals open:**
   - Terminal 1: `npm run dev` (your Next.js server)
   - Terminal 2: `npm run tunnel` (the public tunnel)

**Note:** The password is shown in the terminal output when the tunnel starts. If you don't see it, check the terminal window where you ran `npm run tunnel`.

## Method 2: Using npx Directly

```bash
npx localtunnel --port 3000
```

## Notes

- The tunnel URL changes each time you restart it
- The tunnel only works while the terminal is open
- Both your dev server AND the tunnel must be running
- The URL is public, so anyone with the link can access it

## Alternative: Use ngrok (More Stable)

If you prefer ngrok (requires free account):

1. Sign up at https://ngrok.com
2. Install: `npm install -g ngrok`
3. Run: `ngrok http 3000`
4. Share the ngrok URL (stays the same with free account)

