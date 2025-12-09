# Files to Copy from Parent Directory

To complete the dynamic version setup, copy these files/folders from the parent directory:

## Required Files

### 1. Frontend Source Files
```
Copy entire folders:
- src/          → dynamic/src/
- public/       → dynamic/public/
- scripts/      → dynamic/scripts/
```

### 2. Optional Configuration Files
```
Copy if needed:
- eslint.config.mjs  → dynamic/eslint.config.mjs
```

## What NOT to Copy

- `node_modules/` - Will be installed via `npm install`
- `dist/` - Will be generated on build
- `.env` - Create new with Supabase credentials
- `package-lock.json` - Will be generated

## Quick Copy Commands

### On Windows (PowerShell):
```powershell
# From project root
Copy-Item -Path "src" -Destination "dynamic\src" -Recurse -Force
Copy-Item -Path "public" -Destination "dynamic\public" -Recurse -Force
Copy-Item -Path "scripts" -Destination "dynamic\scripts" -Recurse -Force
```

### On Mac/Linux:
```bash
# From project root
cp -r src dynamic/
cp -r public dynamic/
cp -r scripts dynamic/
```

## After Copying

1. **Install dependencies:**
   ```bash
   cd dynamic
   npm install
   ```

2. **Create .env file** with Supabase credentials

3. **Setup Supabase database** using `DATABASE_SETUP.sql`

4. **Run migration** (if needed):
   ```bash
   node scripts/migrate-to-supabase.js
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Notes

- The `src/lib/propertiesApi.ts` has already been updated in dynamic version (removed static fallback)
- All API files in `api/` are already set up for Supabase
- Configuration files are already created

---

**See `SETUP_GUIDE.md` for complete setup instructions.**

