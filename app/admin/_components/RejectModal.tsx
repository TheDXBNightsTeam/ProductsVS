"use client"

import type React from "react"
import { useState } from "react"
import { X, XCircle, Loader2 } from "lucide-react"

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

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-title"
      onKeyDown={handleEscape}
    >
      <div className="bg-gray-900 border border-gray-700 max-w-md w-full rounded-lg shadow-2xl">
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-start gap-3">
            <div className="bg-red-900/30 p-2 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 id="reject-title" className="text-2xl font-bold text-white">Reject Comparison</h2>
              <p className="text-gray-400 mt-1">
                {comparison.product1} <span className="text-gray-600">vs</span> {comparison.product2}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block mb-2 font-medium text-sm text-gray-300">Reason for rejection</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this comparison..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none resize-none text-white placeholder-gray-500 transition-colors"
            required
            disabled={loading}
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium rounded-lg transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
