# Fix: Changes Not Reflecting on Port 3000

## Quick Fix Steps

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Step 2: Clear Next.js Cache
Run this command in PowerShell:
```powershell
Remove-Item -Recurse -Force .next
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Clear Browser Cache
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) for hard refresh
- OR open DevTools (F12) → Network tab → Check "Disable cache"

## Alternative: Full Clean Restart

If the above doesn't work, do a full clean:

```powershell
# Stop dev server (Ctrl+C)

# Remove Next.js cache
Remove-Item -Recurse -Force .next

# Remove node_modules cache (optional but thorough)
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Restart dev server
npm run dev
```

## Verify Changes

1. Visit: `http://localhost:3000/catalogue`
   - Should show the new catalogue page with all categories

2. Visit: `http://localhost:3000/residential` (or any category page)
   - Should NOT show the dropdown anymore

3. Visit: `http://localhost:3000/property-type/residential-plots` (or any subcategory)
   - Should NOT show the "Browse by Category" section

## Common Issues

**Issue: Still seeing old content**
- Solution: Hard refresh browser (Ctrl+Shift+R)
- Or: Open DevTools → Application tab → Clear Storage → Clear site data

**Issue: Port 3000 already in use**
- Solution: Kill the process using port 3000:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  ```

**Issue: TypeScript errors preventing compilation**
- Check terminal for error messages
- Fix any TypeScript errors shown
- The dev server will automatically recompile once errors are fixed

