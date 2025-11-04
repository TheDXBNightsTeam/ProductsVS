"use client"

import type React from "react"
import AdUnit from "@/components/ads/AdUnit"
import MobileStickyAd from "@/components/ads/MobileStickyAd"
import { adsenseConfig } from "@/lib/config/adsense"
// import { VotingSection } from "@/components/voting/VotingSection"
// import { RatingSection } from "@/components/voting/RatingSection"

import { useState, useEffect } from "react"
import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"
import Link from "next/link"
import { comparisons } from "@/lib/comparisons-data"

interface Comment {
  id: string
  name: string
  email: string
  text: string
  date: string
}

interface Rating {
  value: number
  count: number
}

export default function ComparisonClientPage({
  params,
  initialComparison,
  source,
  isPending = false,
}: {
  params: { slug: string }
  initialComparison: any
  source: "static" | "dynamic"
  isPending?: boolean
}) {
  const comparison = initialComparison

  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [ratingCount, setRatingCount] = useState<number>(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentForm, setCommentForm] = useState({ name: "", email: "", text: "" })
  const [ratingMessage, setRatingMessage] = useState("")
  const [viewCount, setViewCount] = useState<number>(0)
  const [pollVote, setPollVote] = useState<string | null>(null)
  const [pollResults, setPollResults] = useState({ optionA: 0, optionB: 0 })
  const [relatedComparisons, setRelatedComparisons] = useState<typeof comparisons>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRatings = localStorage.getItem(`ratings-${params.slug}`)
      const savedComments = localStorage.getItem(`comments-${params.slug}`)

      if (savedRatings) {
        const ratingsData: Rating = JSON.parse(savedRatings)
        setAverageRating(ratingsData.value)
        setRatingCount(ratingsData.count)
      }

      if (savedComments) {
        setComments(JSON.parse(savedComments))
      }

      const pollKey = `poll-${params.slug}`
      const savedPoll = localStorage.getItem(pollKey)
      if (savedPoll) {
        setPollResults(JSON.parse(savedPoll))
      }

      const userVoteKey = `poll-vote-${params.slug}`
      const userVote = localStorage.getItem(userVoteKey)
      if (userVote) {
        setPollVote(userVote)
      }
    }
  }, [params.slug])

  useEffect(() => {
    if (comparison) {
      const sameCategory = comparisons
        .filter((c) => c.category === comparison.category && c.slug !== comparison.slug)
        .slice(0, 4)

      const crossCategory = comparisons
        .filter((c) => c.category !== comparison.category && c.slug !== comparison.slug)
        .slice(0, 2)

      setRelatedComparisons([...sameCategory, ...crossCategory])
    }
  }, [comparison])

  useEffect(() => {
    if (typeof window !== "undefined" && source === "static") {
      const viewKey = `views-${params.slug}`
      const currentViews = Number.parseInt(localStorage.getItem(viewKey) || "0")
      const newViews = currentViews + 1
      setViewCount(newViews)
      localStorage.setItem(viewKey, newViews.toString())
    }
  }, [params.slug, source])

  const handleRatingClick = (value: number) => {
    setRating(value)

    const newCount = ratingCount + 1
    const newAverage = (averageRating * ratingCount + value) / newCount

    setAverageRating(newAverage)
    setRatingCount(newCount)

    if (typeof window !== "undefined") {
      localStorage.setItem(`ratings-${params.slug}`, JSON.stringify({ value: newAverage, count: newCount }))
    }

    setRatingMessage("Thank you for rating!")
    setTimeout(() => setRatingMessage(""), 3000)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentForm.name || !commentForm.email || !commentForm.text) {
      return
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      name: commentForm.name,
      email: commentForm.email,
      text: commentForm.text,
      date: new Date().toLocaleDateString(),
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)

    if (typeof window !== "undefined") {
      localStorage.setItem(`comments-${params.slug}`, JSON.stringify(updatedComments))
    }

    setCommentForm({ name: "", email: "", text: "" })
  }

  const handlePollVote = (option: "A" | "B") => {
    if (pollVote) return // Already voted

    const newResults = {
      optionA: option === "A" ? pollResults.optionA + 1 : pollResults.optionA,
      optionB: option === "B" ? pollResults.optionB + 1 : pollResults.optionB,
    }

    setPollResults(newResults)
    setPollVote(option)

    if (typeof window !== "undefined") {
      localStorage.setItem(`poll-${params.slug}`, JSON.stringify(newResults))
      localStorage.setItem(`poll-vote-${params.slug}`, option)
    }
  }

  const schemaData = comparison
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: comparison.title,
        description: comparison.description,
        author: {
          "@type": "Organization",
          name: "Products VS",
        },
        publisher: {
          "@type": "Organization",
          name: "Products VS",
          logo: {
            "@type": "ImageObject",
            url: "https://productsvs.com/logo.png",
          },
        },
        datePublished: comparison.lastUpdated,
        dateModified: comparison.lastUpdated,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://productsvs.com/comparison/${params.slug}`,
        },
        about: [
          {
            "@type": "Thing",
            name: comparison.optionA.name,
          },
          {
            "@type": "Thing",
            name: comparison.optionB.name,
          },
        ],
      }
    : null

  if (!comparison) {
    return (
      <PageLayout currentPath={`/comparison/${params.slug}`}>
        <div style={{ padding: "120px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Comparison Not Found</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.7, marginBottom: "2rem" }}>
            This comparison doesn't exist yet, but you can create it!
          </p>
          <Link
            href="/#ai-battle"
            style={{
              display: "inline-block",
              padding: "1rem 2rem",
              background: "#000",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          >
            Generate with AI Battle
          </Link>
        </div>
      </PageLayout>
    )
  }

  const totalVotes = pollResults.optionA + pollResults.optionB
  const percentageA = totalVotes > 0 ? Math.round((pollResults.optionA / totalVotes) * 100) : 0
  const percentageB = totalVotes > 0 ? Math.round((pollResults.optionB / totalVotes) * 100) : 0

  return (
    <PageLayout currentPath={`/comparison/${params.slug}`}>
      {schemaData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      )}

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Comparisons", href: "/en" }, { label: comparison.title }]}
      />

      {isPending && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "1rem 1.5rem",
            textAlign: "center",
            marginBottom: "2rem",
            borderRadius: "8px",
            border: "2px solid #ffc107",
          }}
        >
          <strong style={{ fontSize: "0.95rem" }}>
            ⏳ قيد المراجعة: هذه المقارنة قيد المراجعة وستُنشر بعد الموافقة
          </strong>
        </div>
      )}

      <div style={{ margin: "1rem 0" }}>
        <AdUnit slot={adsenseConfig.slots.comparison_header} format="horizontal" responsive={true} />
      </div>

      <section className="hero-section" style={{ padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>{comparison.title}</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "800px", margin: "0 auto" }}>
            {comparison.description}
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "0.5rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                fontSize: "0.9rem",
              }}
            >
              {comparison.category}
            </span>
            <span
              style={{
                padding: "0.5rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {viewCount.toLocaleString()} views
            </span>
            <span
              style={{
                padding: "0.5rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                fontSize: "0.9rem",
              }}
            >
              Updated: {comparison.lastUpdated}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem" }}>
            {/* Main Content */}
            <div>
              <div className="comparison-section">
                <h2>Quick Comparison</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "2rem",
                    marginTop: "2rem",
                  }}
                >
                  <div
                    style={{
                      padding: "2rem",
                      border: "2px solid var(--border)",
                      background: "var(--bg-primary)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: 600 }}>
                      {comparison.optionA.name}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {comparison.optionA.pros.map((pro: string, index: number) => (
                        <li
                          key={index}
                          style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem", position: "relative" }}
                        >
                          <span style={{ position: "absolute", left: 0 }}>✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      padding: "2rem",
                      border: "2px solid var(--border)",
                      background: "var(--bg-primary)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: 600 }}>
                      {comparison.optionB.name}
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {comparison.optionB.pros.map((pro: string, index: number) => (
                        <li
                          key={index}
                          style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem", position: "relative" }}
                        >
                          <span style={{ position: "absolute", left: 0 }}>✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="comparison-section" style={{ marginTop: "4rem" }}>
                <h2>Detailed Analysis</h2>
                {comparison.sections.slice(0, 2).map((section, index) => (
                  <div key={index} style={{ marginTop: "2rem" }}>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: 600 }}>{section.title}</h3>
                    <p style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>{section.content}</p>
                  </div>
                ))}
              </div>

              <div style={{ margin: "3rem 0" }}>
                <AdUnit slot={adsenseConfig.slots.comparison_infeed} format="rectangle" responsive={true} />
              </div>

              {/* <div style={{ marginTop: "4rem", display: "grid", gap: "2rem" }}>
                <VotingSection
                  comparisonSlug={params.slug}
                  productAName={comparison.optionA.name}
                  productBName={comparison.optionB.name}
                />

                <RatingSection
                  comparisonSlug={params.slug}
                  productAName={comparison.optionA.name}
                  productBName={comparison.optionB.name}
                />
              </div> */}

              <div className="comparison-section">
                {comparison.sections.slice(2).map((section, index) => (
                  <div key={index} style={{ marginTop: "2rem" }}>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", fontWeight: 600 }}>{section.title}</h3>
                    <p style={{ lineHeight: 1.8, color: "var(--text-secondary)" }}>{section.content}</p>
                  </div>
                ))}
              </div>

              <div
                className="comparison-section"
                style={{ marginTop: "4rem", background: "#fff9e6", border: "2px solid #ffd700", padding: "2rem" }}
              >
                <h2>Rate this Comparison</h2>
                <div style={{ textAlign: "center", margin: "2rem 0" }}>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#3498db" }}>
                    {averageRating > 0 ? averageRating.toFixed(1) : "-"}
                  </div>
                  <div style={{ color: "#5a6c7d", marginTop: "0.5rem" }}>
                    {ratingCount > 0 ? `${ratingCount} rating${ratingCount > 1 ? "s" : ""}` : "No ratings yet"}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    fontSize: "2rem",
                    justifyContent: "center",
                    margin: "1.5rem 0",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        cursor: "pointer",
                        color: star <= (hoverRating || rating) ? "#ffd700" : "#ddd",
                        transition: "color 0.2s",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {ratingMessage && (
                  <div style={{ textAlign: "center", color: "#27ae60", fontWeight: 600 }}>{ratingMessage}</div>
                )}
              </div>

              <div
                className="comparison-section"
                style={{
                  marginTop: "4rem",
                  background: "#667eea",
                  border: "none",
                  padding: "2.5rem",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              >
                <h2 style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>Which Do You Prefer?</h2>
                <p style={{ opacity: 0.9, marginBottom: "2rem" }}>Cast your vote and see what others think!</p>

                {!pollVote ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <button
                      onClick={() => handlePollVote("A")}
                      style={{
                        padding: "2rem",
                        background: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.3)"
                        e.currentTarget.style.transform = "translateY(-4px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      {comparison.optionA.name}
                    </button>
                    <button
                      onClick={() => handlePollVote("B")}
                      style={{
                        padding: "2rem",
                        background: "rgba(255,255,255,0.2)",
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.3)"
                        e.currentTarget.style.transform = "translateY(-4px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      {comparison.optionB.name}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 600 }}>{comparison.optionA.name}</span>
                        <span style={{ fontWeight: 700 }}>{percentageA}%</span>
                      </div>
                      <div
                        style={{
                          height: "12px",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentageA}%`,
                            background: pollVote === "A" ? "#4CAF50" : "rgba(255,255,255,0.6)",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 600 }}>{comparison.optionB.name}</span>
                        <span style={{ fontWeight: 700 }}>{percentageB}%</span>
                      </div>
                      <div
                        style={{
                          height: "12px",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentageB}%`,
                            background: pollVote === "B" ? "#4CAF50" : "rgba(255,255,255,0.6)",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>

                    <p style={{ marginTop: "1.5rem", textAlign: "center", opacity: 0.9 }}>
                      {totalVotes} {totalVotes === 1 ? "vote" : "votes"} • You voted for{" "}
                      {pollVote === "A" ? comparison.optionA.name : comparison.optionB.name}
                    </p>
                  </div>
                )}
              </div>

              <div
                className="comparison-section"
                style={{ marginTop: "4rem", background: "#f0f8ff", border: "2px solid #87ceeb", padding: "2rem" }}
              >
                <h2>Comments</h2>

                <form onSubmit={handleCommentSubmit} style={{ margin: "2rem 0" }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                    }}
                  />
                  <textarea
                    placeholder="Share your thoughts..."
                    value={commentForm.text}
                    onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontFamily: "inherit",
                      minHeight: "120px",
                      resize: "vertical",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#3498db",
                      color: "white",
                      padding: "0.75rem 2rem",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    Submit Comment
                  </button>
                </form>

                <div>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        background: "white",
                        padding: "1.5rem",
                        margin: "1rem 0",
                        borderRadius: "8px",
                        borderLeft: "3px solid #3498db",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.75rem",
                          color: "#5a6c7d",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#2c3e50" }}>{comment.name}</span>
                        <span style={{ fontSize: "0.9rem" }}>{comment.date}</span>
                      </div>
                      <p style={{ lineHeight: 1.6, color: "#2c3e50" }}>{comment.text}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p style={{ textAlign: "center", color: "#7f8c8d", padding: "2rem" }}>
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
              </div>
            </div>

            <aside style={{ position: "relative" }}>
              <div style={{ position: "sticky", top: "2rem" }}>
                <AdUnit
                  slot={adsenseConfig.slots.comparison_sidebar}
                  format="rectangle"
                  responsive={false}
                  style={{ minHeight: "600px" }}
                />
              </div>
            </aside>
          </div>

          <div style={{ margin: "4rem 0" }}>
            <AdUnit slot={adsenseConfig.slots.comparison_footer} format="horizontal" responsive={true} />
          </div>

          {relatedComparisons.length > 0 && (
            <div className="comparison-section" style={{ marginTop: "4rem" }}>
              <h2>Related Comparisons</h2>
              <p style={{ opacity: 0.7, marginBottom: "1rem" }}>You might also be interested in these comparisons</p>
              <Link
                href={`/category/${comparison.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
                style={{
                  display: "inline-block",
                  marginBottom: "2rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                }}
              >
                View all {comparison.category} comparisons →
              </Link>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}
              >
                {relatedComparisons.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/comparison/${related.slug}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      background: "var(--bg-primary)",
                      padding: "1.5rem",
                      border: "2px solid var(--border)",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"
                      e.currentTarget.style.borderColor = "#000"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = "var(--border)"
                    }}
                  >
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem" }}>{related.title}</h3>
                    <p style={{ fontSize: "0.9rem", opacity: 0.7, lineHeight: 1.5, marginBottom: "1rem" }}>
                      {related.description}
                    </p>
                    <div style={{ fontSize: "0.85rem", opacity: 0.6 }}>{related.category}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <Link href="/en" className="cta-button">
              Browse More Comparisons
            </Link>
          </div>
        </div>
      </section>

      <MobileStickyAd />

      <style jsx>{`
        .comparison-section h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border);
        }
        
        @media (max-width: 768px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
          
          aside {
            display: none;
          }
        }
      `}</style>
    </PageLayout>
  )
}
