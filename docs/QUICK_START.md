# Quick Start Guide - Supabase Migration

## What Was Done
✅ Migrated from IndexedDB to Supabase PostgreSQL
✅ Added Clerk integration for authentication
✅ Implemented Row Level Security (RLS)
✅ Configured Cloudflare Pages deployment

## 5-Minute Setup

### 1. Create Supabase Project (2 min)
1. Go to https://supabase.com
2. Sign up and create new project
3. Wait ~2 minutes for initialization
4. Open SQL Editor and paste contents of `supabase-schema.sql`
5. Execute the script

### 2. Configure Clerk Integration (1 min)
1. In Clerk Dashboard → Configure → Supabase
2. Click "Activate Supabase integration"
3. Copy Clerk domain
4. In Supabase Dashboard → Authentication → Providers → Clerk
5. Paste Clerk domain

### 3. Get Environment Variables (1 min)
From **Clerk Dashboard** → Keys:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxx
```

From **Supabase Dashboard** → Settings → API:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Update `.env` File (30 sec)
Open `.env` in project root and add:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Test Locally (30 sec)
```bash
npm run dev
```
Open http://localhost:5173 and sign in!

## Deploy to Cloudflare Pages

1. Push code to Git:
```bash
git add .
git commit -m "Migrate to Supabase"
git push
```

2. Connect Cloudflare Pages:
   - Go to Workers & Pages → Create project
   - Connect to Git repository
   - Build command: `npm run build`
   - Output directory: `dist`

3. Add environment variables in Cloudflare Pages settings:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Deploy and access at: `https://your-project.pages.dev`

## Files Created/Modified

### New Files
- `src/utils/supabase.ts` - Supabase client factory
- `src/db/cloud-db.ts` - Database operations using Supabase
- `supabase-schema.sql` - Database schema
- `.env.example` - Environment template
- `MIGRATION_SUMMARY.md` - Detailed migration notes
- `CLOUDFLARE_DEPLOYMENT.md` - Deployment guide
- `MIGRATION_CHECKLIST.md` - Complete checklist

### Modified Files
- `src/store/useStore.ts` - Uses Supabase now
- `src/App.tsx` - Clerk token setup
- `src/utils/dateUtils.ts` - Import updates
- `src/utils/ocrUtils.ts` - Import updates
- `src/components/ManualTimetableEntry.tsx` - Import updates
- `src/components/OCRUploader.tsx` - Import updates

### Dependencies
- Added: `@supabase/supabase-js`

## Next Steps (After Testing)

1. Remove old IndexedDB code:
```bash
rm src/db/db.ts
npm uninstall idb
```

2. Commit cleanup:
```bash
git add .
git commit -m "Remove IndexedDB code"
git push
```

## Need Help?

Check these documents:
- `MIGRATION_SUMMARY.md` - Detailed technical overview
- `MIGRATION_CHECKLIST.md` - Step-by-step checklist
- `CLOUDFLARE_DEPLOYMENT.md` - Full deployment guide

## Key Benefits
✅ Data accessible from any device
✅ Automatic cloud backups
✅ User isolation via RLS
✅ No local storage limits
✅ Real-time sync ready

## Architecture
```
User → Clerk (auth) → Supabase PostgreSQL (cloud)
        ↓ JWT token
           ↓
  utils/supabase.ts (client factory)
           ↓
  db/cloud-db.ts (CRUD operations)
```

All queries are client-side - no serverless functions needed!
