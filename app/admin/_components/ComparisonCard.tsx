"use client"

import { Folder, Globe, Clock, Eye, CheckCircle, XCircle } from "lucide-react"

interface Comparison {
  id: string
  product1: string
  product2: string
  category: string
  language: string
  created_at: string
  content: any
}

interface ComparisonCardProps {
  comparison: Comparison
  index: number
  onPreview: (comparison: Comparison) => void
  onApprove: (id: string) => void
  onReject: (comparison: Comparison) => void
}

export default function ComparisonCard({ comparison, index, onPreview, onApprove, onReject }: ComparisonCardProps) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-gray-500 bg-gray-900 px-2 py-1 rounded">
              #{index + 1}
            </span>
            <h3 className="text-lg font-bold text-white">
              {comparison.product1} <span className="text-gray-600">vs</span> {comparison.product2}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Folder className="w-4 h-4" />
              {comparison.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              {comparison.language.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {timeAgo(comparison.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onPreview(comparison)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 font-medium text-sm rounded-lg transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => onApprove(comparison.id)}
          className="flex items-center gap-2 px-4 py-2 bg-green-900/40 hover:bg-green-900/60 border border-green-700 text-green-400 font-medium text-sm rounded-lg transition-all duration-200"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(comparison)}
          className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-700 text-red-400 font-medium text-sm rounded-lg transition-all duration-200"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  )
}
