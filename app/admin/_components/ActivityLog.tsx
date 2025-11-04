"use client"

import { useState } from "react"
import { Activity, CheckCircle, XCircle, FileText } from "lucide-react"

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
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <FileText className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
        <Activity className="w-6 h-6 text-blue-500" />
        Recent Activity
      </h2>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-lg text-gray-400 font-medium">No recent activity</p>
            <p className="text-sm text-gray-500 mt-2">Activity will appear here as you review comparisons</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-start p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">{getIcon(activity.type)}</div>
                <div>
                  <div className="font-semibold text-white mb-1">{activity.action}</div>
                  <div className="text-sm text-gray-400">{activity.details}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap ml-4">{timeAgo(activity.timestamp)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
