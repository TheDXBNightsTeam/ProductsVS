import { Clock, BarChart3, CheckCircle, XCircle, TrendingUp } from "lucide-react"

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
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/20",
      textColor: "text-yellow-400",
      iconBg: "bg-yellow-500/20",
    },
    {
      label: "Total Comparisons",
      value: stats?.totalComparisons ?? 0,
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      label: "Approved Today",
      value: stats?.approvedToday ?? 0,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      textColor: "text-green-400",
      iconBg: "bg-green-500/20",
    },
    {
      label: "Rejected Today",
      value: stats?.rejectedToday ?? 0,
      icon: XCircle,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      borderColor: "border-red-500/20",
      textColor: "text-red-400",
      iconBg: "bg-red-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`group relative p-6 bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${card.gradient.split(' ')[1]}/20 overflow-hidden`}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center backdrop-blur-sm border ${card.borderColor}`}>
                  <Icon className={`w-7 h-7 ${card.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-4xl font-extrabold ${card.textColor} mb-1`}>{card.value}</div>
                <div className="text-sm font-medium text-gray-400">{card.label}</div>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>
        )
      })}
    </div>
  )
}
