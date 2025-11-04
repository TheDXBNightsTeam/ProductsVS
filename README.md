# Products VS - Smart Product Comparison Platform

A comprehensive product comparison platform built with Next.js 15, featuring AI-powered comparisons, bilingual support (English & Arabic), and a complete admin moderation system.

## ✨ Features

- **70+ Static Comparisons** - Pre-written detailed comparisons across 9 categories
- **AI Battle** - Generate custom comparisons using Groq AI (llama-3.1-70b-versatile)
- **Bilingual Support** - Full English and Arabic language support with RTL
- **Admin Dashboard** - Complete moderation system with analytics and CSV export
- **SEO Optimized** - Dynamic sitemap, meta tags, Schema.org markup
- **Secure** - Rate limiting, input sanitization, security headers
- **Analytics** - Google Analytics 4 and Vercel Analytics integration
- **Responsive** - Mobile-first design with smooth animations
- **Dark Mode** - Theme toggle with system preference support
- **Performance** - Image optimization, API caching, lazy loading

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API (llama-3.1-70b-versatile)
- **Styling**: CSS-in-JS with Tailwind utilities
- **Authentication**: JWT with bcryptjs
- **Analytics**: Google Analytics 4, Vercel Analytics
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProductsVS-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in all required variables (see `ENV_SETUP.md` for details)

4. **Set up Supabase**
   - Create a Supabase project
   - Run migrations from `supabase/migrations/`
   - Create admin user (see `docs/ADMIN_GUIDE.md`)

5. **Run development server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **ENV_SETUP.md** - Environment variables setup
- **PRODUCTION_READINESS.md** - Production deployment checklist
- **PRE_DEPLOYMENT_CHECKLIST.md** - Pre-deployment verification
- **docs/ADMIN_GUIDE.md** - Admin dashboard guide
- **docs/DEPLOYMENT.md** - Deployment instructions

## 🎯 Key Features

### AI-Powered Comparisons
- Generate custom comparisons instantly
- Real-time AI analysis
- Pending approval workflow
- SEO-friendly after approval

### Admin Dashboard
- Review pending comparisons
- Approve/reject with reasons
- Analytics and statistics
- CSV export functionality

### SEO & Performance
- Dynamic sitemap (approved only)
- Structured data (Schema.org)
- Image optimization
- API response caching
- Lazy loading

### Security
- JWT authentication
- Rate limiting (5 req/hour)
- Input sanitization
- Security headers
- XSS protection

## 📦 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── comparison/        # Comparison pages
│   └── ...
├── components/            # React components
├── lib/                   # Utilities & helpers
├── public/               # Static assets
├── supabase/             # Database migrations
└── docs/                 # Documentation
```

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Verify no errors**
   ```bash
   npm run lint
   ```

3. **Deploy to Vercel**
   - Connect your repository
   - Set environment variables
   - Deploy!

See `PRE_DEPLOYMENT_CHECKLIST.md` for complete checklist.

## 📝 License

All rights reserved.

## 👥 Support

For issues and questions, please refer to the documentation in the `docs/` folder.

---

**Built with ❤️ using Next.js 15**

