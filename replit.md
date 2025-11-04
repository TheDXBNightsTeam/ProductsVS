# Products VS - Smart Product Comparison Platform

## Overview

Products VS is a bilingual (English/Arabic) product comparison platform built with Next.js 15. The application combines 70+ pre-written static comparisons with AI-powered dynamic comparison generation using Groq's LLM API. It features a complete admin moderation system, comprehensive SEO optimization, and a focus on accessibility and performance.

**Core Purpose:** Enable users to make informed purchasing decisions by providing detailed, structured comparisons between products, services, and concepts across multiple categories (Technology, Entertainment, Travel, Lifestyle, Shopping, Automotive, Finance, Food & Beverages).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** Next.js 14 (App Router) with React 18
- Server Components by default for optimal performance
- Client Components (`"use client"`) only where interactivity is required
- TypeScript throughout for type safety

**Styling Strategy:**
- CSS-in-JS with inline styles and CSS variables
- Tailwind CSS v4 for utility classes (configured in `tailwind.config.js`)
- Custom CSS variable system in `app/globals.css` for theming
- Dark mode support via CSS class toggling (`.dark`)

**Key Design Patterns:**
- **Component Composition:** Reusable UI components in `/components` directory
- **Layout Pattern:** `PageLayout` wrapper component for consistent navigation/footer
- **Client-Side State:** React hooks (useState, useEffect) for local state
- **Theme Management:** Custom hook (`use-theme`) with localStorage persistence
- **Keyboard Navigation:** Custom hook (`use-keyboard-navigation`) for accessibility

**Routing Structure:**
- `/` - Home page with AI comparison form
- `/en` and `/ar` - Language-specific comparison listings
- `/comparison/[slug]` - Individual comparison pages
- `/ai-battle` - AI-powered comparison generator
- `/admin` - Admin dashboard (protected route)
- `/about`, `/contact`, `/terms`, `/privacy-policy` - Static pages

### Backend Architecture

**API Routes (Next.js Route Handlers):**
- `/api/generate` - AI comparison generation endpoint
- `/api/admin/auth` - Admin authentication
- `/api/admin/comparisons` - CRUD operations for comparisons
- All API routes are server-side only

**Authentication System:**
- JWT tokens with `jose` library
- Password hashing with `bcryptjs`
- HTTP-only cookies for token storage
- Middleware-based session validation
- Minimum 32-character secret requirement in production

**Data Flow:**
1. User submits comparison request
2. System checks database for existing approved comparison
3. If exists: return immediately with redirect to comparison page
4. If not: Generate via AI, save as "pending", return result immediately
5. Admin reviews and approves/rejects
6. Approved comparisons become public and indexed

**Security Measures:**
- Input sanitization with `dompurify`
- Rate limiting (5 requests/hour per IP)
- Security headers via middleware (CSP, XSS Protection, etc.)
- Environment variable validation
- No sensitive data in client-side code

### Data Storage

**Database:** Supabase (PostgreSQL)

**Schema Structure:**
- `comparisons` table: Stores all comparison data
  - Fields: slug, product names, category, comparison sections, scores, status (pending/approved/rejected)
  - Bilingual fields (title_en, title_ar, description_en, description_ar)
  - View count tracking
  - Timestamps (created_at, updated_at)

- `admin_users` table: Admin authentication
  - Fields: id, email, password_hash, name
  - No public read access (RLS policies)

**Row-Level Security (RLS):**
- Public read access for approved comparisons only
- Admin-only write access
- Service role key for server-side operations

**Database Client:**
- `@supabase/supabase-js` for database operations
- `@supabase/ssr` for server-side rendering compatibility
- Server-side client creation in `lib/supabase/server.ts`
- Middleware session handling in `lib/supabase/middleware.ts`

### External Dependencies

**AI Service:**
- **Groq API** (llama-3.1-70b-versatile model)
- API key required: `GROQ_API_KEY`
- Used for dynamic comparison generation
- Structured JSON response format with scores, pros/cons, detailed sections

**Analytics:**
- **Google Analytics 4** (optional)
  - Measurement ID: `GA_MEASUREMENT_ID`
  - Client-side tracking via `gtag.js`
- **Vercel Analytics** (@vercel/analytics)
  - Automatic deployment analytics
  - No configuration required

**Database:**
- **Supabase**
  - Required environment variables:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
  - PostgreSQL database with REST API
  - Real-time subscriptions (not currently used)

**Email/Notifications:**
- Not currently implemented
- Placeholder for future notification system when comparisons are approved

**Image Optimization:**
- Next.js Image component (`next/image`)
- Configured for WebP/AVIF support
- CDN caching via Vercel

**Development Tools:**
- TypeScript for type safety
- ESLint for code quality
- Playwright for E2E testing (configured, minimal tests)

**Required Environment Variables:**
```
NEXT_PUBLIC_SITE_URL=https://www.productsvs.com
JWT_SECRET=<min-32-characters>
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-key>
GROQ_API_KEY=<groq-api-key>
GA_MEASUREMENT_ID=<optional-ga4-id>
```

**Deployment Platform:** Vercel (optimized for Next.js)
- Automatic builds on git push
- Environment variable management
- Edge network CDN
- Serverless function execution