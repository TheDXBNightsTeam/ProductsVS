"use client"

import { useState, useEffect } from "react"
import { Clock, ArrowUpDown, RefreshCw, Sparkles } from "lucide-react"
import ComparisonCard from "./ComparisonCard"
import PreviewModal from "./PreviewModal"
import RejectModal from "./RejectModal"

interface Comparison {
  id: string
  product1: string
  product2: string
  category: string
  language: string
  created_at: string
  content: any
}

interface PendingListProps {
  onUpdate: () => void
}

export default function PendingList({ onUpdate }: PendingListProps) {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [selectedComparison, setSelectedComparison] = useState<Comparison | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showReject, setShowReject] = useState(false)

  useEffect(() => {
    loadPending()
  }, [sortBy])

  const loadPending = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/pending?sort=${sortBy}`)
      const data = await response.json()
      if (data.success) {
        setComparisons(data.comparisons)
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Failed to load pending comparisons:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparisonId: id }),
      })
      const data = await response.json()
      if (data.success) {
        await loadPending()
        onUpdate()
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Failed to approve:", error)
      }
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparisonId: id, reason }),
      })
      const data = await response.json()
      if (data.success) {
        setShowReject(false)
        setSelectedComparison(null)
        await loadPending()
        onUpdate()
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Failed to reject:", error)
      }
    }
  }

  const handlePreview = (comparison: Comparison) => {
    setSelectedComparison(comparison)
    setShowPreview(true)
  }

  const handleRejectClick = (comparison: Comparison) => {
    setSelectedComparison(comparison)
    setShowReject(true)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
              Pending Review
              {comparisons.length > 0 && (
                <span className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-500/30 backdrop-blur-sm">
                  {comparisons.length}
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-400">Review and moderate AI-generated comparisons</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-sm font-medium">{sortBy === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-400 font-medium">Loading comparisons...</p>
        </div>
      ) : comparisons.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-4 border border-green-500/20">
            <Sparkles className="w-10 h-10 text-green-400" />
          </div>
          <p className="text-lg text-gray-300 font-semibold mb-2">All caught up!</p>
          <p className="text-sm text-gray-500">No pending comparisons to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comparisons.map((comparison, index) => (
            <ComparisonCard
              key={comparison.id}
              comparison={comparison}
              index={index}
              onPreview={handlePreview}
              onApprove={handleApprove}
              onReject={handleRejectClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showPreview && selectedComparison && (
        <PreviewModal
          comparison={selectedComparison}
          onClose={() => {
            setShowPreview(false)
            setSelectedComparison(null)
          }}
        />
      )}

      {showReject && selectedComparison && (
        <RejectModal
          comparison={selectedComparison}
          onReject={handleReject}
          onClose={() => {
            setShowReject(false)
            setSelectedComparison(null)
          }}
        />
      )}
    </div>
  )
}
