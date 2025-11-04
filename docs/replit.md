# ProductsVS - Replit Project Documentation

## Overview
ProductsVS is an AI-powered bilingual (English & Arabic) comparison platform built with Next.js 14. The application allows users to compare products and services with comprehensive, unbiased analysis across technology, lifestyle, services, and more.

## Recent Changes
- **2024-11-03**: Fixed critical hydration error
  - Resolved React hydration mismatch by moving theme script from `<head>` to `<body>` tag
  - Fixed TypeScript errors in keyboard navigation hook
  - Added favicon files and autocomplete attributes for better accessibility
  - Removed unused `src/app/` directory for cleaner project structure
- **2024-11-02**: Migrated from Vercel to Replit
  - Configured Next.js dev/start scripts to bind to port 5000 on 0.0.0.0 for Replit compatibility
  - Set up autoscale deployment configuration
  - Added JWT_SECRET validation to prevent insecure fallback values
  - All required environment variables configured in Replit Secrets

## Project Architecture

### Tech Stack
- **Framework**: Next.js 14.2.33 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Groq SDK for AI-powered comparisons
- **Authentication**: JWT-based admin authentication with bcryptjs
- **Styling**: Tailwind CSS 4.1.9 with custom animations
- **Analytics**: Vercel Analytics

### Key Directories
- `/app/` - Next.js app router pages and API routes
- `/components/` - React components including admin panel (moved from src/)
- `/lib/` - Utility libraries (database, auth, AI) (moved from src/)
- `/supabase/migrations/` - Database migration files
- `/public/` - Static assets

### Environment Variables
All secrets are managed via Replit Secrets (required):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-side only)
- `GROQ_API_KEY` - Groq AI API key for comparison generation
- `JWT_SECRET` - JWT signing secret (minimum 32 characters, REQUIRED)

Optional:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- `NEXT_PUBLIC_SITE_URL` - Production site URL

## User Preferences
None documented yet.

## Known Issues
1. **CSP Warning**: Content Security Policy blocks AdSense script in development (uses placeholder publisher ID). This is expected behavior. Update CSP headers when adding real AdSense credentials for production.

## Development Workflow
- **Dev Server**: `npm run dev` (runs on port 5000, bound to 0.0.0.0)
- **Build**: `npm run build`
- **Production**: `npm run start` (runs on port 5000, bound to 0.0.0.0)
- **Testing**: `npm run test` (Playwright tests)

## Deployment
- **Target**: Replit Autoscale
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port**: 5000 (configured for Replit)

## Security Practices
- No hardcoded secrets or API keys in code
- JWT_SECRET validation prevents insecure defaults
- Client/server separation maintained
- Supabase Row Level Security policies in place
- Password hashing with bcryptjs (10 rounds)
