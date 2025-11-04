"use client"

import type React from "react"
import { useState } from "react"
import { X, XCircle, Loader2, AlertTriangle } from "lucide-react"

interface Comparison {
  id: string
  product1: string
  product2: string
}

interface RejectModalProps {
  comparison: Comparison
  onReject: (id: string, reason: string) => void
  onClose: () => void
}

export default function RejectModal({ comparison, onReject, onClose }: RejectModalProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setLoading(true)
    await onReject(comparison.id, reason)
    setLoading(false)
  }

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  const rejectionReasons = [
    "Inappropriate content",
    "Spam",
    "Low quality",
    "Duplicate",
    "Other",
  ]

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-title"
      onKeyDown={handleEscape}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 max-w-md w-full rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 id="reject-title" className="text-2xl font-extrabold text-white mb-1">Reject Comparison</h2>
              <p className="text-gray-400">
                {comparison.product1} <span className="text-gray-600">vs</span> {comparison.product2}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white border border-transparent hover:border-white/10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-3 font-semibold text-sm text-gray-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Reason for rejection
            </label>
            
            {/* Quick Reason Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {rejectionReasons.map((quickReason) => (
                <button
                  key={quickReason}
                  type="button"
                  onClick={() => setReason(quickReason === "Other" ? "" : quickReason)}
                  className={`px-3 py-2 text-sm rounded-xl border transition-all duration-200 ${
                    reason === quickReason
                      ? "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                  }`}
                  disabled={loading}
                >
                  {quickReason}
                </button>
              ))}
            </div>

            {/* Custom Reason Textarea */}
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this comparison..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-red-500/40 focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none text-white placeholder-gray-500 transition-all duration-200 backdrop-blur-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40"
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
