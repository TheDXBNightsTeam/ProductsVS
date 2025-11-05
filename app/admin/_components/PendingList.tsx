"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Eye, Calendar, AlertCircle } from "lucide-react"
import { toast } from "sonner"

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
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: "approve" | "reject"; product1: string; product2: string } | null>(null)
  const [rejectReason, setRejectReason] = useState("Low quality")

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
    setConfirmDialog(null)
    
    try {
      const endpoint = action === "approve" ? "/api/admin/approve" : "/api/admin/reject"
      const body = action === "approve" 
        ? { comparisonId: id } 
        : { comparisonId: id, reason: rejectReason }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(
          action === "approve" 
            ? "✅ Comparison approved successfully!" 
            : "❌ Comparison rejected successfully"
        )
        await loadComparisons()
        onRefresh()
      } else {
        toast.error(data.error || "Failed to update comparison. Please try again.")
      }
    } catch (error) {
      console.error("Action failed:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const showConfirmDialog = (id: string, action: "approve" | "reject", product1: string, product2: string) => {
    setConfirmDialog({ id, action, product1, product2 })
  }

  if (loading) {
    return (
      <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--text)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                confirmDialog.action === "approve" ? "bg-green-500" : "bg-red-500"
              }`}>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--text)] mb-2">
                  {confirmDialog.action === "approve" ? "Approve Comparison?" : "Reject Comparison?"}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Are you sure you want to {confirmDialog.action} the comparison between{" "}
                  <span className="font-semibold text-[var(--text)]">{confirmDialog.product1}</span> and{" "}
                  <span className="font-semibold text-[var(--text)]">{confirmDialog.product2}</span>?
                </p>
                
                {confirmDialog.action === "reject" && (
                  <div>
                    <label htmlFor="reject-reason" className="block text-sm font-semibold text-[var(--text)] mb-2">
                      Reason for rejection:
                    </label>
                    <select
                      id="reject-reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] rounded-lg focus:border-[var(--text)] focus:outline-none"
                    >
                      <option value="Low quality">Low quality</option>
                      <option value="Inappropriate content">Inappropriate content</option>
                      <option value="Spam">Spam</option>
                      <option value="Duplicate">Duplicate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border-2 border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-[var(--surface-alt)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirmDialog.id, confirmDialog.action)}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                  confirmDialog.action === "approve" 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmDialog.action === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg">
        <div className="p-6 border-b-2 border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Pending Reviews</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{comparisons.length} comparisons awaiting review</p>
        </div>

        <div className="divide-y-2 divide-[var(--border)]">
        {comparisons.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">No pending comparisons</div>
        ) : (
          comparisons.map((comp) => (
            <div key={comp.id} className="p-6 hover:bg-[var(--bg)] transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text)] mb-2 text-lg">
                    {comp.product1_name} <span className="text-[var(--text-secondary)]">vs</span> {comp.product2_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="px-3 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-full text-xs font-medium">
                      {comp.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(comp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => window.open(`/comparison/${comp.slug}`, "_blank")}
                    className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] rounded-lg transition-colors border border-[var(--border)]"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => showConfirmDialog(comp.id, "approve", comp.product1_name, comp.product2_name)}
                    disabled={actionLoading === comp.id}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Approve</span>
                  </button>
                  <button
                    onClick={() => showConfirmDialog(comp.id, "reject", comp.product1_name, comp.product2_name)}
                    disabled={actionLoading === comp.id}
                    className="px-4 py-2 border-2 border-[var(--border)] text-[var(--text)] rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
    </>
  )
}
