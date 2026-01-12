# Documentation Index

## 📚 Table of Contents

### Quick Start
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes

### Migration Guides
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Overview of the IndexedDB to Supabase migration
- **[MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md)** - Complete step-by-step checklist

### Deployment
- **[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)** - Guide for deploying to Cloudflare Pages

### Other Guides
- **[android_migration_guide.md](android_migration_guide.md)** - Android/Capacitor migration guide
- **[implementation_plan.md](implementation_plan.md)** - Original implementation plan
- **[walkthrough.md](walkthrough.md)** - Project walkthrough

### Configuration
- **[supabase-schema.sql](supabase-schema.sql)** - Database schema for Supabase setup

### Development Notes
- **[AGENTS.md](AGENTS.md)** - Agent configuration for development
- **[PROMPT_FOR_NEXT_AGENT.md](PROMPT_FOR_NEXT_AGENT.md)** - Agent handoff documentation
- **[task.md](task.md)** - Original task specification

---

## 🚀 Recommended Reading Order

1. **New to the project?**
   - Start with [README.md](../README.md) in the project root
   - Then read [QUICK_START.md](QUICK_START.md)

2. **Setting up cloud database?**
   - Follow [MIGRATION_CHECKLIST.md](MIGRATION_CHECKLIST.md) for complete setup

3. **Deploying to production?**
   - Read [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)

4. **Building mobile app?**
   - Check [android_migration_guide.md](android_migration_guide.md)

---

## 🔧 Quick Reference

### Environment Variables
Required variables (see `.env.example`):
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Key Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Install dependencies
npm install
```

### Database Setup
1. Create Supabase project
2. Run `supabase-schema.sql` in SQL Editor
3. Configure Clerk integration
4. Add environment variables

---

## 📖 Documentation Format

- **QUICK_START** - Short, step-by-step guides
- **SUMMARY** - Detailed technical overviews
- **CHECKLIST** - Complete verification lists
- **DEPLOYMENT** - Platform-specific deployment guides
- **GUIDE** - Feature-specific tutorials

---

## 🆘 Need Help?

1. Check the relevant guide in this folder
2. Review the [README.md](../README.md) in project root
3. Check the code comments in `src/` directory
