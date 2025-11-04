# Products VS - AI-Powered Bilingual Comparison Platform

## Overview

Products VS is a comprehensive product comparison platform that provides users with detailed, unbiased comparisons across multiple categories. The platform features both static, expertly-written comparisons and AI-generated comparisons powered by Groq's Llama model. Built with Next.js 14 and designed for both English and Arabic audiences, it includes an admin dashboard for content moderation, SEO optimization, and comprehensive accessibility features.

The application serves as a decision-making tool, helping users compare products, services, and concepts through structured analysis, ratings, voting systems, and AI-powered insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 14 (App Router)
- Server-side rendering for optimal SEO and performance
- Client-side interactivity using React 18
- TypeScript for type safety across the codebase

**Styling Solution**: Hybrid approach combining:
- Custom CSS-in-JS with CSS variables for theming
- Tailwind CSS 4.1.9 for utility classes
- Shadcn/ui component library for consistent UI elements
- Custom animations using `tw-animate-css`

**Design Patterns**:
- **Minimalist Black & White Theme**: High-contrast design focused on readability
- **Dark Mode Support**: Complete theming system with light/dark/system preferences
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Component Composition**: Reusable UI components following atomic design principles

**Key Features**:
- Bilingual support (English/Arabic) with RTL layout handling
- Keyboard navigation and WCAG 2.1 AA accessibility compliance
- Progressive enhancement with graceful degradation
- Custom hooks for theme management, keyboard navigation, and focus management

### Backend Architecture

**Database**: Supabase (PostgreSQL)
- Row-Level Security (RLS) policies for data protection
- Tables for comparisons, admin users, votes, ratings, comments, and user profiles
- Migration-based schema management

**Authentication & Authorization**:
- JWT-based admin authentication using `jose` library
- bcryptjs for password hashing
- HTTP-only cookies for session management
- Middleware-based session validation

**API Design**:
- RESTful API routes using Next.js Route Handlers
- Server-side validation and sanitization (DOMPurify)
- Rate limiting for AI generation endpoints
- Error handling with structured error responses

**AI Integration**:
- Groq SDK for AI-powered comparisons
- Uses Llama 3.1 70B Versatile model
- Structured prompt engineering for consistent output
- Fallback handling for API failures

**Security Measures**:
- Security headers (CSP, HSTS, X-Frame-Options, etc.) via middleware
- Input sanitization on all user-generated content
- CSRF protection through SameSite cookie attributes
- Environment variable validation on startup

### Data Storage Solutions

**Primary Database**: Supabase PostgreSQL
- Stores comparison data, user profiles, votes, ratings, comments
- Historical price tracking for products
- Admin moderation queues and analytics data

**Client-Side Storage**: localStorage
- User favorites persistence
- Theme preferences
- Browsing history tracking

**Static Assets**: 
- Images and media files served from `/public` directory
- Optimization through Next.js Image component

### Content Management

**Static Comparisons**:
- 70+ pre-written comparisons stored in `comparisons-data.ts`
- Organized across 8 categories (Technology, Entertainment, Travel, Lifestyle, E-commerce, Automotive, Finance, Food)
- SEO-optimized with custom metadata per page

**AI-Generated Comparisons**:
- User-submitted requests stored in database with "pending" status
- Admin moderation workflow for approval/rejection
- Approved comparisons become searchable and indexable

**Moderation System**:
- Admin dashboard with analytics and filtering
- CSV export functionality for data analysis
- Batch operations for content management

### SEO & Analytics Architecture

**SEO Features**:
- Dynamic sitemap generation
- Structured data (Schema.org) for Organization, Website, Article, FAQ
- Open Graph and Twitter Card meta tags
- Canonical URLs and language alternates
- NAP (Name, Address, Phone) consistency components

**Analytics Integration**:
- Google Analytics 4 tracking
- Vercel Analytics for performance monitoring
- Custom event tracking for user interactions

**Performance Optimization**:
- Server-side rendering for critical content
- Image optimization with Next.js Image
- Code splitting and lazy loading
- CSS variable-based theming for minimal runtime overhead

### Accessibility Features

**WCAG 2.1 AA Compliance**:
- Proper heading hierarchy (h1-h6)
- ARIA labels and landmarks
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Skip to content link (Alt+S)
- Focus trap in modals and dropdowns

**Color Contrast**:
- 21:1 contrast ratio in light mode
- 19.6:1 contrast ratio in dark mode
- High-contrast focus indicators (3px solid outline)

**Screen Reader Support**:
- Semantic HTML structure
- Alt text for images
- Live regions for dynamic content updates

## External Dependencies

### Third-Party Services

**Supabase** (Database & Authentication Backend)
- PostgreSQL database hosting
- Real-time subscriptions (not currently used but available)
- File storage capabilities (not currently used)
- Row-Level Security for data access control

**Groq AI** (AI Comparison Generation)
- API endpoint: Groq SDK for Node.js
- Model: llama-3.1-70b-versatile
- Used for generating custom product comparisons
- Requires API key configuration

**Vercel** (Hosting & Analytics)
- Deployment platform with automatic CI/CD
- Edge functions for API routes
- Performance analytics and monitoring

**Google Analytics 4** (Optional Analytics)
- Page view tracking
- User behavior analysis
- Custom event tracking

### NPM Packages

**Core Framework**:
- `next@14.2.33` - React framework
- `react@18.3.1` & `react-dom@18.3.1` - UI library
- `typescript@22` - Type safety

**Database & Auth**:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side Supabase helpers
- `jose` - JWT handling
- `bcryptjs` - Password hashing

**AI Integration**:
- `groq-sdk` - Groq AI API client

**UI & Styling**:
- `tailwindcss@4.1.9` - Utility CSS framework
- `lucide-react@0.454.0` - Icon library
- `class-variance-authority` - Component variant management
- `tailwind-merge` - Conditional class merging
- `clsx` - Class name utilities
- Radix UI primitives (via shadcn/ui components)

**Security**:
- `dompurify@3.0.8` - HTML sanitization

**Development**:
- `@playwright/test` - End-to-end testing
- `@types/*` packages - TypeScript definitions

### Environment Variables Required

**Production**:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key
- `API-KEY_GROQ_API_KEY` - Groq AI API key
- `JWT_SECRET` - JWT signing secret (min 32 characters)

**Optional**:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SITE_URL` - Production site URL

### API Rate Limits & Quotas

**Groq AI**:
- Rate limiting implemented client-side to prevent abuse
- Caching not currently implemented but recommended for production

**Supabase**:
- Free tier limits apply to database operations
- RLS policies enforce data access restrictions