# Migration Checklist - Cloud Database

## Prerequisites
- [ ] Git repository initialized
- [ ] Clerk account created and configured
- [ ] Supabase account created

## Step 1: Supabase Setup
- [ ] Create Supabase project
- [ ] Wait for database initialization (~2 minutes)
- [ ] Navigate to Supabase SQL Editor
- [ ] Run `supabase-schema.sql` script
- [ ] Verify tables created: `lectures`, `attendance_records`
- [ ] Navigate to Settings → API
- [ ] Copy Supabase URL
- [ ] Copy Supabase Anon Key
- [ ] Configure Clerk integration in Supabase Dashboard
  - [ ] Go to Authentication → Providers → Clerk
  - [ ] Enable Clerk provider
  - [ ] Add Clerk domain

## Step 2: Clerk Configuration
- [ ] Log into Clerk Dashboard
- [ ] Navigate to Configure → Supabase
- [ ] Click "Activate Supabase integration"
- [ ] Copy Clerk domain shown
- [ ] Go to Clerk Dashboard → Keys
- [ ] Copy Publishable Key (starts with `pk_test_` or `pk_live_`)

## Step 3: Environment Variables
- [ ] Open `.env` file in project root
- [ ] Add/update these variables:
  ```bash
  VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxx
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- [ ] Save `.env` file

## Step 4: Local Testing
- [ ] Install dependencies (if needed): `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to `http://localhost:5173`
- [ ] Test sign in with Clerk
- [ ] Create a test lecture
- [ ] Verify lecture appears in dashboard
- [ ] Mark attendance for the lecture
- [ ] Verify attendance is recorded
- [ ] Refresh browser - data should persist
- [ ] Check Supabase Dashboard → Table Editor
  - [ ] Verify data in `lectures` table
  - [ ] Verify data in `attendance_records` table
  - [ ] Verify `user_id` matches Clerk user ID

## Step 5: Git Commit
- [ ] Review changes: `git status`
- [ ] Stage changes: `git add .`
- [ ] Commit changes: `git commit -m "Migrate to Supabase cloud database"`
- [ ] Push to remote: `git push origin main`

## Step 6: Cloudflare Pages Deployment
- [ ] Log into Cloudflare Dashboard
- [ ] Navigate to Workers & Pages → Pages
- [ ] Click "Create a project"
- [ ] Select "Connect to Git"
- [ ] Connect your repository
- [ ] Configure build settings:
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
- [ ] Add environment variables in Pages settings:
  - [ ] `VITE_CLERK_PUBLISHABLE_KEY`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Click "Save and Deploy"
- [ ] Wait for deployment to complete
- [ ] Access deployed site
- [ ] Test all functionality on deployed site

## Step 7: Post-Deployment Cleanup
- [ ] Verify all features work in production
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Remove old `src/db/db.ts` file: `rm src/db/db.ts`
- [ ] Remove idb dependency: `npm uninstall idb`
- [ ] Update `.env.example` if needed
- [ ] Commit cleanup changes

## Step 8: Documentation Updates (Optional)
- [ ] Update README.md with deployment instructions
- [ ] Add screenshots of the app
- [ ] Document any known issues
- [ ] Create user guide if needed

## Troubleshooting

### Clerk Not Working
- [ ] Check `VITE_CLERK_PUBLISHABLE_KEY` is set
- [ ] Verify key format (starts with `pk_`)
- [ ] Check Clerk Dashboard for allowed origins
- [ ] Clear browser cache and cookies

### Supabase Not Working
- [ ] Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Verify Supabase project is active
- [ ] Check RLS policies are enabled
- [ ] Test SQL queries in Supabase SQL Editor
- [ ] Check browser console for errors

### Build Errors
- [ ] Run `npm run build` locally
- [ ] Fix any TypeScript errors
- [ ] Run `npm run lint` and fix linting issues
- [ ] Check Cloudflare build logs

### Data Not Persisting
- [ ] Check browser console for errors
- [ ] Verify user is authenticated
- [ ] Check Supabase logs
- [ ] Test RLS policies with Clerk JWT

### CORS Errors
- [ ] Add deployed site URL to Clerk allowed origins
- [ ] Check Supabase CORS settings
- [ ] Verify environment variables are set correctly

## Success Criteria
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Users can only access their own data
- [ ] Data persists across sessions
- [ ] Data accessible from different devices
- [ ] No console errors in production
- [ ] All pages load correctly
- [ ] Responsive design works on mobile

## Next Steps (Optional)
- [ ] Set up analytics (Cloudflare Web Analytics)
- [ ] Configure custom domain
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add backup strategy for Supabase
- [ ] Implement real-time features with Supabase subscriptions
- [ ] Add data export functionality
- [ ] Implement offline support

## Important Notes
1. Never commit `.env` file to Git
2. Use different Supabase projects for dev and production
3. Use different Clerk keys for dev and production
4. Test thoroughly before promoting to production
5. Monitor Cloudflare build logs for errors
6. Keep Supabase RLS policies enabled at all times
7. Regular backups are not included in free tier (7-day retention only)
