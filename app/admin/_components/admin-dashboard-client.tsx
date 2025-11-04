"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Loader2, Sparkles, Activity } from "lucide-react"
import Sidebar from "./Sidebar"
import StatsCards from "./StatsCards"
import PendingList from "./PendingList"
import LoadingSpinner from "@/components/LoadingSpinner"

// Lazy load heavy components
const ActivityLog = dynamic(() => import("./ActivityLog"), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="md" text="Loading activity..." />
      </div>
    </div>
  ),
})

interface Admin {
  id: string
  email: string
  name: string
}

interface Stats {
  totalComparisons: number
  pendingReviews: number
  approvedToday: number
  rejectedToday: number
}

export default function AdminDashboardClient() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()

      if (data.authenticated) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
        await loadStats()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Auth check error:", error)
      }
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Failed to load stats:", error)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[v0] Logout error:", error)
      }
    }
  }

  const refreshData = () => {
    loadStats()
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <Sidebar admin={admin} onLogout={handleLogout} />

      <main className="lg:ml-72 min-h-screen">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-1">Dashboard Overview</h2>
                <p className="text-gray-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Monitor and manage AI-generated comparisons
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Content Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PendingList onUpdate={refreshData} />
            </div>

            {/* Activity Log - Takes 1 column */}
            <div className="lg:col-span-1">
              <ActivityLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
