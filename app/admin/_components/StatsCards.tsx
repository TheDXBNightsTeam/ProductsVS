"use client"

import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    total_comparisons: number
    pending: number
    published: number
    rejected: number
  } | null
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Comparisons",
      value: stats?.total_comparisons || 0,
      icon: FileText,
    },
    {
      title: "Pending Review",
      value: stats?.pending || 0,
      icon: Clock,
    },
    {
      title: "Published",
      value: stats?.published || 0,
      icon: CheckCircle,
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: XCircle,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-black transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-black mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
          </div>
        )
      })}
    </div>
  )
}
