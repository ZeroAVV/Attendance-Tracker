# Cloudflare Pages Deployment Guide

## Prerequisites
- Git repository with the project
- Cloudflare account
- Supabase project with configured environment variables

## Steps

### 1. Push Code to Git Repository
```bash
git add .
git commit -m "Migrate to Supabase cloud database"
git push origin main
```

### 2. Connect Cloudflare Pages to Git
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Workers & Pages → Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your Git provider (GitHub, GitLab, etc.)
6. Select the repository

### 3. Configure Build Settings
Set the following in the build configuration:
- **Project name**: `attendance-tracker` (or your preferred name)
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 4. Add Environment Variables
In the Pages project settings, add these environment variables:

From Clerk Dashboard:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxx
```

From Supabase Dashboard → Settings → API:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Deploy
Click "Save and Deploy". Cloudflare will:
1. Pull the latest code
2. Install dependencies
3. Run the build command
4. Deploy to global CDN

### 6. Access Your Site
After deployment, your site will be available at:
```
https://your-project-name.pages.dev
```

You can configure a custom domain in Pages settings.

## Environment vs Production
For development and testing:
- Use `pk_test_` keys from Clerk
- Use Supabase test project

For production:
- Use `pk_live_` keys from Clerk
- Use separate Supabase production project
- Create production environment in Cloudflare Pages

## Automatic Deployments
Cloudflare Pages will automatically redeploy when:
- Code is pushed to the main branch
- Pull requests are merged to main

You can configure preview deployments for feature branches.

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`

### Environment Variables Not Working
- Variables must start with `VITE_` to be accessible in Vite
- Double-check variable names and values
- Redeploy after adding environment variables

### Clerk Auth Not Working
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set
- Check Clerk Dashboard for allowed origins
- Ensure Clerk integration with Supabase is active

### Supabase Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase RLS policies allow operations
- Ensure Clerk integration is configured in Supabase

## Performance Tips
- Cloudflare automatically caches static assets
- Enable Brotli compression in Pages settings
- Use Cloudflare's global CDN for faster loading

## Additional Configuration

### Custom Domain
1. Go to Pages project → Custom domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed
4. Enable SSL certificate

### Analytics
- Enable Web Analytics in Pages settings
- Monitor performance and visitor metrics

### Access Control
- Set up Cloudflare Access for password protection (optional)
- Configure IP allowlists if needed

## Rollbacks
If a deployment breaks your site:
1. Go to Pages project → Deployments
2. Find a previous successful deployment
3. Click "Rollback to this deployment"

## Monitoring
Check Cloudflare Dashboard for:
- Build status
- Deployment logs
- Analytics
- Error rates
