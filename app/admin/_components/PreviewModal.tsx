"use client"

import { X, CheckCircle, Sparkles } from "lucide-react"

interface Comparison {
  id: string
  product1: string
  product2: string
  category: string
  language: string
  content: any
}

interface PreviewModalProps {
  comparison: Comparison
  onClose: () => void
}

export default function PreviewModal({ comparison, onClose }: PreviewModalProps) {
  const content = comparison.content

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onKeyDown={handleEscape}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="preview-title" className="text-2xl font-extrabold text-white">
                {comparison.product1} <span className="text-gray-500">vs</span> {comparison.product2}
              </h2>
              <p className="text-sm text-gray-400">{comparison.category} • {comparison.language.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 text-gray-400 hover:text-white border border-transparent hover:border-white/10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {content?.summary && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                Summary
              </h3>
              <p className="text-gray-300 leading-relaxed">{content.summary}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-extrabold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {comparison.product1} Strengths
              </h3>
              <ul className="space-y-2">
                {content?.product1Pros?.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1.5 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-extrabold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {comparison.product2} Strengths
              </h3>
              <ul className="space-y-2">
                {content?.product2Pros?.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1.5 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {content?.verdict && (
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Final Verdict
              </h3>
              <p className="text-gray-300 leading-relaxed">{content.verdict}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
