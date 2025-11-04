"use client"

import { Folder, Globe, Clock, Eye, CheckCircle, XCircle, Sparkles } from "lucide-react"

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
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">
                #{index + 1}
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                {comparison.product1} <span className="text-gray-500">vs</span> {comparison.product2}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Folder className="w-4 h-4" />
                {comparison.category}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Globe className="w-4 h-4" />
                {comparison.language.toUpperCase()}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                {timeAgo(comparison.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => onPreview(comparison)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200 backdrop-blur-sm group/btn"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Preview
          </button>
          <button
            onClick={() => onApprove(comparison.id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 font-medium text-sm rounded-xl transition-all duration-200 backdrop-blur-sm group/btn"
          >
            <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Approve
          </button>
          <button
            onClick={() => onReject(comparison)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 font-medium text-sm rounded-xl transition-all duration-200 backdrop-blur-sm group/btn"
          >
            <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
