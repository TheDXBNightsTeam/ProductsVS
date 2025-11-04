import { Clock, BarChart3, CheckCircle, XCircle } from "lucide-react"

interface Stats {
  totalComparisons: number
  pendingReviews: number
  approvedToday: number
  rejectedToday: number
}

interface StatsCardsProps {
  stats: Stats | null
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Pending Reviews",
      value: stats?.pendingReviews ?? 0,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      label: "Total Comparisons",
      value: stats?.totalComparisons ?? 0,
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Approved Today",
      value: stats?.approvedToday ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: "Rejected Today",
      value: stats?.rejectedToday ?? 0,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`p-6 bg-gray-900 border ${card.border} rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg`}
          >
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">{card.value}</div>
            <div className="text-sm font-medium text-gray-400">{card.label}</div>
          </div>
        )
      })}
    </div>
  )
}
