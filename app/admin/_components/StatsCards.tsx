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
  const isLoading = stats === null
  
  const cards = [
    {
      title: "Total Comparisons",
      value: stats?.total_comparisons || 0,
      icon: FileText,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Pending Review",
      value: stats?.pending || 0,
      icon: Clock,
      color: "bg-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "Published",
      value: stats?.published || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      icon: XCircle,
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg p-6 hover:border-[var(--text)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group animate-fade-in-stagger"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
                <Icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
            {isLoading ? (
              <>
                <div className="h-9 w-20 bg-[var(--border)] rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-[var(--border)] rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--text)] mb-1 transition-all duration-300 group-hover:scale-105">
                  {card.value}
                </p>
                <p className="text-sm text-[var(--text-secondary)] font-medium transition-colors duration-300 group-hover:text-[var(--text)]">
                  {card.title}
                </p>
              </>
            )}
          </div>
        )
      })}
      <style jsx>{`
        @keyframes fade-in-stagger {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.5s ease-out backwards;
        }
      `}</style>
    </div>
  )
}
