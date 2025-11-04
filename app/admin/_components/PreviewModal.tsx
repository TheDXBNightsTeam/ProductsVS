"use client"

import { X, CheckCircle } from "lucide-react"

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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onKeyDown={handleEscape}
    >
      <div className="bg-gray-900 border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 id="preview-title" className="text-2xl font-bold text-white">
            {comparison.product1} <span className="text-gray-600">vs</span> {comparison.product2}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {content?.summary && (
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Summary</h3>
              <p className="text-gray-300 leading-relaxed">{content.summary}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-5">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {comparison.product1} Strengths
              </h3>
              <ul className="space-y-2">
                {content?.product1Pros?.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-5">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {comparison.product2} Strengths
              </h3>
              <ul className="space-y-2">
                {content?.product2Pros?.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {content?.verdict && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Final Verdict</h3>
              <p className="text-gray-300 leading-relaxed">{content.verdict}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
