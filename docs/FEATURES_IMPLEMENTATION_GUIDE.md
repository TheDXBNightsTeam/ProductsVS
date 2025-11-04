# Features Implementation Guide

This document provides a comprehensive guide for implementing all the advanced features for the Products VS comparison website.

## Completed Features

### 1. Database Schema
All database tables have been created with proper RLS policies:
- `votes` - User voting system
- `ratings` - Product ratings (1-5 stars)
- `comments` - Comment system with moderation
- `comment_likes` - Like system for comments
- `comment_reports` - Report system for spam/inappropriate comments
- `products` - Product information with prices
- `price_history` - Historical price tracking
- `price_alerts` - User price alert subscriptions
- `user_profiles` - User profile information
- `user_favorites` - User favorite comparisons
- `user_comparison_history` - User browsing history

### 2. Voting and Rating System
Implemented components:
- `VotingSection` - Interactive voting UI with live results
- `RatingSection` - Star rating system for products
- API endpoints: `/api/vote`, `/api/rate`, `/api/vote/stats`, `/api/rate/stats`
- Database functions for aggregating statistics

## Features To Implement

### 3. Comments System with Moderation

#### Backend API Endpoints

Create these files:

**`app/api/comments/route.ts`**
\`\`\`typescript
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("comparison_slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
  
  return NextResponse.json({ data, error })
}

export async function POST(request: NextRequest) {
  const { comparisonSlug, userName, userEmail, commentText } = await request.json()
  
  const supabase = await createClient()
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  
  const { data, error } = await supabase
    .from("comments")
    .insert({
      comparison_slug: comparisonSlug,
      user_name: userName,
      user_email: userEmail,
      comment_text: commentText,
      ip_address: ipAddress,
      status: "pending"
    })
    .select()
    .single()
  
  return NextResponse.json({ data, error })
}
\`\`\`

**`app/api/comments/[id]/like/route.ts`**
\`\`\`typescript
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
  
  const { data, error } = await supabase
    .from("comment_likes")
    .insert({
      comment_id: params.id,
      ip_address: ipAddress
    })
  
  return NextResponse.json({ data, error })
}
\`\`\`

#### Frontend Component

**`components/comments/CommentsSection.tsx`**
\`\`\`typescript
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Flag } from 'lucide-react'

export function CommentsSection({ comparisonSlug }: { comparisonSlug: string }) {
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ name: "", email: "", text: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    fetchComments()
  }, [comparisonSlug])
  
  const fetchComments = async () => {
    const res = await fetch(`/api/comments?slug=${comparisonSlug}`)
    const { data } = await res.json()
    setComments(data || [])
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comparisonSlug,
        userName: form.name,
        userEmail: form.email,
        commentText: form.text
      })
    })
    
    setForm({ name: "", email: "", text: "" })
    setIsSubmitting(false)
    alert("Comment submitted for moderation!")
  }
  
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Textarea
          placeholder="Share your thoughts..."
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
          minLength={10}
          maxLength={2000}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Post Comment"}
        </Button>
      </form>
      
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="border-l-4 border-primary pl-4 py-2">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{comment.user_name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mb-2">{comment.comment_text}</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {comment.likes_count}
              </Button>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
\`\`\`

### 4. Social Sharing with Open Graph

**`components/social/SocialShare.tsx`**
\`\`\`typescript
"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react'

export function SocialShare({ 
  url, 
  title, 
  description 
}: { 
  url: string
  title: string
  description: string
}) {
  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)
  const shareText = encodeURIComponent(description)
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.facebook, "_blank")}
      >
        <Facebook className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.twitter, "_blank")}
      >
        <Twitter className="h-4 w-4 mr-2" />
        Tweet
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
      >
        <Linkedin className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareLinks.whatsapp, "_blank")}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
      >
        <Link2 className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}
\`\`\`

**Add to `app/comparison/[slug]/page.tsx` metadata:**
\`\`\`typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const comparison = await getComparison(params.slug)
  
  return {
    title: comparison.title,
    description: comparison.description,
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: `https://productsvs.com/comparison/${params.slug}`,
      siteName: "Products VS",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(comparison.title)}`,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.description,
      images: [`/api/og?title=${encodeURIComponent(comparison.title)}`],
    },
  }
}
\`\`\`

### 5. Price Tracking System

**`components/price/PriceTracker.tsx`**
\`\`\`typescript
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Bell } from 'lucide-react'

export function PriceTracker({ 
  comparisonSlug, 
  productName, 
  productChoice 
}: { 
  comparisonSlug: string
  productName: string
  productChoice: "A" | "B"
}) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [alertPrice, setAlertPrice] = useState("")
  const [email, setEmail] = useState("")
  
  useEffect(() => {
    fetchPriceData()
  }, [comparisonSlug, productChoice])
  
  const fetchPriceData = async () => {
    const res = await fetch(`/api/price?slug=${comparisonSlug}&product=${productChoice}`)
    const { data } = await res.json()
    setCurrentPrice(data?.current_price)
    setPriceHistory(data?.history || [])
  }
  
  const createAlert = async () => {
    await fetch("/api/price/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comparisonSlug,
        productChoice,
        targetPrice: parseFloat(alertPrice),
        userEmail: email
      })
    })
    alert("Price alert created!")
  }
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{productName} Price Tracker</h3>
      
      {currentPrice && (
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary">
            ${currentPrice.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Current Price</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Price History (30 days)
          </h4>
          {/* Add chart component here */}
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Set Price Alert
          </h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Target price"
              value={alertPrice}
              onChange={(e) => setAlertPrice(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={createAlert}>Create Alert</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
\`\`\`

### 6. User Authentication

Follow the Supabase examples in `user_read_only_context/integration_examples/supabase/`:

1. Create `lib/supabase/middleware.ts` for session management
2. Create `middleware.ts` in root for auth protection
3. Create auth pages:
   - `app/auth/login/page.tsx`
   - `app/auth/sign-up/page.tsx`
   - `app/auth/sign-up-success/page.tsx`

### 7. User Dashboard

**`app/dashboard/page.tsx`**
\`\`\`typescript
import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/auth/login")
  
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  
  const { data: favorites } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", user.id)
  
  const { data: history } = await supabase
    .from("user_comparison_history")
    .select("*")
    .eq("user_id", user.id)
    .order("viewed_at", { ascending: false })
    .limit(10)
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <p>Name: {profile?.display_name}</p>
          <p>Email: {user.email}</p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Favorites</h2>
          <p>{favorites?.length || 0} saved comparisons</p>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent History</h2>
          {/* List recent comparisons */}
        </Card>
      </div>
    </div>
  )
}
\`\`\`

## Next Steps

1. Run the SQL scripts in the `scripts/` folder to create all database tables
2. Implement the comments system components and API endpoints
3. Add social sharing buttons to comparison pages
4. Implement price tracking for products
5. Set up Supabase authentication
6. Build the user dashboard
7. Test all features thoroughly
8. Deploy to production

## Testing Checklist

- [ ] Voting system works for both logged-in and anonymous users
- [ ] Rating system saves and displays correctly
- [ ] Comments require moderation before appearing
- [ ] Social sharing buttons work on all platforms
- [ ] Price alerts send emails when triggered
- [ ] User authentication flow works smoothly
- [ ] Dashboard displays user data correctly
- [ ] All RLS policies are properly configured
- [ ] Mobile responsiveness is maintained
- [ ] Performance is optimized (lazy loading, caching)
