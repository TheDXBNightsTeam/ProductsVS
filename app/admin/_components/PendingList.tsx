"use client"

import { useState, useEffect } from "react"
import { Clock, ArrowUpDown } from "lucide-react"
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
      console.error("[v0] Failed to load pending comparisons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()
      if (data.success) {
        await loadPending()
        onUpdate()
      }
    } catch (error) {
      console.error("[v0] Failed to approve:", error)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reason }),
      })
      const data = await response.json()
      if (data.success) {
        setShowReject(false)
        setSelectedComparison(null)
        await loadPending()
        onUpdate()
      }
    } catch (error) {
      console.error("[v0] Failed to reject:", error)
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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-500" />
          Pending Review
          {comparisons.length > 0 && (
            <span className="bg-yellow-500/20 text-yellow-500 text-sm font-semibold px-3 py-1 rounded-full border border-yellow-500/30">
              {comparisons.length}
            </span>
          )}
        </h2>
        <button
          onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm">{sortBy === "newest" ? "Newest First" : "Oldest First"}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-white"></div>
        </div>
      ) : comparisons.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-lg text-gray-400 font-medium">No pending comparisons</p>
          <p className="text-sm text-gray-500 mt-2">All caught up!</p>
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
