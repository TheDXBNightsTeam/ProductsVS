"use client"

import { useState } from "react"
import { Activity, CheckCircle, XCircle, FileText, Sparkles, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  action: string
  details: string
  timestamp: string
  type: "approved" | "rejected" | "new"
}

export default function ActivityLog() {
  const [activities] = useState<ActivityItem[]>([])

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <FileText className="w-5 h-5 text-blue-400" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "approved":
        return "from-green-500/10 to-emerald-500/10 border-green-500/20"
      case "rejected":
        return "from-red-500/10 to-pink-500/10 border-red-500/20"
      default:
        return "from-blue-500/10 to-cyan-500/10 border-blue-500/20"
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Recent Activity</h2>
          <p className="text-sm text-gray-400">Track your moderation actions</p>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl mb-4 border border-blue-500/20">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-lg text-gray-300 font-semibold mb-2">No recent activity</p>
            <p className="text-sm text-gray-500">Activity will appear here as you review comparisons</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`group relative p-4 bg-gradient-to-br ${getBgColor(activity.type)} rounded-xl backdrop-blur-sm border hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <div className="relative flex justify-between items-start gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">{getIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white mb-1 truncate">{activity.action}</div>
                    <div className="text-sm text-gray-400 line-clamp-2">{activity.details}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
