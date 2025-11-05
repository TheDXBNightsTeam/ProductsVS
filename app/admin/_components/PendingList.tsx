
"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Eye, Calendar, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
      } else {
        toast.error("Failed to load comparisons")
      }
    } catch (error) {
      console.error("Failed to load comparisons:", error)
      toast.error("An error occurred while loading comparisons")
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
    <div>
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent className="bg-[var(--surface)] border-2 border-[var(--border)] max-w-md shadow-2xl">
          <DialogHeader>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                confirmDialog?.action === "approve" ? "bg-green-500" : "bg-red-500"
              }`}>
                <AlertCircle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-bold text-[var(--text)] mb-2">
                  {confirmDialog?.action === "approve" ? "Approve Comparison?" : "Reject Comparison?"}
                </DialogTitle>
                <DialogDescription className="text-sm text-[var(--text-secondary)]">
                  {confirmDialog?.action === "approve" 
                    ? "This will publish the comparison and make it visible to all users."
                    : "This will remove the comparison from the pending list and notify the submitter."}
                  <br />
                  <span className="font-semibold text-[var(--text)] mt-2 inline-block">
                    {confirmDialog?.product1} vs {confirmDialog?.product2}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {confirmDialog?.action === "reject" && (
            <div className="mt-4">
              <label htmlFor="reject-reason" className="block text-sm font-semibold text-[var(--text)] mb-2">
                Reason for rejection:
              </label>
              <Select value={rejectReason} onValueChange={setRejectReason}>
                <SelectTrigger className="w-full border-2 border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text)] transition-colors duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low quality">Low quality</SelectItem>
                  <SelectItem value="Inappropriate content">Inappropriate content</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                  <SelectItem value="Duplicate">Duplicate</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(null)}
              className="border-2 border-[var(--border)] hover:bg-[var(--bg)] transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog && handleAction(confirmDialog.id, confirmDialog.action)}
              className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                confirmDialog?.action === "approve" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {confirmDialog?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg">
        <div className="p-6 border-b-2 border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--text)]">Pending Reviews</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{comparisons.length} comparisons awaiting review</p>
        </div>

        <div className="divide-y-2 divide-[var(--border)]">
        {comparisons.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">No pending comparisons</div>
        ) : (
          comparisons.map((comp, index) => (
            <div 
              key={comp.id} 
              className="p-6 hover:bg-[var(--bg)] transition-all duration-300 group animate-fade-in-left"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text)] mb-2 text-lg transition-colors duration-200 group-hover:text-[var(--text)]">
                    {comp.product1_name} <span className="text-[var(--text-secondary)]">vs</span> {comp.product2_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                    <span className="px-3 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-full text-xs font-medium transition-all duration-200 group-hover:border-[var(--text)] group-hover:text-[var(--text)]">
                      {comp.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(comp.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`/comparison/${comp.slug}`, "_blank")}
                    className="border border-[var(--border)] hover:border-[var(--text)] hover:bg-[var(--bg)] transition-all duration-200 hover:scale-105"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => showConfirmDialog(comp.id, "approve", comp.product1_name, comp.product2_name)}
                    disabled={actionLoading === comp.id}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    {actionLoading === comp.id ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">Approve</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => showConfirmDialog(comp.id, "reject", comp.product1_name, comp.product2_name)}
                    disabled={actionLoading === comp.id}
                    className="border-2 border-[var(--border)] hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    {actionLoading === comp.id ? (
                      <div className="w-4 h-4 mr-2 border-2 border-[var(--text)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">Reject</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-1rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.4s ease-out backwards;
        }
      `}</style>
    </div>
  )
}
