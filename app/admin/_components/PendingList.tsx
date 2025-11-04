"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Eye, Calendar } from "lucide-react"

interface Comparison {
  id: string
  slug: string
  product1_name: string
  product2_name: string
  category: string
  status: string
  created_at: string
}

interface PendingListProps {
  onRefresh: () => void
}

export default function PendingList({ onRefresh }: PendingListProps) {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadComparisons()
  }, [])

  const loadComparisons = async () => {
    try {
      const response = await fetch("/api/admin/pending?sort=newest")
      const data = await response.json()
      if (data.success) {
        setComparisons(data.comparisons || [])
      }
    } catch (error) {
      console.error("Failed to load comparisons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/comparisons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      })

      if (response.ok) {
        await loadComparisons()
        onRefresh()
      }
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">Pending Reviews</h2>
        <p className="text-sm text-gray-500 mt-1">{comparisons.length} comparisons awaiting review</p>
      </div>

      <div className="divide-y divide-gray-200">
        {comparisons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending comparisons</div>
        ) : (
          comparisons.map((comp) => (
            <div key={comp.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-2">
                    {comp.product1_name} vs {comp.product2_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{comp.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(comp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`/comparison/${comp.slug}`, "_blank")}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleAction(comp.id, "approve")}
                    disabled={actionLoading === comp.id}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(comp.id, "reject")}
                    disabled={actionLoading === comp.id}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
